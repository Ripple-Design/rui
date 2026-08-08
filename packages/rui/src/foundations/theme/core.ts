import type { RShapeFamily, RTheme, RThemeColors, RThemeShapeCategory, RThemeShapeCorner, RThemeShapeCorners } from "./types"

function shapeFamilyToCSS(family: RShapeFamily) {
    return family === "cut" ? "bevel" : "round"
}

function shapeCornerToCSS(value: RThemeShapeCorner) {
    return typeof value === "number" ? `${value}px` : value
}

function expandShapeCorners(corners: RThemeShapeCorners) {
    if (Array.isArray(corners)) {
        if (corners.length === 1) {
            return [corners[0], corners[0], corners[0], corners[0]] as const
        }

        if (corners.length === 2) {
            return [corners[0], corners[1], corners[0], corners[1]] as const
        }

        if (corners.length === 3) {
            return [corners[0], corners[1], corners[2], corners[1]] as const
        }

        if (corners.length === 4) {
            return [corners[0], corners[1], corners[2], corners[3]] as const
        }

        throw new Error("[RUI] Shape corners must contain between 1 and 4 values")
    }

    return [corners, corners, corners, corners] as const
}

function resolveShapeCategory(shape: RThemeShapeCategory) {
    const expanded = shape.corners ? expandShapeCorners(shape.corners) : undefined

    return {
        family: shape.family ? shapeFamilyToCSS(shape.family) : undefined,
        startStart:
            shape.startStart != null
                ? shapeCornerToCSS(shape.startStart)
                : expanded?.[0] != null
                  ? shapeCornerToCSS(expanded[0])
                  : undefined,
        startEnd:
            shape.startEnd != null
                ? shapeCornerToCSS(shape.startEnd)
                : expanded?.[1] != null
                  ? shapeCornerToCSS(expanded[1])
                  : undefined,
        endEnd:
            shape.endEnd != null
                ? shapeCornerToCSS(shape.endEnd)
                : expanded?.[2] != null
                  ? shapeCornerToCSS(expanded[2])
                  : undefined,
        endStart:
            shape.endStart != null
                ? shapeCornerToCSS(shape.endStart)
                : expanded?.[3] != null
                  ? shapeCornerToCSS(expanded[3])
                  : undefined,
    }
}

function deriveContrastColors(colors?: RThemeColors): RThemeColors | undefined {
    if (!colors) {
        return colors
    }

    const nextColors = { ...colors }

    if (colors.primary) {
        nextColors.primaryLow = colors.primaryLow ?? `rgb(from ${colors.primary} r g b / 0.38)`
    }

    if (colors.onSurface) {
        nextColors.onSurfaceHigh = colors.onSurfaceHigh ?? `rgb(from ${colors.onSurface} r g b / 0.87)`
        nextColors.onSurfaceMedium = colors.onSurfaceMedium ?? `rgb(from ${colors.onSurface} r g b / 0.54)`
        nextColors.onSurfaceLow = colors.onSurfaceLow ?? `rgb(from ${colors.onSurface} r g b / 0.38)`
        nextColors.onSurfaceOutline = colors.onSurfaceOutline ?? `rgb(from ${colors.onSurface} r g b / 0.12)`
    }

    if (colors.onPrimary) {
        nextColors.onPrimaryMedium = colors.onPrimaryMedium ?? `rgb(from ${colors.onPrimary} r g b / 0.7)`
        nextColors.onPrimaryOutline = colors.onPrimaryOutline ?? `rgb(from ${colors.onPrimary} r g b / 0.24)`
    }

    if (colors.onSecondary) {
        nextColors.onSecondaryMedium = colors.onSecondaryMedium ?? `rgb(from ${colors.onSecondary} r g b / 0.7)`
        nextColors.onSecondaryOutline = colors.onSecondaryOutline ?? `rgb(from ${colors.onSecondary} r g b / 0.24)`
    }

    return nextColors
}

