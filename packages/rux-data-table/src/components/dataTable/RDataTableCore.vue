<script setup lang="ts" generic="T">
import {
    RIArrowDropDownFilled,
    RIArrowDropUpFilled,
    RIChevronLeftFilled,
    RIChevronRightFilled,
    RIExpandLessFilled,
    RIExpandMoreFilled,
    RIFirstPageFilled,
    RILastPageFilled,
} from "@ripple-design/icons"
import {
    RCheckbox,
    RIconButton,
    RLinearProgressIndicator,
    RSelectField,
    RSelectOption,
    RSurface,
} from "@ripple-design/rui"
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    useAttrs,
    useSlots,
    watch,
    type CSSProperties,
    type Slots,
} from "vue"

import type {
    RDataTableCommonProps,
    RDataTableEmits,
    RDataTableFlatItem,
    RDataTableItem,
    RDataTableModelState,
    RDataTablePaginationOption,
} from "./types"

import { useDataTableExpand } from "../../composables/useDataTableExpand"
import { useDataTableFilter } from "../../composables/useDataTableFilter"
import { useDataTableGroup } from "../../composables/useDataTableGroup"
import { useDataTableHeaders } from "../../composables/useDataTableHeaders"
import { useDataTableItems } from "../../composables/useDataTableItems"
import { useDataTableLoading, useDataTableOptions } from "../../composables/useDataTableOptions"
import { useDataTablePagination } from "../../composables/useDataTablePagination"
import { useDataTableSelection } from "../../composables/useDataTableSelection"
import { useDataTableSort } from "../../composables/useDataTableSort"
import { useDataTableVirtual } from "../../composables/useDataTableVirtual"
import { useDataTableRowMeasurement } from "../../foundations/useDataTableRowMeasurement"
import { toUnit } from "../../utils/value"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<
        RDataTableCommonProps<T> & {
            page?: number | string
            itemsPerPage?: number | string
            itemsLength?: number | string
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
            itemHeight?: number | string | null
            itemKey?: any
            modelState: RDataTableModelState
            server?: boolean
            virtualTable?: boolean
        }
    >(),
    {
        items: () => [],
        headers: undefined,
        itemValue: "id",
        itemSelectable: null,
        returnObject: false,
        modelValue: () => [],
        selectStrategy: "page",
        expanded: () => [],
        expandStrategy: "multiple",
        groupBy: () => [],
        opened: () => [],
        openAll: false,
        initialSortOrder: "asc",
        sortBy: () => [],
        multiSort: false,
        mustSort: false,
        disableSort: false,
        filterMode: "union",
        noFilter: false,
        loading: false,
        loadingText: "Loading…",
        noDataText: "No data available",
        hideNoData: false,
        hideDefaultBody: false,
        hideDefaultFooter: false,
        hideDefaultHeader: false,
        fixedHeader: false,
        fixedFooter: false,
        sticky: false,
        hover: false,
        striped: null,
        gridlines: "horizontal",
        tag: "div",
        selectAllLabel: "Select all rows",
        selectRowLabel: "Select row",
        selectGroupLabel: "Select group",
        mobileBreakpoint: 600,
        page: 1,
        itemsPerPage: 10,
        pageBy: "any",
        itemsPerPageOptions: () => [10, 25, 50, 100, -1],
        itemsPerPageText: "Rows per page",
        pageText: "{0}-{1} of {2}",
        firstPageLabel: "First page",
        prevPageLabel: "Previous page",
        nextPageLabel: "Next page",
        lastPageLabel: "Last page",
        showFirstLastPage: true,
        showCurrentPage: false,
        itemHeight: null,
        itemKey: null,
        server: false,
        virtualTable: false,
    },
)
const emit = defineEmits<RDataTableEmits>()
const attrs = useAttrs()
const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.endsWith(":row") && !key.endsWith(":groupHeader"))),
)
const slots: Slots = useSlots()

const page = ref(Number(props.page))
const itemsPerPage = ref(props.virtualTable ? -1 : Number(props.itemsPerPage))
const sortBy = ref([...props.sortBy])
const groupBy = ref([...props.groupBy])
const search = ref(props.search)
const mobile = ref(Boolean(props.mobile))
const hasGroupSummary = computed(() => !!slots["group-summary"])
const tableElement = ref<HTMLTableElement | null>(null)

watch(
    () => props.page,
    (value) => {
        page.value = Number(value)
    },
)
watch(
    () => props.itemsPerPage,
    (value) => {
        if (!props.virtualTable) itemsPerPage.value = Number(value)
    },
)
watch(
    () => props.sortBy,
    (value) => {
        sortBy.value = [...value]
    },
)
watch(
    () => props.groupBy,
    (value) => {
        groupBy.value = [...value]
    },
)
watch(
    () => props.search,
    (value) => {
        search.value = value
    },
)
watch(page, (value) => {
    if (!props.virtualTable) emit("update:page", value)
})
watch(itemsPerPage, (value) => {
    if (!props.virtualTable) emit("update:itemsPerPage", value)
})
watch(sortBy, (value) => emit("update:sortBy", [...value]), { deep: true })
watch(groupBy, (value) => emit("update:groupBy", [...value]), { deep: true })

