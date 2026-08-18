import type { RIconStyle } from "@/foundations/icon"

import { R_ICON_STYLES } from "@/foundations/icon"

import type { RIconFamily, RIconResolvableSource, RIconSource } from "./types.ts"

export function createIconFamily(
    filled: RIconSource,
    outlined: RIconSource,
    rounded: RIconSource,
    sharp: RIconSource,
    twotone: RIconSource,
): RIconFamily {
    return {
        filled,
        outlined,
        rounded,
        sharp,
        twotone,
    }
}

export function isIconFamily(value: unknown): value is RIconFamily {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false
    }

    return R_ICON_STYLES.every((style) => Object.prototype.hasOwnProperty.call(value, style))
}

export function resolveIconSource(icon: RIconResolvableSource | undefined, iconStyle: RIconStyle): RIconSource | undefined {
    if (!icon) {
        return undefined
    }

    if (isIconFamily(icon)) {
        return icon[iconStyle]
    }

    return icon
}
