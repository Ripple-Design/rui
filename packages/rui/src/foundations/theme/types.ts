import type { Ref } from "vue"

export type RThemeColors = {
    primary?: string
    onSurfaceHigh?: string
    onSurfaceMedium?: string
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
    shape?: RThemeShapes
}

export type RThemeController = {
    theme: Ref<RTheme>
    setTheme: (nextTheme: Partial<RTheme>) => void
    resetTheme: () => void
}

export type RThemePluginOptions = {
    theme?: RTheme
    target?: HTMLElement | null
}