const headerState = useDataTableHeaders(props)
const itemState = useDataTableItems(props, headerState.columns)
const filterState = useDataTableFilter(
    props,
    itemState.items,
    search,
    headerState.filterFunctions,
    headerState.filterKeys,
)
const filteredItems = computed(() => (props.server ? itemState.items.value : filterState.filteredItems.value))
const sortState = useDataTableSort(
    filteredItems,
    sortBy,
    props,
    emit,
    props.virtualTable ? undefined : page,
    headerState.sortFunctions,
    headerState.sortRawFunctions,
    groupBy,
)
const sourceItems = computed(() => (props.server ? itemState.items.value : sortState.sortedItems.value))
const pageBy = computed<"item" | "any" | "group">(() =>
    props.pageBy === "auto" ? (groupBy.value.length ? "group" : "item") : props.pageBy === "any" ? "any" : "item",
)
const provisionalItemCount = computed(() => (props.server ? Number(props.itemsLength ?? 0) : sourceItems.value.length))
const provisionalPagination = useDataTablePagination(page, itemsPerPage, provisionalItemCount)
const groupInput = computed(() =>
    !props.server && !props.virtualTable && pageBy.value === "item"
        ? sourceItems.value.slice(provisionalPagination.startIndex.value, provisionalPagination.stopIndex.value)
        : sourceItems.value,
)
const groupState = useDataTableGroup(props, groupBy, props.modelState.opened, groupInput, hasGroupSummary)
const paginationItemsLength = computed(() => {
    if (props.server) return Number(props.itemsLength ?? 0)
    if (props.virtualTable) return sourceItems.value.length
    if (pageBy.value === "item") return sourceItems.value.length
    if (pageBy.value === "group") return groupState.groups.value.length
    return groupState.flatItems.value.length
})
const paginationState = useDataTablePagination(page, itemsPerPage, paginationItemsLength)
const displayedItems = computed<RDataTableFlatItem<T>[]>(() => {
    if (props.server || props.virtualTable || pageBy.value === "item") return groupState.flatItems.value
    if (pageBy.value === "any")
        return groupState.flatItems.value.slice(paginationState.startIndex.value, paginationState.stopIndex.value)
    const groups = groupState.groups.value
    const selected = groups.slice(paginationState.startIndex.value, paginationState.stopIndex.value)
    if (!selected.length) return []
    const first = groupState.flatItems.value.findIndex(
        (entry) => entry.type === "group" && entry.id === selected[0]!.id,
    )
    const lastGroup = selected.at(-1)!
    const nextGroup = groups[groups.indexOf(lastGroup) + 1]
    const last = nextGroup
        ? groupState.flatItems.value.findIndex((entry) => entry.type === "group" && entry.id === nextGroup.id)
        : groupState.flatItems.value.length
    return groupState.flatItems.value.slice(Math.max(0, first), last < 0 ? groupState.flatItems.value.length : last)
})
const renderedItems = displayedItems
const currentPageItems = computed(() => groupState.extractRows(renderedItems.value))
const itemCount = computed(() => (props.server ? Number(props.itemsLength ?? 0) : sourceItems.value.length))
const selectionState = useDataTableSelection(props, props.modelState.modelValue, itemState.items, currentPageItems)
const expandState = useDataTableExpand(props, props.modelState.expanded)
const loadingState = useDataTableLoading(
    () => props.loading,
    () => props.color,
)
const virtualState = useDataTableVirtual(
    { itemHeight: props.itemHeight, itemKey: props.itemKey, height: props.height },
    renderedItems,
)
const rowMeasurement = useDataTableRowMeasurement(virtualState.handleItemResize)
const visibleItems = computed(() =>
    props.virtualTable
        ? virtualState.computedItems.value.map((item) => {
              const raw = item.raw
              return raw.type === "item"
                  ? { ...raw, virtualIndex: item.index, virtualKey: item.key }
                  : { ...raw, virtualIndex: item.index, virtualKey: item.key }
          })
        : renderedItems.value,
)
const scrollStyle = computed(() => ({
    maxBlockSize: toUnit(props.height),
    blockSize: props.virtualTable ? toUnit(props.height) : undefined,
}))
const virtualRowStyle = computed(() =>
    props.virtualTable ? { minBlockSize: `${virtualState.itemHeight.value}px` } : undefined,
)
const stripedMode = computed<"odd" | "even" | null>(() =>
    props.striped ? "even" : !props.striped ? null : (props.striped ?? null),
)
const footerOptions = computed(() =>
    props.itemsPerPageOptions.map((option) =>
        typeof option === "number" ? { title: option === -1 ? "All" : String(option), value: option } : option,
    ),
)
const slotProps = computed(() => ({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    itemsLength: itemCount.value,
    sortBy: sortBy.value,
    pageCount: paginationState.pageCount.value,
    toggleSort: sortState.toggleSort,
    setItemsPerPage: paginationState.setItemsPerPage,
    prevPage: paginationState.prevPage,
    nextPage: paginationState.nextPage,
    setPage: paginationState.setPage,
    someSelected: selectionState.someSelected.value,
    allSelected: selectionState.allSelected.value,
    isSelected: selectionState.isSelected,
    select: selectionState.select,
    selectAll: selectionState.selectAll,
    toggleSelect: selectionState.toggleSelect,
    isExpanded: expandState.isExpanded,
    toggleExpand: expandState.toggleExpand,
    isGroupOpen: groupState.isGroupOpen,
    toggleGroup: groupState.toggleGroup,
    items: currentPageItems.value.map((item) => item.raw),
    internalItems: currentPageItems.value,
    groupedItems: renderedItems.value,
    columns: headerState.columns.value,
    headers: headerState.headers.value,
}))

useDataTableOptions({ page, itemsPerPage, sortBy, groupBy, search }, emit)
watch(
    currentPageItems,
    (value) => {
        if (!props.server && !props.virtualTable) emit("update:currentItems", value)
    },
    { immediate: true },
)

function renderCellValue(item: RDataTableItem<T>, key: string) {
    return item.columns[key]
}

