import type { RTheme } from "./types"

import { mergeTheme, themeToCSSVars } from "./core"
import { globalTheme, setGlobalTheme } from "./store"

export type RThemeTarget = HTMLElement | null | (() => HTMLElement | null)

export type RThemeDomOptions = {
    syncGlobal?: boolean
}

export function resolveThemeTarget(target?: RThemeTarget) {
    if (typeof target === "function") {
        return target()
    }

    if (target === null) {
        return null
    }

    if (target) {
        return target
    }

    if (typeof document !== "undefined") {
        return document.documentElement
    }

    return null
}

export function clearTheme(theme: RTheme, target?: RThemeTarget) {
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
export function applyTheme(theme: RTheme, target?: RThemeTarget, options: RThemeDomOptions = {}) {
    const resolvedTarget = resolveThemeTarget(target)
    if (!resolvedTarget) {
        return
    }

    const vars = themeToCSSVars(theme)

    for (const [name, value] of Object.entries(vars)) {
        resolvedTarget.style.setProperty(name, value)
    }

    if (options.syncGlobal ?? true) {
        setGlobalTheme(mergeTheme(globalTheme.value, theme))
    }
}
