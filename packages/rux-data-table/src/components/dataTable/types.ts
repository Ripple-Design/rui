import type { RIconResolvableSource } from "@ripple-design/rui"
import type { Ref } from "vue"

export type RDataTableCompareFunction<T = any> = (a: T, b: T) => number | null

export type RDataTableLoadingSide = "start" | "end" | "both"
export type RDataTableLoading = boolean | string | { side?: RDataTableLoadingSide; color?: string }
export type RDataTableSortItem = { key: string; order?: false | "asc" | "desc" }
export type RDataTableFilterMode = "some" | "every" | "union" | "intersection"
export type RDataTableMultiSort = boolean | { key?: "ctrl"; mode?: "append" | "prepend"; modifier?: "alt" | "shift" }
export type RDataTableSelectItemKey<T = Record<string, any>> = string | readonly string[] | ((item: T, fallback?: unknown) => unknown)
export type RDataTableFilterFunction<T = RDataTableItem> = (value: string, query: string, item?: T) => boolean | number | readonly [number, number] | readonly (readonly [number, number])[]

export type RDataTableHeaderCellSlot<T = any> = {
    column: RInternalDataTableHeader<T>
    sortBy: readonly RDataTableSortItem[]
    toggleSort: (column: RInternalDataTableHeader<T>, event?: MouseEvent | KeyboardEvent) => void
    isSorted: (column: RInternalDataTableHeader<T>) => boolean
    getSortIcon: (column: RInternalDataTableHeader<T>) => RIconResolvableSource
    selectAll: (value: boolean) => void
    someSelected: boolean
    allSelected: boolean
}

export type RDataTableHeaderProps<T = any> = Record<string, unknown> | ((data: RDataTableHeaderCellSlot<T>) => Record<string, unknown>)

export type RDataTableSelectionControlProps = {
    modelValue: boolean
    indeterminate?: boolean
    disabled?: boolean
    "aria-label": string
    onClick?: (event: MouseEvent) => void
    "onUpdate:modelValue"?: (value: boolean) => void
}

export type RDataTableItemCellSlot<T = any> = RDataTableCellSlot<T> & {
    isSelected: (item: RDataTableItem<T> | RDataTableItem<T>[]) => boolean
    toggleSelect: (item: RDataTableItem<T>, index?: number, event?: MouseEvent) => void
    isExpanded: (item: RDataTableItem<T>) => boolean
    toggleExpand: (item: RDataTableItem<T>) => void
}

export type RDataTableHeaderSelectSlot<T = any> = RDataTableHeaderCellSlot<T> & { props: RDataTableSelectionControlProps }
export type RDataTableItemSelectSlot<T = any> = RDataTableItemCellSlot<T> & { props: RDataTableSelectionControlProps }
export type RDataTableGroupSelectSlot = { props: RDataTableSelectionControlProps }

export type RDataTableHeader<T = Record<string, any>> = {
    key?: "data-table-group" | "data-table-select" | "data-table-expand" | (string & {})
    value?: RDataTableSelectItemKey<T>
    title?: string
    fixed?: boolean | "start" | "end"
    align?: "start" | "end" | "center"
    width?: number | string
    minWidth?: number | string
    maxWidth?: number | string
    nowrap?: boolean
    indent?: number
    headerProps?: RDataTableHeaderProps<T>
    cellProps?: Record<string, unknown> | ((data: RDataTableCellSlot<T>) => Record<string, unknown>)
    filterable?: boolean
    filterKey?: string
    sortable?: boolean
    sort?: RDataTableCompareFunction
    sortRaw?: RDataTableCompareFunction
    filter?: RDataTableFilterFunction
    children?: RDataTableHeader<T>[]
}

export type RInternalDataTableHeader<T = Record<string, any>> = Omit<RDataTableHeader<T>, "key" | "value" | "children"> & {
    key: string
    publicKey?: string
    value: RDataTableSelectItemKey<T> | null
    sortable: boolean
    fixedOffset?: number
    fixedEndOffset?: number
    lastFixed?: boolean
    firstFixedEnd?: boolean
    headerRow?: number
    colspan?: number
    rowspan?: number
    children?: RInternalDataTableHeader<T>[]
}

export type RDataTableItem<T = any> = {
    type: "item"
    key: unknown
    index: number
    virtualIndex?: number
    virtualKey?: unknown
    value: unknown
    selectable: boolean
    raw: T
    columns: Record<string, unknown>
}