function headerCellSlot(column: (typeof headerState.columns.value)[number]) {
    return {
        column,
        sortBy: sortBy.value,
        toggleSort: sortState.toggleSort,
        isSorted: sortState.isSorted,
        getSortIcon: sortIcon,
        selectAll: selectionState.selectAll,
        someSelected: selectionState.someSelected.value,
        allSelected: selectionState.allSelected.value,
    }
}

function resolveHeaderProps(column: (typeof headerState.columns.value)[number]) {
    const data = headerCellSlot(column)
    const globalProps = typeof props.headerProps === "function" ? props.headerProps(data) : props.headerProps
    const columnProps = typeof column.headerProps === "function" ? column.headerProps(data) : column.headerProps
    return { ...globalProps, ...columnProps }
}

function resolveRowProps(item: RDataTableItem<T>, index: number) {
    const rowProps =
        typeof props.rowProps === "function"
            ? props.rowProps({ item: item.raw, internalItem: item, index })
            : props.rowProps
    const slotData = {
        index,
        item: item.raw,
        internalItem: item,
        columns: headerState.columns.value,
        props: rowProps ?? {},
    }
    const rowListeners = Object.fromEntries(
        Object.entries(attrs)
            .filter(([key]) => key.endsWith(":row"))
            .map(([key, listener]) => [
                key.replace(/:row$/, ""),
                (event: Event) => invokeListener(listener, event, slotData),
            ]),
    )
    return { ...rowProps, ...rowListeners }
}

function invokeListener(listener: unknown, event: Event, slotData: unknown) {
    if (typeof listener === "function") listener(event, slotData)
    else if (Array.isArray(listener))
        listener.forEach((handler) => {
            if (typeof handler === "function") handler(event, slotData)
        })
}

function groupHeaderClick(event: Event, item: import("./types").RDataTableGroup<RDataTableItem<T>>, index: number) {
    invokeListener(attrs["onClick:groupHeader"], event, {
        index,
        item,
        columns: headerState.columns.value,
        isGroupOpen: groupState.isGroupOpen,
        toggleGroup: groupState.toggleGroup,
    })
}

function resolveCellProps(item: RDataTableItem<T>, column: (typeof headerState.columns.value)[number], index: number) {
    const value = renderCellValue(item, column.key)
    const data = { item: item.raw, internalItem: item, index, value, column }
    const globalProps = typeof props.cellProps === "function" ? props.cellProps(data) : props.cellProps
    const columnProps = typeof column.cellProps === "function" ? column.cellProps(data) : column.cellProps
    return { ...globalProps, ...columnProps }
}

function fixedStyle(column: (typeof headerState.columns.value)[number]) {
    if (!column.fixed) return undefined
    const styles: CSSProperties = {
        position: "sticky",
        insetInlineStart: column.fixed === "start" || column.fixed === true ? toUnit(column.fixedOffset) : undefined,
        insetInlineEnd: column.fixed === "end" ? toUnit(column.fixedEndOffset) : undefined,
    }
    return styles
}

function headerAriaSort(column: (typeof headerState.columns.value)[number]) {
    const descriptor = column.publicKey ? sortBy.value.find((item) => item.key === column.publicKey) : undefined
    return descriptor?.order === "asc" ? "ascending" : descriptor?.order === "desc" ? "descending" : undefined
}

function sortIcon(column: (typeof headerState.columns.value)[number]) {
    const descriptor = column.publicKey ? sortBy.value.find((item) => item.key === column.publicKey) : undefined
    if (!descriptor) return props.sortIcon ?? props.sortAscIcon ?? RIArrowDropUpFilled
    return descriptor.order === "desc"
        ? (props.sortDescIcon ?? RIArrowDropDownFilled)
        : (props.sortAscIcon ?? RIArrowDropUpFilled)
}

function isMultiSortEnabled() {
    return props.multiSort || typeof props.multiSort === "object"
}

function groupItemCount(group: import("./types").RDataTableGroup<RDataTableItem<T>>) {
    return groupState.extractRows(group.items as RDataTableFlatItem<T>[]).length
}

function groupRows(group: import("./types").RDataTableGroup<RDataTableItem<T>>) {
    return groupState.extractRows(group.items as RDataTableFlatItem<T>[])
}

function selectableGroupRows(group: import("./types").RDataTableGroup<RDataTableItem<T>>) {
    return groupRows(group).filter((item) => item.selectable)
}

function headerSelectProps() {
    return {
        modelValue: selectionState.allSelected.value,
        indeterminate: selectionState.someSelected.value && !selectionState.allSelected.value,
        "aria-label": props.selectAllLabel,
        onClick: (event: MouseEvent) => event.stopPropagation(),
        "onUpdate:modelValue": selectionState.selectAll,
    }
}

function rowSelectProps(entry: RDataTableItem<T>, index: number) {
    return {
        modelValue: selectionState.isSelected(entry),
        disabled: !entry.selectable,
        "aria-label": props.selectRowLabel,
        onClick: (event: MouseEvent) => {
            event.stopPropagation()
            selectionState.toggleSelect(entry, index, event)
        },
    }
}

function groupSelectProps(group: import("./types").RDataTableGroup<RDataTableItem<T>>) {
    const rows = selectableGroupRows(group)
    const selected = rows.length > 0 && selectionState.isSelected(rows)
    const indeterminate = rows.some((item) => selectionState.isSelected(item)) && !selected
    return {
        modelValue: selected,
        indeterminate,
        disabled: rows.length === 0,
        "aria-label": props.selectGroupLabel,
        onClick: (event: MouseEvent) => event.stopPropagation(),
        "onUpdate:modelValue": (value: boolean) => selectionState.select(rows, value),
    }
}
function resolveMobile() {
    if (props.mobile != null) {
        mobile.value = props.mobile
        return
    }
    mobile.value = window.matchMedia(
        `(max-width: ${typeof props.mobileBreakpoint === "number" ? `${props.mobileBreakpoint}px` : props.mobileBreakpoint})`,
    ).matches
}

