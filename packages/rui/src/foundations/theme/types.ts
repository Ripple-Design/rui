import type { RIconStyle } from "@/foundations/icon"
import type { ComputedRef, Ref } from "vue"

import type { RThemeTarget } from "./dom"

export type RThemeColors = {
    primary?: string
    primaryLow?: string
    primaryLight?: string
    primaryDark?: string
    onPrimary?: string
    onPrimaryMedium?: string
    onPrimaryOutline?: string
    secondary?: string
    secondaryLight?: string
    secondaryDark?: string
    onSecondary?: string
    onSecondaryMedium?: string
    onSecondaryOutline?: string
    background?: string
    onBackground?: string
    surface?: string
    surfaceDark?: string
    onSurface?: string
    onSurfaceHigh?: string
    onSurfaceMedium?: string
    onSurfaceLow?: string
    onSurfaceOutline?: string
    error?: string
    onError?: string
}

export type RShapeFamily = "rounded" | "cut"
export type RThemeShapeCorner = string | number
export type RThemeShapeCorners =
    | RThemeShapeCorner
    | [RThemeShapeCorner]
    | [RThemeShapeCorner, RThemeShapeCorner]
    | [RThemeShapeCorner, RThemeShapeCorner, RThemeShapeCorner]
    | [RThemeShapeCorner, RThemeShapeCorner, RThemeShapeCorner, RThemeShapeCorner]

export type RThemeShapeCategory = {
    family?: RShapeFamily
    corners?: RThemeShapeCorners
    startStart?: RThemeShapeCorner
    startEnd?: RThemeShapeCorner
    endEnd?: RThemeShapeCorner
    endStart?: RThemeShapeCorner
}

export type RThemeShapes = {
    small?: RThemeShapeCategory
    medium?: RThemeShapeCategory
    large?: RThemeShapeCategory
    full?: RThemeShapeCategory
}

export type RTheme = {
    color?: RThemeColors
    density?: number
    iconStyle?: RIconStyle
    shape?: RThemeShapes
}

export type RThemePatch = Partial<RTheme> & {
    day?: Partial<RTheme>
    night?: Partial<RTheme>
}

export type RThemeMode = "day" | "night"
export type RThemeModePreference = RThemeMode | "system"

export type RDayNightTheme = {
    day: RTheme
    night: RTheme
}

export type RThemeSource = RTheme | RThemePatch | RDayNightTheme

export type RThemeSetOptions = {
    replace?: boolean
    resetDefault?: boolean
}

export type RThemeModeSetOptions = {
    resetDefault?: boolean
}

export type RThemeController = {
    theme: Ref<RTheme>
    mode: Ref<RThemeModePreference>
    resolvedMode: ComputedRef<RThemeMode>
    setTheme: (nextTheme: RThemePatch, options?: RThemeSetOptions) => void
    setMode: (nextMode: RThemeModePreference, options?: RThemeModeSetOptions) => void
    resetTheme: () => void
    destroy: () => void
}

export type RThemePluginOptions = {
    mode?: RThemeModePreference
    target?: RThemeTarget
    theme?: RThemeSource
}
