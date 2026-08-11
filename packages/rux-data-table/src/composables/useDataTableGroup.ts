import { computed, watch, type Ref } from "vue"

import type { RDataTableFlatItem, RDataTableGroup, RDataTableGroupSummary, RDataTableItem, RDataTableSortItem } from "../components/dataTable/types"

function defaultGroupId(key: string, value: unknown, parentKey: string): string {
    return `${parentKey}_${key}_${String(value)}`
}

export function groupDataTableItems<T>(items: readonly RDataTableItem<T>[], keys: readonly string[], groupKey?: (options: { key: string; value: unknown; parentKey: string | null }) => string, depth = 0, parentKey = "root"): RDataTableGroup<RDataTableItem<T>>[] {
    if (!keys.length) return []
    const [key, ...rest] = keys
    if (!key) return []
    const buckets = new Map<unknown, RDataTableItem<T>[]>()
    for (const item of items) {
        const value = item.columns[key]
        buckets.set(value, [...(buckets.get(value) ?? []), item])
    }
    return [...buckets].map(([value, grouped]) => {
        const id = groupKey?.({ key, value, parentKey: depth === 0 ? null : parentKey }) ?? defaultGroupId(key, value, parentKey)
        return { type: "group", depth, id, key, value, items: rest.length ? groupDataTableItems(grouped, rest, groupKey, depth + 1, id) : grouped }
    })
}

export function flattenDataTableGroups<T>(items: readonly (RDataTableItem<T> | RDataTableGroup<RDataTableItem<T>> | RDataTableGroupSummary<RDataTableItem<T>>)[], opened: Set<string>, summaries: boolean): RDataTableFlatItem<T>[] {
    const result: RDataTableFlatItem<T>[] = []
    for (const item of items) {
        if (item.type !== "group") {
            result.push(item)
            continue
        }
        if (item.value != null) result.push(item)
        if (opened.has(item.id) || item.value == null) {
            result.push(...flattenDataTableGroups(item.items, opened, summaries))
            if (summaries) result.push({ ...item, type: "group-summary" })
        }
    }
    return result
}

export function extractDataTableRows<T>(items: readonly RDataTableFlatItem<T>[]): RDataTableItem<T>[] {
    const rows: RDataTableItem<T>[] = []
    for (const item of items) {
        if (item.type === "item") rows.push(item)
        if (item.type === "group") rows.push(...extractDataTableRows(item.items as RDataTableFlatItem<T>[]))
    }
    return [...new Map(rows.map(row => [row.index, row])).values()]
}

function collectGroupIds<T>(groups: readonly RDataTableGroup<RDataTableItem<T>>[]) {
    const ids: string[] = []
    const collect = (entries: readonly RDataTableGroup<RDataTableItem<T>>[]) => entries.forEach(entry => {
        ids.push(entry.id)
        collect(entry.items.filter((item): item is RDataTableGroup<RDataTableItem<T>> => item.type === "group"))
    })
    collect(groups)
    return ids
}

export function useDataTableGroup<T>(props: { openAll?: boolean; groupKey?: (options: { key: string; value: unknown; parentKey: string | null }) => string }, groupBy: Ref<readonly RDataTableSortItem[]>, opened: Ref<string[]>, items: Ref<RDataTableItem<T>[]>, hasSummary: Ref<boolean>) {
    const openedSet = computed(() => new Set(opened.value))
    const groups = computed(() => groupDataTableItems(items.value, groupBy.value.map(item => item.key), props.groupKey))
    watch([groups, () => props.openAll], ([value, openAll], [previousGroups]) => {
        if (!openAll) return
        const ids = collectGroupIds(value)
        const previousIds = collectGroupIds(previousGroups ?? [])
        const existing = new Set(opened.value)
        const previous = new Set(previousIds)
        const next = opened.value.filter(id => ids.includes(id) || !previous.has(id))
        for (const id of ids) if (!previous.has(id) && !existing.has(id)) next.push(id)
        if (next.length !== opened.value.length || next.some((id, index) => id !== opened.value[index])) opened.value = next
    }, { immediate: true })
    const flatItems = computed(() => groupBy.value.length ? flattenDataTableGroups(groups.value, openedSet.value, hasSummary.value) : items.value)
    function isGroupOpen(group: RDataTableGroup<RDataTableItem<T>>) { return openedSet.value.has(group.id) }
    function toggleGroup(group: RDataTableGroup<RDataTableItem<T>>) {
        const next = new Set(opened.value)
        if (next.has(group.id)) next.delete(group.id)
        else next.add(group.id)
        opened.value = [...next]
    }
    return { groups, flatItems, opened: openedSet, isGroupOpen, toggleGroup, extractRows: extractDataTableRows }
}