function handleResize() {
    resolveMobile()
}

watch([() => props.mobile, () => props.mobileBreakpoint], resolveMobile)
onMounted(() => {
    resolveMobile()
    window.addEventListener("resize", handleResize)
})
onBeforeUnmount(() => window.removeEventListener("resize", handleResize))

defineExpose({ calculateVisibleItems: virtualState.calculateVisibleItems, scrollToIndex: virtualState.scrollToIndex })
</script>

<template>
    <RSurface
        v-bind="rootAttrs"
        :as="tag"
        class="rux-data-table"
        variant="outlined"
        :class="{
            'rux-data-table--hover': hover,
            'rux-data-table--striped-odd': stripedMode === 'odd',
            'rux-data-table--striped-even': stripedMode === 'even',
            'rux-data-table--gridlines-horizontal':
                gridlines === true || gridlines === 'horizontal' || gridlines === 'all',
            'rux-data-table--gridlines-vertical': gridlines === true || gridlines === 'vertical' || gridlines === 'all',
            'rux-data-table--compact': density === 'compact',
            'rux-data-table--comfortable': density === 'comfortable',
            'rux-data-table--mobile': mobile,
            'rux-data-table--fixed-header': fixedHeader || sticky,
            'rux-data-table--fixed-footer': fixedFooter,
        }"
    >
        <slot v-if="$slots.default" v-bind="slotProps" />
        <template v-else>
            <slot name="top" v-bind="slotProps" />
            <div
                :ref="virtualState.containerRef"
                class="rux-data-table__scroll"
                :style="scrollStyle"
                @scroll.passive="virtualState.handleScroll"
            >
                <table ref="tableElement" class="rux-data-table__table" :style="{ inlineSize: toUnit(width) }">
                    <caption v-if="$slots.caption">
                        <slot name="caption" />
                    </caption>
                    <slot name="colgroup" v-bind="slotProps" />
                    <thead
                        v-if="!hideDefaultHeader"
                        class="rux-data-table__head"
                        :class="{ 'rux-data-table__head--mobile-slot': mobile && $slots['mobile.header'] }"
                    >
                        <slot
                            v-if="mobile && $slots['mobile.header']"
                            name="mobile.header"
                            :headers="headerState.headers.value"
                            :columns="headerState.columns.value"
                            :sort-by="sortBy"
                            :some-selected="selectionState.someSelected.value"
                            :all-selected="selectionState.allSelected.value"
                            :toggle-sort="sortState.toggleSort"
                            :select-all="selectionState.selectAll"
                            :get-sort-icon="sortIcon"
                            :is-sorted="sortState.isSorted"
                        />
                        <template v-else-if="$slots.headers">
                            <slot
                                name="headers"
                                :headers="headerState.headers.value"
                                :columns="headerState.columns.value"
                                :sort-by="sortBy"
                                :some-selected="selectionState.someSelected.value"
                                :all-selected="selectionState.allSelected.value"
                                :toggle-sort="sortState.toggleSort"
                                :select-all="selectionState.selectAll"
                                :get-sort-icon="sortIcon"
                                :is-sorted="sortState.isSorted"
                            />
                        </template>
                        <template v-else>
                            <template v-for="(headerRow, rowIndex) in headerState.headers.value" :key="rowIndex">
                                <tr>
                                    <th
                                        v-for="column in headerRow"
                                        :key="column.key"
                                        :colspan="column.colspan"
                                        :rowspan="column.rowspan"
                                        :aria-sort="headerAriaSort(column)"
                                        :tabindex="column.sortable && !disableSort ? 0 : undefined"
                                        :class="[
                                            'rux-data-table__header-cell',
                                            `rux-data-table__cell--align-${column.align ?? 'start'}`,
                                            {
                                                'rux-data-table__cell--fixed': column.fixed,
                                                'rux-data-table__cell--last-fixed': column.lastFixed,
                                                'rux-data-table__cell--first-fixed-end': column.firstFixedEnd,
                                                'rux-data-table__header-cell--sortable':
                                                    column.sortable && !disableSort,
                                            },
                                        ]"
                                        :style="[
                                            fixedStyle(column),
                                            {
                                                inlineSize: toUnit(column.width),
                                                minInlineSize: toUnit(column.minWidth),
                                                maxInlineSize: toUnit(column.maxWidth),
                                            },
                                        ]"
                                        v-bind="resolveHeaderProps(column)"
                                        @click="!disableSort && sortState.toggleSort(column, $event)"
                                        @keydown.enter.prevent="!disableSort && sortState.toggleSort(column, $event)"
                                    >
                                        <slot
                                            :name="`header.${column.publicKey ?? column.key}`"
                                            v-bind="
                                                column.publicKey === 'data-table-select'
                                                    ? { ...headerCellSlot(column), props: headerSelectProps() }
                                                    : headerCellSlot(column)
                                            "
                                        >
                                            <RCheckbox
                                                v-if="
                                                    column.publicKey === 'data-table-select' &&
                                                    selectionState.showSelectAll.value
                                                "
                                                v-bind="headerSelectProps()"
                                            />
                                            <template
                                                v-else-if="column.publicKey !== 'data-table-group' || column.title"
                                            >
                                                <span class="rux-data-table__header-content">
                                                    {{ column.title }}
                                                    <RIconButton
                                                        v-if="column.sortable && !disableSort"
                                                        :icon="sortIcon(column)"
                                                        :label="`Sort ${column.title ?? column.publicKey ?? ''}`"
                                                        :style="{ '--rui-icon-button-size': '32px' }"
                                                        @click.stop="sortState.toggleSort(column, $event)"
                                                    />
                                                    <span
                                                        v-if="isMultiSortEnabled() && sortState.isSorted(column)"
                                                        class="rux-data-table__sort-rank"
                                                        >{{
                                                            sortBy.findIndex((item) => item.key === column.publicKey) +
                                                            1
                                                        }}</span
                                                    >
                                                </span>
                                            </template>
                                        </slot>
                                    </th>
                                </tr>
                            </template>
                        </template>
                        <tr
                            v-if="loadingState.active.value && ['start', 'both'].includes(loadingState.side.value)"
                            class="rux-data-table__progress-row"
                        >
                            <th :colspan="headerState.columns.value.length">
                                <slot
                                    name="loader"
                                    :color="loadingState.color.value"
                                    :is-active="loadingState.active.value"
                                    ><RLinearProgressIndicator
                                        :indeterminate="true"
                                        :style="
                                            loadingState.color.value
                                                ? { '--rui-comp-progress-indicator-color': loadingState.color.value }
                                                : undefined
                                        "
                                        aria-label="Loading table rows"
                                /></slot>
                            </th>
                        </tr>
                    </thead>
                    <slot name="thead" v-bind="slotProps" />
                    <tbody v-if="!hideDefaultBody" class="rux-data-table__body">
                        <tr
                            v-if="virtualTable"
                            ref="virtualState.markerRef"
                            aria-hidden="true"
                            class="rux-data-table__spacer"
                        >
                            <td
                                :colspan="headerState.columns.value.length"
                                :style="{ blockSize: `${virtualState.paddingTop.value}px` }"
                            />
                        </tr>
                        <slot name="body.prepend" v-bind="slotProps" />
                        <template v-if="$slots.body"><slot name="body" v-bind="slotProps" /></template>
                        <template v-else>
                            <tr
                                v-if="loadingState.active.value && (!visibleItems.length || $slots.loading)"
                                class="rux-data-table__state-row"
                            >
                                <td :colspan="headerState.columns.value.length">
                                    <slot name="loading">{{ loadingText }}</slot>
                                </td>
                            </tr>
                            <tr
                                v-else-if="!loadingState.active.value && !visibleItems.length && !hideNoData"
                                class="rux-data-table__state-row"
                            >
                                <td :colspan="headerState.columns.value.length">
                                    <slot name="no-data">{{ noDataText }}</slot>
                                </td>
                            </tr>
                            <template
                                v-for="(entry, entryIndex) in visibleItems"
                                :key="
                                    entry.virtualKey ??
                                    (entry.type === 'item'
                                        ? `item-${String(entry.key)}-${entry.index}`
                                        : `${entry.type}-${entry.id}`)
                                "
                            >
                                <tr
                                    v-if="entry.type === 'group'"
                                    class="rux-data-table__group-row"
                                    @click="groupHeaderClick($event, entry, entryIndex)"
                                >
                                    <th
                                        :colspan="headerState.columns.value.length"
                                        :style="{ paddingInlineStart: `${entry.depth * 24 + 16}px` }"
                                    >
                                        <slot
                                            name="group-header"
                                            :index="entryIndex"
                                            :item="entry"
                                            :columns="headerState.columns.value"
                                            :is-expanded="expandState.isExpanded"
                                            :toggle-expand="expandState.toggleExpand"
                                            :is-selected="selectionState.isSelected"
                                            :toggle-select="selectionState.toggleSelect"
                                            :is-group-open="groupState.isGroupOpen"
                                            :toggle-group="groupState.toggleGroup"
                                        >
                                            <slot
                                                name="data-table-group"
                                                :item="entry"
                                                :count="groupItemCount(entry)"
                                                :props="{
                                                    icon: groupState.isGroupOpen(entry)
                                                        ? (groupCollapseIcon ?? RIExpandLessFilled)
                                                        : (groupExpandIcon ?? RIExpandMoreFilled),
                                                    onClick: () => groupState.toggleGroup(entry),
                                                }"
                                            >
                                                <RIconButton
                                                    :icon="
                                                        groupState.isGroupOpen(entry)
                                                            ? (groupCollapseIcon ?? RIExpandLessFilled)
                                                            : (groupExpandIcon ?? RIExpandMoreFilled)
                                                    "
                                                    :label="`${groupState.isGroupOpen(entry) ? 'Collapse' : 'Expand'} group ${String(entry.value)}`"
                                                    @click.stop="groupState.toggleGroup(entry)"
                                                />
                                            </slot>
                                            <slot
                                                v-if="showSelect"
                                                name="data-table-select"
                                                :props="groupSelectProps(entry)"
                                            >
                                                <RCheckbox v-bind="groupSelectProps(entry)" />
                                            </slot>
                                            {{ entry.value }}
                                        </slot>
                                    </th>
                                </tr>
                                <tr
                                    v-else-if="entry.type === 'group-summary'"
                                    class="rux-data-table__group-summary-row"
                                >
                                    <slot
                                        name="group-summary"
                                        :index="entryIndex"
                                        :item="entry"
                                        :columns="headerState.columns.value"
                                        :toggle-group="groupState.toggleGroup"
                                    />
                                </tr>
                                <template v-else>
                                    <slot
                                        name="item"
                                        :index="entry.virtualIndex ?? entryIndex"
                                        :item="entry.raw"
                                        :internal-item="entry"
                                        :columns="headerState.columns.value"
                                        :props="resolveRowProps(entry, entry.virtualIndex ?? entryIndex)"
                                        :item-ref="
                                            virtualTable
                                                ? rowMeasurement.itemRef(entry.virtualIndex ?? entryIndex)
                                                : undefined
                                        "
                                        :is-selected="selectionState.isSelected"
                                        :select="selectionState.select"
                                        :toggle-select="selectionState.toggleSelect"
                                        :is-expanded="expandState.isExpanded"
                                        :toggle-expand="expandState.toggleExpand"
                                    >
                                        <tr
                                            :ref="
                                                virtualTable
                                                    ? rowMeasurement.itemRef(entry.virtualIndex ?? entryIndex)
                                                    : undefined
                                            "
                                            class="rux-data-table__row"
                                            :class="{
                                                'rux-data-table__row--selected': selectionState.isSelected(entry),
                                            }"
                                            :style="virtualRowStyle"
                                            v-bind="resolveRowProps(entry, entry.virtualIndex ?? entryIndex)"
                                            @click="expandOnClick && expandState.toggleExpand(entry)"
                                        >
                                            <td
                                                v-for="column in headerState.columns.value"
                                                :key="column.key ?? `${entry.index}-${column.title ?? 'cell'}`"
                                                :style="[
                                                    fixedStyle(column),
                                                    {
                                                        inlineSize: !mobile ? toUnit(column.width) : undefined,
                                                        maxInlineSize: !mobile ? toUnit(column.maxWidth) : undefined,
                                                        paddingInlineStart: column.indent
                                                            ? toUnit(column.indent)
                                                            : undefined,
                                                    },
                                                ]"
                                                :class="[
                                                    'rux-data-table__cell',
                                                    `rux-data-table__cell--align-${column.align ?? 'start'}`,
                                                    {
                                                        'rux-data-table__cell--fixed': column.fixed,
                                                        'rux-data-table__cell--last-fixed': column.lastFixed,
                                                        'rux-data-table__cell--first-fixed-end': column.firstFixedEnd,
                                                        'rux-data-table__cell--nowrap': column.nowrap,
                                                    },
                                                ]"
                                                v-bind="
                                                    resolveCellProps(entry, column, entry.virtualIndex ?? entryIndex)
                                                "
                                            >
                                                <slot
                                                    :name="`item.${column.publicKey ?? column.key}`"
                                                    v-bind="
                                                        column.publicKey === 'data-table-select'
                                                            ? {
                                                                  index: entry.virtualIndex ?? entryIndex,
                                                                  item: entry.raw,
                                                                  internalItem: entry,
                                                                  value: renderCellValue(entry, column.key),
                                                                  column,
                                                                  isSelected: selectionState.isSelected,
                                                                  toggleSelect: selectionState.toggleSelect,
                                                                  isExpanded: expandState.isExpanded,
                                                                  toggleExpand: expandState.toggleExpand,
                                                                  props: rowSelectProps(
                                                                      entry,
                                                                      currentPageItems.findIndex(
                                                                          (row) => row.index === entry.index,
                                                                      ),
                                                                  ),
                                                              }
                                                            : {
                                                                  index: entry.virtualIndex ?? entryIndex,
                                                                  item: entry.raw,
                                                                  internalItem: entry,
                                                                  value: renderCellValue(entry, column.key),
                                                                  column,
                                                                  isSelected: selectionState.isSelected,
                                                                  toggleSelect: selectionState.toggleSelect,
                                                                  isExpanded: expandState.isExpanded,
                                                                  toggleExpand: expandState.toggleExpand,
                                                              }
                                                    "
                                                >
                                                    <RCheckbox
                                                        v-if="column.publicKey === 'data-table-select'"
                                                        v-bind="
                                                            rowSelectProps(
                                                                entry,
                                                                currentPageItems.findIndex(
                                                                    (row) => row.index === entry.index,
                                                                ),
                                                            )
                                                        "
                                                    />
                                                    <RIconButton
                                                        v-else-if="column.publicKey === 'data-table-expand'"
                                                        :icon="
                                                            expandState.isExpanded(entry)
                                                                ? (collapseIcon ?? RIExpandLessFilled)
                                                                : (expandIcon ?? RIExpandMoreFilled)
                                                        "
                                                        :label="
                                                            expandState.isExpanded(entry)
                                                                ? 'Collapse row'
                                                                : 'Expand row'
                                                        "
                                                        @click.stop="expandState.toggleExpand(entry)"
                                                    />
                                                    <template v-else>
                                                        <span v-if="mobile" class="rux-data-table__mobile-label">{{
                                                            column.title
                                                        }}</span>
                                                        <span>{{ renderCellValue(entry, column.key) }}</span>
                                                    </template>
                                                </slot>
                                            </td>
                                        </tr>
                                    </slot>
                                    <tr
                                        v-if="expandState.isExpanded(entry) && $slots.expanded"
                                        class="rux-data-table__expanded-row"
                                    >
                                        <td :colspan="headerState.columns.value.length">
                                            <slot
                                                name="expanded"
                                                :index="entry.virtualIndex ?? entryIndex"
                                                :item="entry.raw"
                                                :internal-item="entry"
                                                :columns="headerState.columns.value"
                                                :is-expanded="expandState.isExpanded"
                                                :toggle-expand="expandState.toggleExpand"
                                            />
                                        </td>
                                    </tr>
                                    <slot
                                        v-if="expandState.isExpanded(entry)"
                                        name="expanded-row"
                                        :index="entry.virtualIndex ?? entryIndex"
                                        :item="entry.raw"
                                        :internal-item="entry"
                                        :columns="headerState.columns.value"
                                        :is-expanded="expandState.isExpanded"
                                        :toggle-expand="expandState.toggleExpand"
                                    />
                                </template>
                            </template>
                        </template>
                        <slot name="body.append" v-bind="slotProps" />
                        <tr v-if="virtualTable" aria-hidden="true" class="rux-data-table__spacer">
                            <td
                                :colspan="headerState.columns.value.length"
                                :style="{ blockSize: `${virtualState.paddingBottom.value}px` }"
                            />
                        </tr>
                        <tr
                            v-if="
                                loadingState.active.value &&
                                ['end', 'both'].includes(loadingState.side.value) &&
                                !server
                            "
                            class="rux-data-table__progress-row"
                        >
                            <td :colspan="headerState.columns.value.length">
                                <slot
                                    name="loader"
                                    :color="loadingState.color.value"
                                    :is-active="loadingState.active.value"
                                    ><RLinearProgressIndicator
                                        :indeterminate="true"
                                        :style="
                                            loadingState.color.value
                                                ? { '--rui-comp-progress-indicator-color': loadingState.color.value }
                                                : undefined
                                        "
                                        aria-label="Loading table rows"
                                /></slot>
                            </td>
                        </tr>
                    </tbody>
                    <slot name="tbody" v-bind="slotProps" />
                    <slot name="tfoot" v-bind="slotProps" />
                    <tfoot
                        v-if="fixedFooter && !hideDefaultFooter && !virtualTable && !$slots.bottom"
                        class="rux-data-table__tfoot"
                    >
                        <tr>
                            <td :colspan="headerState.columns.value.length">
                                <footer class="rux-data-table__footer">
                                    <slot name="footer.prepend" />
                                    <RSelectField
                                        :model-value="itemsPerPage"
                                        :label="itemsPerPageText"
                                        @update:model-value="paginationState.setItemsPerPage(Number($event))"
                                    >
                                        <RSelectOption
                                            v-for="option in footerOptions"
                                            :key="option.value"
                                            :value="option.value"
                                            :label="option.title"
                                        />
                                    </RSelectField>
                                    <span class="rux-data-table__page-text">{{
                                        pageText
                                            .replace(
                                                "{0}",
                                                String(itemCount ? paginationState.startIndex.value + 1 : 0),
                                            )
                                            .replace("{1}", String(paginationState.stopIndex.value))
                                            .replace("{2}", String(itemCount))
                                    }}</span>
                                    <div class="rux-data-table__pagination">
                                        <RIconButton
                                            v-if="showFirstLastPage"
                                            :icon="firstIcon ?? RIFirstPageFilled"
                                            :label="firstPageLabel"
                                            :disabled="page <= 1"
                                            @click="paginationState.setPage(1)"
                                        />
                                        <RIconButton
                                            :icon="prevIcon ?? RIChevronLeftFilled"
                                            :label="prevPageLabel"
                                            :disabled="page <= 1"
                                            @click="paginationState.prevPage"
                                        />
                                        <span v-if="showCurrentPage">{{ page }}</span>
                                        <RIconButton
                                            :icon="nextIcon ?? RIChevronRightFilled"
                                            :label="nextPageLabel"
                                            :disabled="page >= paginationState.pageCount.value"
                                            @click="paginationState.nextPage"
                                        />
                                        <RIconButton
                                            v-if="showFirstLastPage"
                                            :icon="lastIcon ?? RILastPageFilled"
                                            :label="lastPageLabel"
                                            :disabled="page >= paginationState.pageCount.value"
                                            @click="paginationState.setPage(paginationState.pageCount.value)"
                                        />
                                    </div>
                                </footer>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <slot name="bottom" v-bind="slotProps">
                <footer v-if="!fixedFooter && !hideDefaultFooter && !virtualTable" class="rux-data-table__footer">
                    <slot name="footer.prepend" />
                    <RSelectField
                        :model-value="itemsPerPage"
                        :label="itemsPerPageText"
                        @update:model-value="paginationState.setItemsPerPage(Number($event))"
                    >
                        <RSelectOption
                            v-for="option in footerOptions"
                            :key="option.value"
                            :value="option.value"
                            :label="option.title"
                        />
                    </RSelectField>
                    <span class="rux-data-table__page-text">{{
                        pageText
                            .replace("{0}", String(itemCount ? paginationState.startIndex.value + 1 : 0))
                            .replace("{1}", String(paginationState.stopIndex.value))
                            .replace("{2}", String(itemCount))
                    }}</span>
                    <div class="rux-data-table__pagination">
                        <RIconButton
                            v-if="showFirstLastPage"
                            :icon="firstIcon ?? RIFirstPageFilled"
                            :label="firstPageLabel"
                            :disabled="page <= 1"
                            @click="paginationState.setPage(1)"
                        />
                        <RIconButton
                            :icon="prevIcon ?? RIChevronLeftFilled"
                            :label="prevPageLabel"
                            :disabled="page <= 1"
                            @click="paginationState.prevPage"
                        />
                        <span v-if="showCurrentPage">{{ page }}</span>
                        <RIconButton
                            :icon="nextIcon ?? RIChevronRightFilled"
                            :label="nextPageLabel"
                            :disabled="page >= paginationState.pageCount.value"
                            @click="paginationState.nextPage"
                        />
                        <RIconButton
                            v-if="showFirstLastPage"
                            :icon="lastIcon ?? RILastPageFilled"
                            :label="lastPageLabel"
                            :disabled="page >= paginationState.pageCount.value"
                            @click="paginationState.setPage(paginationState.pageCount.value)"
                        />
                    </div>
                </footer>
            </slot>
        </template>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/rui";

