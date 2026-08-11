import { computed, watch, type Ref } from "vue"

import type { RDataTableLoading, RDataTableLoadingSide, RDataTableOptions, RDataTableSortItem } from "../components/dataTable/types"
import { deepEqual } from "../utils/value"

export function useDataTableLoading(loading: () => RDataTableLoading | undefined, fallbackColor: () => string | undefined) {
    const active = computed(() => { const value = loading(); return value != null && value !== false && value !== "false" })
    const side = computed<RDataTableLoadingSide>(() => { const value = loading(); return typeof value === "object" && value?.side ? value.side : "start" })
    const color = computed(() => { const value = loading(); return typeof value === "object" && value?.color ? value.color : typeof value === "string" && value !== "true" ? value : fallbackColor() })
    return { active, side, color }
}

export function useDataTableOptions(options: { page: Ref<number>; itemsPerPage: Ref<number>; sortBy: Ref<readonly RDataTableSortItem[]>; groupBy: Ref<readonly RDataTableSortItem[]>; search: Ref<string | undefined> }, emit: (event: "update:options", value: RDataTableOptions) => void) {
    let oldOptions: RDataTableOptions | undefined
    watch(() => ({ page: options.page.value, itemsPerPage: options.itemsPerPage.value, sortBy: options.sortBy.value, groupBy: options.groupBy.value, search: options.search.value }), value => {
        if (oldOptions && deepEqual(oldOptions, value)) return
        if (oldOptions && oldOptions.search !== value.search) options.page.value = 1
        emit("update:options", value)
        oldOptions = { ...value }
    }, { deep: true, immediate: true })
}
