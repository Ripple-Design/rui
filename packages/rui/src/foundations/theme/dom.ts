import type { RTheme } from "./types"

import { themeToCSSVars } from "./core"

export function resolveThemeTarget(target?: HTMLElement | null) {
    if (target) {
        return target
    }

    if (typeof document !== "undefined") {
        return document.documentElement
    }

    return null
}

export function clearTheme(theme: RTheme, target?: HTMLElement | null) {
    const resolvedTarget = resolveThemeTarget(target)
    if (!resolvedTarget) {
        return
    }

    const vars = themeToCSSVars(theme)

    for (const name of Object.keys(vars)) {
        resolvedTarget.style.removeProperty(name)
    }
}

/** Applies a runtime theme by writing CSS variables onto the target element. */
export function applyTheme(theme: RTheme, target?: HTMLElement | null) {
    const resolvedTarget = resolveThemeTarget(target)
    if (!resolvedTarget) {
        return
    }

    const vars = themeToCSSVars(theme)

    for (const [name, value] of Object.entries(vars)) {
        resolvedTarget.style.setProperty(name, value)
    }
}