.rux-data-table {
    --rui-comp-data-table-border-color: var(--rui-sys-color-on-surface-outline);
    --rui-comp-data-table-header-background: var(--rui-sys-color-surface);
    --rui-comp-data-table-row-hover-background: color-mix(in srgb, var(--rui-sys-color-on-surface) 8%, transparent);
    --rui-comp-data-table-row-selected-background: color-mix(in srgb, var(--rui-sys-color-primary) 14%, transparent);
    --rui-comp-data-table-header-height: 56px;
    --rui-comp-data-table-cell-padding-inline: 16px;
    overflow: hidden;
}

.rux-data-table--compact {
    --rui-comp-data-table-header-height: 40px;
    --rui-comp-data-table-cell-padding-inline: 12px;
}

.rux-data-table--comfortable {
    --rui-comp-data-table-header-height: 48px;
}

.rux-data-table__scroll {
    overflow: auto;
    max-inline-size: 100%;
}

.rux-data-table__table {
    @include rui.typo-body1;
    inline-size: 100%;
    border-collapse: collapse;
    color: rui.$color-on-surface-high;
}

.rux-data-table__header-cell,
.rux-data-table__cell {
    box-sizing: border-box;
    min-block-size: var(--rui-comp-data-table-header-height);
    padding: 0 var(--rui-comp-data-table-cell-padding-inline);
    border-block-end: 1px solid var(--rui-comp-data-table-border-color);
    background: var(--rui-comp-data-table-header-background);
    text-align: start;
    vertical-align: middle;
}

