import type { Ref } from "vue"

import type { RDataTableItem } from "../components/dataTable/types"
import { deepEqual } from "../utils/value"

export function useDataTableExpand<T>(props: { expandStrategy?: "multiple" | "single" }, expanded: Ref<unknown[]>) {
    const isExpanded = (item: RDataTableItem<T>) => expanded.value.some(value => deepEqual(value, item.value))
    function expand(item: RDataTableItem<T>, value: boolean) {
        const next = props.expandStrategy === "single" && value ? [] : [...expanded.value]
        const index = next.findIndex(current => deepEqual(current, item.value))
        if (value && index === -1) next.push(item.value)
        if (!value && index !== -1) next.splice(index, 1)
        expanded.value = next
    }
    function toggleExpand(item: RDataTableItem<T>) { expand(item, !isExpanded(item)) }
    return { expanded, isExpanded, expand, toggleExpand }
}
