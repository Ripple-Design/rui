import type { RSliderRangeValue } from "./types.ts"

const MAX_TICK_COUNT = 200
const MIN_TICK_GAP = 8

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function precision(value: number) {
    const exponent = value.toString().match(/e-(\d+)$/i)
    if (exponent) {
        return Number(exponent[1])
    }

    const decimal = value.toString().split(".")[1]
    return decimal?.length ?? 0
}

export function valueToPercent(value: number, min: number, max: number) {
    return (clamp(value, min, max) - min) / (max - min)
}

export function percentToValue(percent: number, min: number, max: number, step: number) {
    const value = min + clamp(percent, 0, 1) * (max - min)

    if (step === 0) {
        return value
    }

    const snapped = min + Math.round((value - min) / step) * step
    return Number(clamp(snapped, min, max).toFixed(Math.max(precision(step), precision(min))))
}

export function resolveThumbValue(
    candidate: number,
    range: RSliderRangeValue | null,
    thumb: "single" | "start" | "end",
    min: number,
    max: number,
    step: number,
) {
    const snapped = percentToValue(valueToPercent(candidate, min, max), min, max, step)

    if (!range || thumb === "single") {
        return snapped
    }

    return thumb === "start" ? Math.min(snapped, range[1]) : Math.max(snapped, range[0])
}

export function resolveTickPercents(min: number, max: number, step: number, trackWidth: number) {
    if (step === 0 || trackWidth <= 0) {
        return []
    }

    const count = Math.round((max - min) / step) + 1
    const renderedCount = Math.min(
        count,
        Math.max(2, Math.min(MAX_TICK_COUNT, Math.floor(trackWidth / MIN_TICK_GAP) + 1)),
    )

    return Array.from({ length: renderedCount }, (_, index) => index / (renderedCount - 1))
}

export function formatSliderValue(value: number, formatter?: (value: number) => string) {
    return formatter ? formatter(value) : String(value)
}

export function resolveRangeAriaLabel(label: string | undefined, thumb: "start" | "end", explicit?: string) {
    if (explicit) {
        return explicit
    }

    if (label) {
        return `${label} ${thumb === "start" ? "start" : "end"}`
    }

    return thumb === "start" ? "Range start" : "Range end"
}