export type RDataTableGroup<T = any> = {
    type: "group"
    depth: number
    id: string
    key: string
    value: unknown
    virtualIndex?: number
    virtualKey?: unknown
    items: readonly (T | RDataTableGroup<T> | RDataTableGroupSummary<T>)[]
}

export type RDataTableGroupSummary<T = any> = Omit<RDataTableGroup<T>, "type"> & { type: "group-summary" }
export type RDataTableFlatItem<T = any> = RDataTableItem<T> | RDataTableGroup<RDataTableItem<T>> | RDataTableGroupSummary<RDataTableItem<T>>

export type RDataTableCellSlot<T = any> = {
    index: number
    item: T
    internalItem: RDataTableItem<T>
    value: unknown
    column: RInternalDataTableHeader<T>
}

export type RDataTableRowProps = Record<string, unknown>
export type RDataTableItemSlot<T = any> = Omit<RDataTableCellSlot<T>, "value" | "column"> & {
    columns: RInternalDataTableHeader<T>[]
    props: RDataTableRowProps
    isSelected: (item: RDataTableItem<T> | RDataTableItem<T>[]) => boolean
    select: (items: RDataTableItem<T>[], value: boolean) => void
    toggleSelect: (item: RDataTableItem<T>, index?: number, event?: MouseEvent) => void
    isExpanded: (item: RDataTableItem<T>) => boolean
    toggleExpand: (item: RDataTableItem<T>) => void
}

export type RDataTableSelectionContext<T> = {
    allItems: RDataTableItem<T>[]
    currentPage: RDataTableItem<T>[]
}

export type RDataTableSelectStrategy<T = any> = {
    showSelectAll: boolean
    allSelected: (context: RDataTableSelectionContext<T>) => RDataTableItem<T>[]
    select: (data: { items: RDataTableItem<T>[]; value: boolean; selected: Set<unknown> }) => Set<unknown>
    selectAll: (data: RDataTableSelectionContext<T> & { value: boolean; selected: Set<unknown> }) => Set<unknown>
}

export type RDataTablePaginationOption = number | { title: string; value: number }
export type RDataTableGridlines = boolean | "horizontal" | "vertical" | "all"
export type RDataTableStriped = boolean | "odd" | "even" | null

export type RDataTableCommonProps<T = any> = {
    items?: readonly T[]
    headers?: readonly RDataTableHeader<T>[]
    itemValue?: RDataTableSelectItemKey<T>
    itemSelectable?: RDataTableSelectItemKey<T> | null
    returnObject?: boolean
    rowProps?: RDataTableRowProps | ((data: Pick<RDataTableItemSlot<T>, "index" | "item" | "internalItem">) => RDataTableRowProps)
    cellProps?: RDataTableHeader<T>["cellProps"]
    headerProps?: RDataTableHeaderProps<T>
    modelValue?: readonly unknown[]
    valueComparator?: (a: unknown, b: unknown) => boolean
    showSelect?: boolean
    selectStrategy?: "single" | "page" | "all" | RDataTableSelectStrategy<T>
    showExpand?: boolean
    expanded?: readonly unknown[]
    expandStrategy?: "multiple" | "single"
    expandOnClick?: boolean
    groupBy?: readonly RDataTableSortItem[]
    opened?: readonly string[]
    openAll?: boolean
    groupKey?: (options: { key: string; value: unknown; parentKey: string | null }) => string
    initialSortOrder?: "asc" | "desc"
    sortBy?: readonly RDataTableSortItem[]
    customKeySort?: Record<string, RDataTableCompareFunction>
    multiSort?: RDataTableMultiSort
    mustSort?: boolean
    disableSort?: boolean
    search?: string
    customFilter?: RDataTableFilterFunction
    customKeyFilter?: Record<string, RDataTableFilterFunction>
    filterKeys?: string | readonly string[]
    filterMode?: RDataTableFilterMode
    noFilter?: boolean
    loading?: RDataTableLoading
    loadingText?: string
    noDataText?: string
    hideNoData?: boolean
    hideDefaultBody?: boolean
    hideDefaultFooter?: boolean
    hideDefaultHeader?: boolean
    width?: string | number
    height?: string | number
    fixedHeader?: boolean
    fixedFooter?: boolean
    sticky?: boolean
    hover?: boolean
    striped?: RDataTableStriped
    gridlines?: RDataTableGridlines
    density?: "default" | "comfortable" | "compact" | null
    mobile?: boolean
    mobileBreakpoint?: string | number
    color?: string
    tag?: string
    sortIcon?: RIconResolvableSource
    sortAscIcon?: RIconResolvableSource
    sortDescIcon?: RIconResolvableSource
    collapseIcon?: RIconResolvableSource
    expandIcon?: RIconResolvableSource
    groupCollapseIcon?: RIconResolvableSource
    groupExpandIcon?: RIconResolvableSource
    prevIcon?: RIconResolvableSource
    nextIcon?: RIconResolvableSource
    firstIcon?: RIconResolvableSource
    lastIcon?: RIconResolvableSource
    selectAllLabel?: string
    selectRowLabel?: string
    selectGroupLabel?: string
}

