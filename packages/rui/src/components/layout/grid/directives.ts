import type { Directive, DirectiveBinding } from "vue"

import type { RViewportResponsiveValue } from "@/foundations/responsive/responsive.ts"

export type GridSpanScalar = number | "full"

export type GridResponsiveSpanValue = RViewportResponsiveValue<GridSpanScalar>

export type GridSpanValue = GridSpanScalar | GridResponsiveSpanValue

type SpanProperty = "column" | "row"

const SPAN_SUFFIXES = ["xs", "sm", "md", "lg", "xl", "xxl"] as const
const GRID_ITEM_CLASS = "rui-grid__item"

function isResponsiveSpanValue(value: GridSpanValue): value is GridResponsiveSpanValue {
    return typeof value === "object" && value != null
}

function normalizeSpan(value: GridSpanScalar) {
    if (value === "full") {
        return "1 / -1"
    }

    const span = Math.trunc(value)
    return span > 0 ? `span ${span}` : "span 1"
}

function resolveSpanStyles(value: GridSpanValue, property: SpanProperty) {
    const prefix = `--rui-comp-grid-${property}-span`
    const styles: Record<string, string> = {}

    if (!isResponsiveSpanValue(value)) {
        styles[`${prefix}-xs`] = normalizeSpan(value)
        return styles
    }

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
    return styles
}

function applySpan(el: HTMLElement, binding: DirectiveBinding<GridSpanValue>, property: SpanProperty) {
    el.classList.add(GRID_ITEM_CLASS)

    const styles = resolveSpanStyles(binding.value, property)
    const prefix = `--rui-comp-grid-${property}-span`

    for (const suffix of SPAN_SUFFIXES) {
        const name = `${prefix}-${suffix}`
        const value = styles[name]

        if (value) {
            el.style.setProperty(name, value)
        } else {
            el.style.removeProperty(name)
        }
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
            const props: Record<string, string | Record<string, string>> = {
                style: resolveSpanStyles(binding.value, property),
            }

            if (property === "column" || !vnode?.dirs?.some((entry) => entry.dir === vColumnSpan)) {
                props.class = GRID_ITEM_CLASS
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
