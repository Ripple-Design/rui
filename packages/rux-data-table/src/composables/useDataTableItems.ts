import { computed, type ComputedRef, type Ref } from "vue"

import type { RDataTableItem, RInternalDataTableHeader } from "../components/dataTable/types"
import { getPropertyFromItem } from "../utils/value"

export function transformItem<T>(
    props: { itemValue?: any; itemSelectable?: any; returnObject?: boolean },
    item: T,
    index: number,
    columns: RInternalDataTableHeader<T>[],
): RDataTableItem<T> {
    const value = props.returnObject ? item : getPropertyFromItem(item, props.itemValue ?? "id")
    const selectable = Boolean(getPropertyFromItem(item, props.itemSelectable, true))
    const itemColumns = columns.reduce<Record<string, unknown>>((result, column) => {
        result[column.key] = getPropertyFromItem(item, column.value)
        if (column.filterKey && column.filterKey !== column.key) result[column.filterKey] = getPropertyFromItem(item, column.filterKey)
        return result
    }, {})

    return { type: "item", key: props.returnObject ? getPropertyFromItem(item, props.itemValue ?? "id") : value, index, value, selectable, columns: itemColumns, raw: item }
}

export function useDataTableItems<T>(props: { items?: readonly T[]; itemValue?: any; itemSelectable?: any; returnObject?: boolean }, columns: Ref<RInternalDataTableHeader<T>[]>): { items: ComputedRef<RDataTableItem<T>[]> } {
    const items = computed(() => (props.items ?? []).map((item, index) => transformItem(props, item, index, columns.value)))
    return { items }
}