export type RDataTableProps<T = any> = RDataTableCommonProps<T> & {
    page?: number | string
    itemsPerPage?: number | string
    pageBy?: "item" | "any" | "auto"
    itemsPerPageOptions?: readonly RDataTablePaginationOption[]
    itemsPerPageText?: string
    pageText?: string
    firstPageLabel?: string
    prevPageLabel?: string
    nextPageLabel?: string
    lastPageLabel?: string
    showFirstLastPage?: boolean
    showCurrentPage?: boolean
}

export type RDataTableServerProps<T = any> = RDataTableProps<T> & { itemsLength: number | string }
export type RDataTableVirtualProps<T = any> = Omit<RDataTableCommonProps<T>, "hideDefaultFooter"> & { itemHeight?: number | string | null; itemKey?: RDataTableSelectItemKey<T> | null }

export type RDataTableModelState = {
    modelValue: Ref<unknown[]>
    expanded: Ref<unknown[]>
    opened: Ref<string[]>
}

export type RDataTableOptions = { page: number; itemsPerPage: number; sortBy: readonly RDataTableSortItem[]; groupBy: readonly RDataTableSortItem[]; search?: string }

export type RDataTableEmits<T = any> = {
    (e: "update:modelValue", value: unknown[]): void
    (e: "update:page", value: number): void
    (e: "update:itemsPerPage", value: number): void
    (e: "update:sortBy", value: RDataTableSortItem[]): void
    (e: "update:groupBy", value: RDataTableSortItem[]): void
    (e: "update:expanded", value: unknown[]): void
    (e: "update:opened", value: string[]): void
    (e: "update:options", value: RDataTableOptions): void
    (e: "update:currentItems", value: RDataTableItem<T>[]): void
}

export type RDataTableServerEmits = {
    (e: "update:modelValue", value: unknown[]): void
    (e: "update:page", value: number): void
    (e: "update:itemsPerPage", value: number): void
    (e: "update:sortBy", value: RDataTableSortItem[]): void
    (e: "update:groupBy", value: RDataTableSortItem[]): void
    (e: "update:expanded", value: unknown[]): void
    (e: "update:opened", value: string[]): void
    (e: "update:options", value: RDataTableOptions): void
}

export type RDataTableVirtualEmits = {
    (e: "update:modelValue", value: unknown[]): void
    (e: "update:sortBy", value: RDataTableSortItem[]): void
    (e: "update:groupBy", value: RDataTableSortItem[]): void
    (e: "update:expanded", value: unknown[]): void
    (e: "update:opened", value: string[]): void
    (e: "update:options", value: RDataTableOptions): void
}

