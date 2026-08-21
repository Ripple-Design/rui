import type { Directive, DirectiveBinding } from "vue"

import type { RContainerResponsiveValue, RResponsiveObjectValue } from "@/foundations/responsive/responsive.ts"

export type GridSpanScalar = number | "full"

export type GridResponsiveSpanValue = RResponsiveObjectValue<GridSpanScalar>

export type GridSpanValue = GridSpanScalar | GridResponsiveSpanValue

type SpanProperty = "column" | "row"
type ResponsiveMode = "viewport" | "container" | null

const VIEWPORT_SUFFIXES = ["xs", "sm", "md", "lg", "xl", "xxl"] as const
const CONTAINER_SUFFIXES = ["cxs", "csm", "cmd", "clg", "cxl", "cxxl"] as const
const SPAN_SUFFIXES = [...VIEWPORT_SUFFIXES, ...CONTAINER_SUFFIXES] as const
const GRID_ITEM_CLASS = "rui-grid__item"

function isResponsiveSpanValue(value: GridSpanValue): value is GridResponsiveSpanValue {
    return typeof value === "object" && value != null
}

function isContainerResponsiveSpanValue(
    value: GridResponsiveSpanValue,
): value is RContainerResponsiveValue<GridSpanScalar> {
    return "cxs" in value
}

function normalizeSpan(value: GridSpanScalar) {
    if (value === "full") {
        return "1 / -1"
    }

    const span = Math.trunc(value)
    return span > 0 ? `span ${span}` : "span 1"
}

function resolveSpanState(value: GridSpanValue, property: SpanProperty) {
    const prefix = `--rui-comp-grid-${property}-span`
    const styles: Record<string, string> = {}
    let mode: ResponsiveMode = null

    if (!isResponsiveSpanValue(value)) {
        const normalized = normalizeSpan(value)
        styles[`${prefix}-xs`] = normalized
        styles[`${prefix}-cxs`] = normalized
        return { mode, styles }
    }

    if (isContainerResponsiveSpanValue(value)) {
        mode = "container"
        const cxs = normalizeSpan(value.cxs)
        const csm = normalizeSpan(value.csm ?? value.cxs)
        const cmd = normalizeSpan(value.cmd ?? value.csm ?? value.cxs)
        const clg = normalizeSpan(value.clg ?? value.cmd ?? value.csm ?? value.cxs)
        const cxl = normalizeSpan(value.cxl ?? value.clg ?? value.cmd ?? value.csm ?? value.cxs)
        const cxxl = normalizeSpan(value.cxxl ?? value.cxl ?? value.clg ?? value.cmd ?? value.csm ?? value.cxs)

        styles[`${prefix}-cxs`] = cxs
        styles[`${prefix}-csm`] = csm
        styles[`${prefix}-cmd`] = cmd
        styles[`${prefix}-clg`] = clg
        styles[`${prefix}-cxl`] = cxl
        styles[`${prefix}-cxxl`] = cxxl
        return { mode, styles }
    }

    mode = "viewport"
    const xs = normalizeSpan(value.xs)
    const sm = normalizeSpan(value.sm ?? value.xs)
    const md = normalizeSpan(value.md ?? value.sm ?? value.xs)
    const lg = normalizeSpan(value.lg ?? value.md ?? value.sm ?? value.xs)
    const xl = normalizeSpan(value.xl ?? value.lg ?? value.md ?? value.sm ?? value.xs)
    const xxl = normalizeSpan(value.xxl ?? value.xl ?? value.lg ?? value.md ?? value.sm ?? value.xs)

    styles[`${prefix}-xs`] = xs
    styles[`${prefix}-sm`] = sm
    styles[`${prefix}-md`] = md
    styles[`${prefix}-lg`] = lg
    styles[`${prefix}-xl`] = xl
    styles[`${prefix}-xxl`] = xxl
    return { mode, styles }
}

function applySpan(el: HTMLElement, binding: DirectiveBinding<GridSpanValue>, property: SpanProperty) {
    el.classList.add(GRID_ITEM_CLASS)

    const { mode, styles } = resolveSpanState(binding.value, property)
    const prefix = `--rui-comp-grid-${property}-span`
    const modeAttribute = `data-rui-grid-${property}-span-mode`

    for (const suffix of SPAN_SUFFIXES) {
        const name = `${prefix}-${suffix}`
        const value = styles[name]

        if (value) {
            el.style.setProperty(name, value)
        } else {
            el.style.removeProperty(name)
        }
    }

    if (mode) {
        el.setAttribute(modeAttribute, mode)
    } else {
        el.removeAttribute(modeAttribute)
    }
}

function createSpanDirective(property: SpanProperty): Directive<HTMLElement, GridSpanValue> {
    return {
        created(el, binding) {
            applySpan(el, binding, property)
        },
        mounted(el, binding) {
            applySpan(el, binding, property)
        },
        updated(el, binding) {
            applySpan(el, binding, property)
        },
        getSSRProps(binding, vnode) {
            const { mode, styles } = resolveSpanState(binding.value, property)
            const props: Record<string, string | Record<string, string>> = { style: styles }

            if (property === "column" || !vnode?.dirs?.some((entry) => entry.dir === vColumnSpan)) {
                props.class = GRID_ITEM_CLASS
            }

            if (mode) {
                props[`data-rui-grid-${property}-span-mode`] = mode
            }

            return props
        },
    }
}

/** Sets `grid-column` span placement on the directive target. */
export const vColumnSpan = createSpanDirective("column")

/** Sets `grid-row` span placement on the directive target. */
export const vRowSpan = createSpanDirective("row")

/** Alias for {@link vColumnSpan}. */
export const vSpan = vColumnSpan
