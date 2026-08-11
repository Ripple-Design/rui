import { computed, type Ref } from "vue"

import type { RDataTableCompareFunction, RDataTableItem, RDataTableMultiSort, RDataTableSortItem } from "../components/dataTable/types"
import { getObjectValueByPath } from "../utils/value"

export function sortItems<T extends RDataTableItem>(items: readonly T[], sortBy: readonly RDataTableSortItem[], locale = "en", options?: { sortFunctions?: Record<string, RDataTableCompareFunction>; sortRawFunctions?: Record<string, RDataTableCompareFunction> }): T[] {
    const collator = new Intl.Collator(locale, { sensitivity: "accent", usage: "sort" })
    return items.map((item, index) => ({ item, index })).sort((a, b) => {
        for (const descriptor of sortBy) {
            if (descriptor.order === false) continue
            let left = getObjectValueByPath({ ...a.item.raw as object, ...a.item.columns }, descriptor.key)
            let right = getObjectValueByPath({ ...b.item.raw as object, ...b.item.columns }, descriptor.key)
            let rawLeft = a.item.raw
            let rawRight = b.item.raw
            if (descriptor.order === "desc") [left, right, rawLeft, rawRight] = [right, left, rawRight, rawLeft]
            const rawResult = options?.sortRawFunctions?.[descriptor.key]?.(rawLeft, rawRight)
            if (rawResult != null && rawResult !== 0) return rawResult
            const result = options?.sortFunctions?.[descriptor.key]?.(left, right)
            if (result != null && result !== 0) return result
            if (left instanceof Date && right instanceof Date) [left, right] = [left.getTime(), right.getTime()]
            if (left == null && right != null) return -1
            if (right == null && left != null) return 1
            if (left != null && right != null) {
                const aValue = String(left).toLocaleLowerCase()
                const bValue = String(right).toLocaleLowerCase()
                if (aValue !== bValue) return !Number.isNaN(Number(aValue)) && !Number.isNaN(Number(bValue)) ? Number(aValue) - Number(bValue) : collator.compare(aValue, bValue)
            }
        }
        return a.index - b.index
    }).map(({ item }) => item)
}

function resolveMultiSort(value: RDataTableMultiSort | undefined, event?: MouseEvent | KeyboardEvent) {
    if (value === true) return { active: true, mode: "append" as const }
    if (!value || typeof value !== "object") return { active: false, mode: "append" as const }
    const keyPressed = value.key == null || Boolean(event?.ctrlKey || event?.metaKey)
    const modifierPressed = value.modifier === "alt" ? event?.altKey : value.modifier === "shift" ? event?.shiftKey : false
    return { active: keyPressed, mode: modifierPressed ? (value.mode === "prepend" ? "append" : "prepend") : (value.mode ?? "append") }
}

export function useDataTableSort<T extends RDataTableItem>(items: Ref<T[]>, sortBy: Ref<readonly RDataTableSortItem[]>, props: { customKeySort?: Record<string, RDataTableCompareFunction>; initialSortOrder?: "asc" | "desc"; multiSort?: RDataTableMultiSort; mustSort?: boolean; disableSort?: boolean }, emit: (event: "update:sortBy", value: RDataTableSortItem[]) => void, page?: Ref<number>, headerSortFunctions?: Ref<Record<string, RDataTableCompareFunction>>, headerSortRawFunctions?: Ref<Record<string, RDataTableCompareFunction>>, groupBy?: Ref<readonly RDataTableSortItem[]>) {
    const sortedItems = computed(() => {
        const groupSort = (groupBy?.value ?? []).map(item => ({ ...item, order: item.order ?? false }))
        return sortItems(items.value, [...groupSort, ...(props.disableSort ? [] : sortBy.value)], "en", { sortFunctions: { ...props.customKeySort, ...headerSortFunctions?.value }, sortRawFunctions: headerSortRawFunctions?.value })
    })
    function toggleSort(column: { publicKey?: string; sortable: boolean }, event?: MouseEvent | KeyboardEvent) {
        if (props.disableSort || !column.publicKey || !column.sortable) return
        const key = column.publicKey
        let next = sortBy.value.map(item => ({ ...item }))
        const current = next.find(item => item.key === key)
        const initial = props.initialSortOrder ?? "asc"
        const secondary = initial === "asc" ? "desc" : "asc"
        const multi = resolveMultiSort(props.multiSort, event)
        if (!current) {
            const value = { key, order: initial } as RDataTableSortItem
            next = multi.active ? (multi.mode === "prepend" ? [value, ...next] : [...next, value]) : [value]
        } else if (current.order === secondary) next = props.mustSort && next.length === 1 ? [{ key, order: initial }] : next.filter(item => item.key !== key)
        else current.order = secondary
        emit("update:sortBy", next)
        if (page) page.value = 1
    }
    const isSorted = (column: { publicKey?: string }) => !!sortBy.value.find(item => item.key === column.publicKey)
    return { sortedItems, toggleSort, isSorted }
}
