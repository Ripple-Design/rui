export const R_ICON_STYLES = ["filled", "outlined", "rounded", "sharp", "twotone"] as const

export type RIconStyle = typeof R_ICON_STYLES[number]
export type RIconStyleMap<T> = Record<RIconStyle, T>

export function isRIconStyle(value: unknown): value is RIconStyle {
    return typeof value === "string" && R_ICON_STYLES.includes(value as RIconStyle)
}
