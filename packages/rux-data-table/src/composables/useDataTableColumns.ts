import { computed, type ComputedRef } from "vue"

import type { RDataTableCompareFunction, RDataTableColumn, RDataTableFilterFunction, RInternalDataTableColumn } from "../components/dataTable/types"

const defaultHeader = { title: "", sortable: false }
const defaultActionHeader = { ...defaultHeader, width: 48 }

function leaves<T>(header: RInternalDataTableColumn<T>): RInternalDataTableColumn<T>[] {
    return header.children ? header.children.flatMap(leaves) : [header]
}

function depth<T>(header: RInternalDataTableColumn<T>, level = 0): number {
    return header.children ? Math.max(level, ...header.children.map(child => depth(child, level + 1))) : level
}

function collectKeys<T>(headers: readonly RDataTableColumn<T>[], keys = new Set<string>()): Set<string> {
    for (const header of headers) {
        if (header.key) keys.add(header.key)
        if (header.children) collectKeys(header.children, keys)
    }
    return keys
}

function toInternal<T>(headers: readonly RDataTableColumn<T>[], parentPath = "header"): RInternalDataTableColumn<T>[] {
    return headers.map((header, index) => {
        const defaults = header.key === "data-table-group" ? defaultHeader : ["data-table-select", "data-table-expand"].includes(header.key ?? "") ? defaultActionHeader : {}
        const source = { ...defaults, ...header }
        const publicKey = source.key ?? (typeof source.value === "string" ? source.value : undefined)
        const key = publicKey ?? `${parentPath}-${index}`
        return {
            ...source,
            key,
            publicKey,
            value: source.value ?? publicKey ?? null,
            filterable: source.filterable ?? !["data-table-group", "data-table-select", "data-table-expand"].includes(publicKey ?? ""),
            filterKey: source.filterKey ?? publicKey,
            sortable: source.sortable ?? false,
            children: source.children ? toInternal(source.children, key) : undefined,
        }
    })
}

function parseFixed<T>(items: RInternalDataTableColumn<T>[], inherited?: "start" | "end") {
    for (const header of items) {
        if (header.fixed === true) header.fixed = "start"
        if (inherited && !header.fixed) header.fixed = inherited
        if (header.children) parseFixed(header.children, header.fixed === "start" || header.fixed === "end" ? header.fixed : inherited)
    }

    const columns = items.flatMap(leaves)
    let startOffset = 0
    for (const header of columns) {
        if (header.fixed === "start") {
            header.fixedOffset = startOffset
            startOffset += Number.parseFloat(String(header.width ?? header.minWidth ?? 0)) || 0
        }
    }
    let endOffset = 0
    for (const header of [...columns].reverse()) {
        if (header.fixed === "end") {
            header.fixedEndOffset = endOffset
            endOffset += Number.parseFloat(String(header.width ?? header.minWidth ?? 0)) || 0
        }
    }
    const starts = columns.filter(item => item.fixed === "start")
    const ends = columns.filter(item => item.fixed === "end")
    if (starts.length) starts.at(-1)!.lastFixed = true
    if (ends.length) ends.at(0)!.firstFixedEnd = true

    function decorate(headers: RInternalDataTableColumn<T>[]) {
        for (const header of headers) {
            if (!header.children) continue
            decorate(header.children)
            const descendants = header.children.flatMap(leaves)
            if (descendants.length && descendants.every(column => column.fixed === "start")) {
                header.fixed = "start"
                header.fixedOffset = descendants[0]!.fixedOffset
                header.lastFixed = descendants.at(-1)?.lastFixed
            } else if (descendants.length && descendants.every(column => column.fixed === "end")) {
                header.fixed = "end"
                header.fixedEndOffset = descendants.at(-1)?.fixedEndOffset
                header.firstFixedEnd = descendants[0]?.firstFixedEnd
            } else if (header.children.some(column => column.fixed !== "start" && column.fixed !== "end")) {
                header.fixed = undefined
            }
        }
    }
    decorate(items)
}

function parseMatrix<T>(items: RInternalDataTableColumn<T>[]) {
    const maxDepth = Math.max(0, ...items.map(item => depth(item))) + 1
    const rows: RInternalDataTableColumn<T>[][] = Array.from({ length: maxDepth }, () => [])
    function walk(headers: RInternalDataTableColumn<T>[], level: number) {
        for (const header of headers) {
            rows[level]!.push({ ...header, headerRow: level, colspan: header.children ? header.children.flatMap(leaves).length : 1, rowspan: header.children ? 1 : maxDepth - level })
            if (header.children) walk(header.children, level + 1)
        }
    }
    walk(items, 0)
    return { headers: rows, columns: items.flatMap(leaves) }
}

export function useDataTableColumns<T>(props: { columns?: readonly RDataTableColumn<T>[]; items?: readonly T[]; groupBy?: readonly unknown[]; showSelect?: boolean; showExpand?: boolean }): { headers: ComputedRef<RInternalDataTableColumn<T>[][]>; columns: ComputedRef<RInternalDataTableColumn<T>[]>; sortFunctions: ComputedRef<Record<string, RDataTableCompareFunction>>; sortRawFunctions: ComputedRef<Record<string, RDataTableCompareFunction>>; filterFunctions: ComputedRef<Record<string, RDataTableFilterFunction>>; filterKeys: ComputedRef<string[]> } {
    const source = computed(() => {
        const supplied = props.columns ?? Object.keys((props.items?.[0] ?? {}) as object).map(key => ({ key, title: key.charAt(0).toUpperCase() + key.slice(1) } as RDataTableColumn<T>))
        const result = supplied.slice()
        const keys = collectKeys(result)
        if (props.groupBy?.length && !keys.has("data-table-group")) result.unshift({ key: "data-table-group", title: "Group" })
        if (props.showSelect && !keys.has("data-table-select")) result.unshift({ key: "data-table-select" })
        if (props.showExpand && !keys.has("data-table-expand")) result.push({ key: "data-table-expand" })
        const internal = toInternal(result)
        parseFixed(internal)
        return internal
    })
    const parsed = computed(() => parseMatrix(source.value))
    const sortFunctions = computed(() => Object.fromEntries(parsed.value.columns.filter(column => column.publicKey && column.sort).map(column => [column.publicKey!, column.sort!])))
    const sortRawFunctions = computed(() => Object.fromEntries(parsed.value.columns.filter(column => column.publicKey && column.sortRaw).map(column => [column.publicKey!, column.sortRaw!])))
    const filterFunctions = computed(() => Object.fromEntries(parsed.value.columns.filter(column => column.filterable !== false && column.filterKey && column.filter).map(column => [column.filterKey!, column.filter!])))
    const filterKeys = computed(() => parsed.value.columns.filter(column => column.filterable !== false && column.filterKey).map(column => column.filterKey!))
    return { headers: computed(() => parsed.value.headers), columns: computed(() => parsed.value.columns), sortFunctions, sortRawFunctions, filterFunctions, filterKeys }
}
