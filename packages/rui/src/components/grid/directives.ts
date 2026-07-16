import type { Directive, DirectiveBinding } from "vue"

export type GridSpanValue = number | "full"

type SpanProperty = "gridColumn" | "gridRow"

function normalizeSpan(value: GridSpanValue) {
    if (value === "full") {
        return "1 / -1"
    }

    const span = Math.trunc(value)
    return span > 0 ? `span ${span}` : `span 1`
}

function applySpan(el: HTMLElement, binding: DirectiveBinding<GridSpanValue>, property: SpanProperty) {
    el.style[property] = normalizeSpan(binding.value)
}

function createSpanDirective(property: SpanProperty): Directive<HTMLElement, GridSpanValue> {
    return {
        mounted(el, binding) {
            applySpan(el, binding, property)
        },
        updated(el, binding) {
            applySpan(el, binding, property)
        },
        getSSRProps(binding) {
            return { style: { [property]: normalizeSpan(binding.value) } }
        },
    }
}

/** Sets `grid-column` span placement on the directive target. */
export const vColumnSpan = createSpanDirective("gridColumn")

/** Sets `grid-row` span placement on the directive target. */
export const vRowSpan = createSpanDirective("gridRow")

/** Alias for {@link vColumnSpan}. */
export const vSpan = vColumnSpan
