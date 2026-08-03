export type RippleContrast = "low" | "high"

export type RipplePoint = {
    x: number
    y: number
}

export type RippleUnboundedOptions = {
    radius: number
    getCenter: (host: HTMLElement) => RipplePoint
}

export type RippleOptions = {
    disabled?: boolean
    unbounded?: boolean | RippleUnboundedOptions
    getSurfaceTarget?: (host: HTMLElement) => HTMLElement | null
    color?: string | null
    contrast?: RippleContrast
    selected?: boolean
}

export type RippleDirectiveValue = RippleOptions | null | undefined

export type RippleDirectiveModifiers = Partial<Record<"unbounded", boolean>>

export type NormalizedRippleOptions = {
    disabled: boolean
    unbounded: boolean
    unboundedRadius: number | null
    getUnboundedCenter: ((host: HTMLElement) => RipplePoint) | null
    getSurfaceTarget: ((host: HTMLElement) => HTMLElement | null) | null
    color: string | null
    contrast: RippleContrast
    selected: boolean
}

export function normalizeRippleOptions(
    value: RippleDirectiveValue,
    modifiers: RippleDirectiveModifiers = {},
): NormalizedRippleOptions {
    const options = value ?? {}
    const unboundedOptions = typeof options.unbounded === "object" ? options.unbounded : null

    return {
        disabled: !!options.disabled,
        unbounded: !!(modifiers.unbounded || options.unbounded),
        unboundedRadius: unboundedOptions && unboundedOptions.radius > 0 ? unboundedOptions.radius : null,
        getUnboundedCenter: unboundedOptions?.getCenter ?? null,
        getSurfaceTarget: options.getSurfaceTarget ?? null,
        color: options.color ?? null,
        contrast: options.contrast ?? "low",
        selected: !!options.selected,
    }
}
