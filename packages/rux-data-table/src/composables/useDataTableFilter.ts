import { computed, type Ref } from "vue"

import type { RDataTableFilterFunction, RDataTableFilterMode, RDataTableItem } from "../components/dataTable/types"
import { getObjectValueByPath } from "../utils/value"

export function defaultFilter(value: unknown, query: string): boolean {
    return value != null && String(value).toLocaleLowerCase().includes(query.toLocaleLowerCase())
}

function matches(result: ReturnType<RDataTableFilterFunction>): boolean {
    return result !== false && result !== -1
}

export function useDataTableFilter<T extends RDataTableItem>(props: { customFilter?: RDataTableFilterFunction; customKeyFilter?: Record<string, RDataTableFilterFunction>; filterKeys?: string | readonly string[]; filterMode?: RDataTableFilterMode; noFilter?: boolean }, items: Ref<T[]>, search: Ref<string | undefined>, headerKeyFilter: Ref<Record<string, RDataTableFilterFunction>>, headerFilterKeys: Ref<readonly string[]>) {
    const filteredItems = computed(() => {
        const query = search.value ?? ""
        const keyFilters = { ...props.customKeyFilter, ...headerKeyFilter.value }
        if (props.noFilter || (!query && !Object.keys(keyFilters).length)) return items.value
        const keys = props.filterKeys ? (Array.isArray(props.filterKeys) ? props.filterKeys : [props.filterKeys]) : headerFilterKeys.value
        return items.value.filter(item => {
            const filterKeys = keys.length ? keys : Object.keys(item.columns)
            const results = filterKeys.map(key => {
                const filter = keyFilters[key] ?? props.customFilter ?? defaultFilter
                return matches(filter(String(getObjectValueByPath(item.columns, key) ?? ""), query, item))
            })
            switch (props.filterMode ?? "union") {
                case "every":
                case "intersection": return results.every(Boolean)
                case "some":
                case "union": return results.some(Boolean)
            }
        })
    })
    return { filteredItems }
}