export type RDataTableSlotProps<T> = RDataTableItemSlot<T> & RDataTableCellSlot<T>
export type RDataTableSlots<T = any> = {
    default?: (props: RDataTableTableSlot<T>) => any
    caption?: () => any
    colgroup?: (props: RDataTableTableSlot<T>) => any
    top?: (props: RDataTableTableSlot<T>) => any
    bottom?: (props: RDataTableTableSlot<T>) => any
    thead?: (props: RDataTableTableSlot<T>) => any
    tbody?: (props: RDataTableTableSlot<T>) => any
    tfoot?: (props: RDataTableTableSlot<T>) => any
    body?: (props: RDataTableTableSlot<T>) => any
    "body.prepend"?: (props: RDataTableTableSlot<T>) => any
    "body.append"?: (props: RDataTableTableSlot<T>) => any
    "footer.prepend"?: () => any
    loader?: (props: { color?: string; isActive: boolean }) => any
    loading?: () => any
    "no-data"?: () => any
    headers?: (props: RDataTableHeaderSlot<T>) => any
    "mobile.header"?: (props: RDataTableHeaderSlot<T>) => any
    item?: (props: RDataTableItemSlot<T>) => any
    "group-header"?: (props: RDataTableGroupSlot<T>) => any
    "group-summary"?: (props: RDataTableGroupSummarySlot<T>) => any
    expanded?: (props: RDataTableItemSlot<T>) => any
    "expanded-row"?: (props: RDataTableItemSlot<T>) => any
    "data-table-group"?: (props: { item: RDataTableGroup<RDataTableItem<T>>; count: number; props: { icon: RIconResolvableSource; onClick: () => void } }) => any
    "data-table-select"?: (props: RDataTableGroupSelectSlot) => any
    "header.data-table-select"?: (props: RDataTableHeaderSelectSlot<T>) => any
    "item.data-table-select"?: (props: RDataTableItemSelectSlot<T>) => any
} & {
    [name: `header.${string}`]: ((props: RDataTableHeaderCellSlot<T>) => any) | undefined
    [name: `item.${string}`]: ((props: RDataTableItemCellSlot<T>) => any) | undefined
}
export type RDataTableVirtualSlots<T = any> = Omit<RDataTableSlots<T>, "default" | "body" | "footer.prepend" | "expanded" | "expanded-row" | "item"> & {
    item?: (props: RDataTableItemSlot<T> & { itemRef: (element: Element | null) => void }) => any
}
export type RDataTableHeaderSlot<T> = { headers: RInternalDataTableHeader<T>[][]; columns: RInternalDataTableHeader<T>[]; sortBy: readonly RDataTableSortItem[]; someSelected: boolean; allSelected: boolean; toggleSort: (column: RInternalDataTableHeader<T>, event?: MouseEvent | KeyboardEvent) => void; selectAll: (value: boolean) => void; getSortIcon: (column: RInternalDataTableHeader<T>) => RIconResolvableSource; isSorted: (column: RInternalDataTableHeader<T>) => boolean }
export type RDataTableGroupSlot<T> = { index: number; item: RDataTableGroup<RDataTableItem<T>>; columns: RInternalDataTableHeader<T>[]; isGroupOpen: (item: RDataTableGroup<RDataTableItem<T>>) => boolean; toggleGroup: (item: RDataTableGroup<RDataTableItem<T>>) => void; isExpanded: (item: RDataTableItem<T>) => boolean; toggleExpand: (item: RDataTableItem<T>) => void; isSelected: (item: RDataTableItem<T> | RDataTableItem<T>[]) => boolean; toggleSelect: (item: RDataTableItem<T>, index?: number, event?: MouseEvent) => void }
export type RDataTableGroupSummarySlot<T> = { index: number; item: RDataTableGroupSummary<RDataTableItem<T>>; columns: RInternalDataTableHeader<T>[]; toggleGroup: (item: RDataTableGroup<RDataTableItem<T>>) => void }
export type RDataTableTableSlot<T> = { page: number; itemsPerPage: number; itemsLength: number; sortBy: readonly RDataTableSortItem[]; pageCount: number; toggleSort: (column: RInternalDataTableHeader<T>, event?: MouseEvent | KeyboardEvent) => void; setItemsPerPage: (value: number) => void; prevPage: () => void; nextPage: () => void; setPage: (value: number) => void; someSelected: boolean; allSelected: boolean; isSelected: (item: RDataTableItem<T> | RDataTableItem<T>[]) => boolean; select: (items: RDataTableItem<T>[], value: boolean) => void; selectAll: (value: boolean) => void; toggleSelect: (item: RDataTableItem<T>, index?: number, event?: MouseEvent) => void; isExpanded: (item: RDataTableItem<T>) => boolean; toggleExpand: (item: RDataTableItem<T>) => void; isGroupOpen: (item: RDataTableGroup<RDataTableItem<T>>) => boolean; toggleGroup: (item: RDataTableGroup<RDataTableItem<T>>) => void; items: T[]; internalItems: RDataTableItem<T>[]; groupedItems: RDataTableFlatItem<T>[]; columns: RInternalDataTableHeader<T>[]; headers: RInternalDataTableHeader<T>[][] }