/** Converts a runtime theme object into CSS variable key-value pairs. */
export function themeToCSSVars(theme: RTheme) {
    const vars: Record<string, string> = {}
    const colors = deriveContrastColors(theme.color)

    if (colors?.primary) {
        vars["--rui-sys-color-primary"] = colors.primary
    }

    if (colors?.primaryLow) {
        vars["--rui-sys-color-primary-low"] = colors.primaryLow
    }

    if (colors?.primaryLight) {
        vars["--rui-sys-color-primary-light"] = colors.primaryLight
    }

    if (colors?.primaryDark) {
        vars["--rui-sys-color-primary-dark"] = colors.primaryDark
    }

    if (colors?.onPrimary) {
        vars["--rui-sys-color-on-primary"] = colors.onPrimary
    }

    if (colors?.onPrimaryMedium) {
        vars["--rui-sys-color-on-primary-medium"] = colors.onPrimaryMedium
    }

    if (colors?.onPrimaryOutline) {
        vars["--rui-sys-color-on-primary-outline"] = colors.onPrimaryOutline
    }

    if (colors?.secondary) {
        vars["--rui-sys-color-secondary"] = colors.secondary
    }

    if (colors?.secondaryLight) {
        vars["--rui-sys-color-secondary-light"] = colors.secondaryLight
    }

    if (colors?.secondaryDark) {
        vars["--rui-sys-color-secondary-dark"] = colors.secondaryDark
    }

    if (colors?.onSecondary) {
        vars["--rui-sys-color-on-secondary"] = colors.onSecondary
    }

    if (colors?.onSecondaryMedium) {
        vars["--rui-sys-color-on-secondary-medium"] = colors.onSecondaryMedium
    }

    if (colors?.onSecondaryOutline) {
        vars["--rui-sys-color-on-secondary-outline"] = colors.onSecondaryOutline
    }

    if (colors?.background) {
        vars["--rui-sys-color-background"] = colors.background
    }

    if (colors?.onBackground) {
        vars["--rui-sys-color-on-background"] = colors.onBackground
    }

    if (colors?.surface) {
        vars["--rui-sys-color-surface"] = colors.surface
    }

    if (colors?.surfaceDark) {
        vars["--rui-sys-color-surface-dark"] = colors.surfaceDark
    }

    if (colors?.surfaceInverse) {
        vars["--rui-sys-color-surface-inverse"] = colors.surfaceInverse
    }

    if (colors?.primaryInverse) {
        vars["--rui-sys-color-primary-inverse"] = colors.primaryInverse
    }

    if (colors?.onSurface) {
        vars["--rui-sys-color-on-surface"] = colors.onSurface
    }

    if (colors?.onSurfaceInverse) {
        vars["--rui-sys-color-on-surface-inverse"] = colors.onSurfaceInverse
    }

    if (colors?.onSurfaceHigh) {
        vars["--rui-sys-color-on-surface-high"] = colors.onSurfaceHigh
    }

    if (colors?.onSurfaceMedium) {
        vars["--rui-sys-color-on-surface-medium"] = colors.onSurfaceMedium
    }

    if (colors?.onSurfaceLow) {
        vars["--rui-sys-color-on-surface-low"] = colors.onSurfaceLow
    }

    if (colors?.onSurfaceOutline) {
        vars["--rui-sys-color-on-surface-outline"] = colors.onSurfaceOutline
    }

    if (colors?.error) {
        vars["--rui-sys-color-error"] = colors.error
    }

    if (colors?.onError) {
        vars["--rui-sys-color-on-error"] = colors.onError
    }

    if (theme.density != null) {
        vars["--rui-sys-density-scale"] = String(theme.density)
    }

    if (theme.iconStyle) {
        vars["--rui-sys-icon-style"] = theme.iconStyle
    }

    const categories = ["small", "medium", "large", "full"] as const

    for (const category of categories) {
        const shape = theme.shape?.[category]
        if (!shape) continue

        const resolved = resolveShapeCategory(shape)
        const prefix = `--rui-sys-shape-${category}`

        if (resolved.family) {
            vars[`${prefix}-family`] = resolved.family
        }

        if (resolved.startStart) {
            vars[`${prefix}-start-start`] = resolved.startStart
        }

        if (resolved.startEnd) {
            vars[`${prefix}-start-end`] = resolved.startEnd
        }

        if (resolved.endEnd) {
            vars[`${prefix}-end-end`] = resolved.endEnd
        }

        if (resolved.endStart) {
            vars[`${prefix}-end-start`] = resolved.endStart
        }
    }

    return vars
}

function mergeShapeCategory(base?: RThemeShapeCategory, next?: RThemeShapeCategory) {
    if (!base && !next) return undefined

    return {
        ...base,
        ...next,
    }
}

export function mergeTheme(base: RTheme, nextTheme: Partial<RTheme>): RTheme {
    return {
        color: {
            ...base.color,
            ...nextTheme.color,
        },
        density: nextTheme.density ?? base.density,
        iconStyle: nextTheme.iconStyle ?? base.iconStyle,
        shape: {
            small: mergeShapeCategory(base.shape?.small, nextTheme.shape?.small),
            medium: mergeShapeCategory(base.shape?.medium, nextTheme.shape?.medium),
            large: mergeShapeCategory(base.shape?.large, nextTheme.shape?.large),
            full: mergeShapeCategory(base.shape?.full, nextTheme.shape?.full),
        },
    }
}
