import { computed, ref, type Ref } from "vue"

import type { RDataTableItem, RDataTableSelectionContext, RDataTableSelectStrategy } from "../components/dataTable/types"
import { deepEqual } from "../utils/value"

function withItems<T>(selected: Set<unknown>, items: RDataTableItem<T>[], value: boolean) {
    const next = new Set(selected)
    for (const item of items.filter(item => item.selectable)) {
        if (value) next.add(item.value)
        else next.delete(item.value)
    }
    return next
}

function builtInStrategy<T>(strategy: "single" | "page" | "all"): RDataTableSelectStrategy<T> {
    if (strategy === "single") {
        return {
            showSelectAll: false,
            allSelected: () => [],
            select: ({ items, value }) => value && items[0]?.selectable ? new Set([items[0].value]) : new Set(),
            selectAll: ({ value, currentPage }) => value && currentPage[0]?.selectable ? new Set([currentPage[0].value]) : new Set(),
        }
    }
    const all = strategy === "all"
    return {
        showSelectAll: true,
        allSelected: ({ allItems, currentPage }) => all ? allItems : currentPage,
        select: ({ items, value, selected }) => withItems(selected, items, value),
        selectAll: ({ value, selected, allItems, currentPage }) => withItems(selected, all ? allItems : currentPage, value),
    }
}

export function useDataTableSelection<T>(props: { selectStrategy?: "single" | "page" | "all" | RDataTableSelectStrategy<T>; valueComparator?: (a: unknown, b: unknown) => boolean }, selected: Ref<unknown[]>, allItems: Ref<RDataTableItem<T>[]>, currentPage: Ref<readonly RDataTableItem<T>[]>) {
    const lastSelectedIndex = ref<number | null>(null)
    const comparator = (a: unknown, b: unknown) => props.valueComparator?.(a, b) ?? deepEqual(a, b)
    const isSelected = (items: RDataTableItem<T> | RDataTableItem<T>[]) => (Array.isArray(items) ? items : [items]).every(item => selected.value.some(value => comparator(value, item.value)))
    const strategy = computed(() => typeof props.selectStrategy === "object" ? props.selectStrategy : builtInStrategy(props.selectStrategy ?? "page"))
    const context = computed(() => ({ allItems: allItems.value, currentPage: [...currentPage.value] }))
    function update(values: Set<unknown>) { selected.value = [...values] }
    function toComparableSet() {
        const result = new Set<unknown>()
        for (const value of selected.value) {
            const item = allItems.value.find(item => comparator(item.value, value))
            result.add(item?.value ?? value)
        }
        return result
    }
    function select(items: RDataTableItem<T>[], value: boolean) { update(strategy.value.select({ items, value, selected: toComparableSet() })) }
    function toggleSelect(item: RDataTableItem<T>, index?: number, event?: MouseEvent) {
        if (!item.selectable) return
        const pageItems = currentPage.value
        const itemIndex = index ?? pageItems.findIndex(current => comparator(current.value, item.value))
        const shouldSelect = !isSelected(item)
        if (typeof props.selectStrategy !== "object" && props.selectStrategy !== "single" && event?.shiftKey && lastSelectedIndex.value != null && itemIndex >= 0) {
            const [start, end] = [lastSelectedIndex.value, itemIndex].sort((a, b) => a - b)
            select(pageItems.slice(start!, end! + 1) as RDataTableItem<T>[], shouldSelect)
            return
        }
        lastSelectedIndex.value = itemIndex >= 0 ? itemIndex : null
        select([item], shouldSelect)
    }
    function selectAll(value: boolean) { update(strategy.value.selectAll({ ...context.value, value, selected: toComparableSet() })) }
    const selectableScope = computed(() => strategy.value.allSelected(context.value as RDataTableSelectionContext<T>).filter(item => item.selectable))
    const someSelected = computed(() => selectableScope.value.some(item => isSelected(item)))
    const allSelected = computed(() => !!selectableScope.value.length && isSelected(selectableScope.value as RDataTableItem<T>[]))
    const hasSelectableItems = computed(() => selectableScope.value.length > 0)
    return { isSelected, select, toggleSelect, selectAll, someSelected, allSelected, hasSelectableItems, showSelectAll: computed(() => strategy.value.showSelectAll) }
}
