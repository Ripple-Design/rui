export function clampUnit(value: number) {
    if (Number.isNaN(value)) {
        return 0
    }

    return Math.min(Math.max(value, 0), 1)
}

export function normalizeProgress(value: number | undefined) {
    return clampUnit(value ?? 0)
}

export function normalizeBuffer(value: number | undefined) {
    return clampUnit(value ?? 1)
}

export function resolveProgressbarAria(
    closed: boolean,
    indeterminate: boolean,
    progress: number,
    buffer?: number,
) {
    return {
        ariaHidden: closed,
        ariaValueMax: indeterminate ? undefined : 1,
        ariaValueMin: indeterminate ? undefined : 0,
        ariaValueNow: closed || indeterminate ? undefined : progress,
        ariaValueText: buffer == null ? undefined : String(buffer),
    }
}
