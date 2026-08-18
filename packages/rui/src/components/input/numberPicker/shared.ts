export type NumberPickerRange = {
    min: number
    max: number
    step: number
    count: number
}

export function decimalPrecision(value: number) {
    const exponent = value.toString().match(/e-(\d+)$/i)
    if (exponent) {
        return Number(exponent[1])
    }

    return value.toString().split(".")[1]?.length ?? 0
}

export function resolveNumberPickerRange(min: number, max: number, step: number): NumberPickerRange {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
        throw new RangeError("RNumberPicker requires finite min and max values where max is greater than or equal to min.")
    }

    if (!Number.isFinite(step) || step <= 0) {
        throw new RangeError("RNumberPicker requires a finite step greater than zero.")
    }

    const count = Math.ceil((max - min) / step - 1e-9) + 1
    return { count: Math.max(1, count), max, min, step }
}

export function valueAtIndex(index: number, range: NumberPickerRange) {
    if (index >= range.count - 1) {
        return range.max
    }

    const value = range.min + index * range.step
    return Number(value.toFixed(Math.max(decimalPrecision(range.min), decimalPrecision(range.max), decimalPrecision(range.step))))
}

export function clampIndex(index: number, range: NumberPickerRange) {
    return Math.min(range.count - 1, Math.max(0, index))
}

export function wrapIndex(index: number, range: NumberPickerRange) {
    return ((index % range.count) + range.count) % range.count
}

export function resolveIndex(index: number, range: NumberPickerRange, wrap: boolean) {
    return wrap ? wrapIndex(index, range) : clampIndex(index, range)
}

export function indexForValue(value: number, range: NumberPickerRange, wrap: boolean) {
    if (!Number.isFinite(value)) {
        return 0
    }

    return resolveIndex(Math.round((value - range.min) / range.step), range, wrap)
}

export function valueForCandidate(value: number, range: NumberPickerRange, wrap: boolean) {
    return valueAtIndex(indexForValue(value, range, wrap), range)
}

export function visibleValue(centerIndex: number, offset: number, range: NumberPickerRange, wrap: boolean) {
    const index = centerIndex + offset
    if (!wrap && (index < 0 || index >= range.count)) {
        return null
    }

    return valueAtIndex(resolveIndex(index, range, wrap), range)
}

export function formatNumberPickerValue(value: number, formatter?: (value: number) => string) {
    return formatter ? formatter(value) : String(value)
}

export function resolveWheelOffset(offset: number, centerIndex: number, range: NumberPickerRange, wrap: boolean) {
    if (wrap) {
        return offset
    }

    const minOffset = -centerIndex
    const maxOffset = range.count - 1 - centerIndex
    if (offset < minOffset) {
        return minOffset + (offset - minOffset) * 0.24
    }
    if (offset > maxOffset) {
        return maxOffset + (offset - maxOffset) * 0.24
    }

    return offset
}