.rux-data-table--gridlines-vertical .rux-data-table__header-cell,
.rux-data-table--gridlines-vertical .rux-data-table__cell {
    border-inline-end: 1px solid var(--rui-comp-data-table-border-color);
}

.rux-data-table__header-cell {
}

.rux-data-table__cell {
    font: var(--rui-sys-typescale-body-medium-font, inherit);
    background: var(--rui-sys-color-surface);
}

.rux-data-table__cell--align-center {
    text-align: center;
}

.rux-data-table__cell--align-end {
    text-align: end;
}
.rux-data-table__cell--fixed {
    z-index: 1;
}
.rux-data-table__header-cell.rux-data-table__cell--fixed {
    z-index: 3;
}
.rux-data-table--fixed-header .rux-data-table__head {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
}
.rux-data-table--fixed-footer .rux-data-table__table > tfoot > tr {
    position: sticky;
    inset-block-end: 0;
    z-index: 4;
}
.rux-data-table--fixed-footer .rux-data-table__table > tfoot > tr > td {
    padding: 0;
    background: var(--rui-sys-color-surface);
    border-block-start: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__tfoot > tr > td {
    padding: 0;
}
.rux-data-table__cell--last-fixed {
    border-inline-end: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__cell--first-fixed-end {
    border-inline-start: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__header-content,
.rux-data-table__footer,
.rux-data-table__pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rux-data-table__header-content {
    @include rui.typo-subtitle2;
    color: rui.$color-on-surface-medium;
    justify-content: flex-start;
}

.rux-data-table__header-cell--sortable {
    cursor: pointer;
}

.rux-data-table__sort-rank {
    display: grid;
    place-items: center;
    inline-size: 20px;
    block-size: 20px;
    border-radius: 50%;
    background: var(--rui-sys-color-primary);
    color: var(--rui-sys-color-on-primary);
    font-size: 12px;
}
.rux-data-table--hover .rux-data-table__row:hover .rux-data-table__cell {
    background: var(--rui-comp-data-table-row-hover-background);
}
.rux-data-table--striped-odd .rux-data-table__row:nth-child(odd) .rux-data-table__cell {
    background: color-mix(in srgb, var(--rui-sys-color-on-surface) 3%, var(--rui-sys-color-surface));
}
.rux-data-table--striped-even .rux-data-table__row:nth-child(even) .rux-data-table__cell {
    background: color-mix(in srgb, var(--rui-sys-color-on-surface) 3%, var(--rui-sys-color-surface));
}
.rux-data-table__row--selected .rux-data-table__cell {
    background: var(--rui-comp-data-table-row-selected-background);
}
.rux-data-table__state-row td,
.rux-data-table__group-row th,
.rux-data-table__group-summary-row {
    padding: 16px;
    border-block-end: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__group-row th {
    background: var(--rui-comp-data-table-header-background);
    text-align: start;
}
.rux-data-table__expanded-row td {
    padding: 16px;
    border-block-end: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__spacer td {
    padding: 0;
    border: 0;
}
.rux-data-table__footer {
    flex-wrap: wrap;
    justify-content: end;
    padding: 8px 16px;
    border-block-start: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table__mobile-label {
    display: none;
}
.rux-data-table--mobile .rux-data-table__head {
    display: none;
}
.rux-data-table--mobile .rux-data-table__head--mobile-slot {
    display: table-header-group;
}
.rux-data-table--mobile .rux-data-table__row,
.rux-data-table--mobile .rux-data-table__row td {
    display: block;
}
.rux-data-table--mobile .rux-data-table__cell {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    min-block-size: auto;
}
.rux-data-table--mobile .rux-data-table__mobile-label {
    display: inline;
    color: var(--rui-sys-color-on-surface-medium);
}
.rux-data-table--mobile .rux-data-table__row {
    border-block-end: 1px solid var(--rui-comp-data-table-border-color);
}
.rux-data-table--mobile .rux-data-table__footer {
    justify-content: stretch;
}
.rux-data-table--mobile .rux-data-table__page-text {
    margin-inline-end: 0;
}
</style>
