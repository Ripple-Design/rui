import { mergeTheme } from "./core"

import type { RDayNightTheme, RTheme, RThemeMode, RThemeModePreference, RThemePatch } from "./types"

export function splitThemePatch(patch: RThemePatch) {
    const { day, night, ...shared } = patch
    return {
        shared: shared as Partial<RTheme>,
        day: day ?? {},
        night: night ?? {},
    }
}

export function resolveSystemThemeMode(systemPrefersDark?: boolean): RThemeMode {
    if (typeof systemPrefersDark === "boolean") {
        return systemPrefersDark ? "night" : "day"
    }

    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
    }

    return "day"
}

export function resolveThemeMode(preference: RThemeModePreference, systemPrefersDark?: boolean): RThemeMode {
    if (preference === "system") {
        return resolveSystemThemeMode(systemPrefersDark)
    }

    return preference
}

export function resolveDayNightTheme(defaults: RDayNightTheme, patch: RThemePatch): RDayNightTheme {
    const { shared, day, night } = splitThemePatch(patch)

    return {
        day: mergeTheme(mergeTheme(defaults.day, shared), day),
        night: mergeTheme(mergeTheme(defaults.night, shared), night),
    }
}

export function resolveActiveTheme(
    themes: RDayNightTheme,
    preference: RThemeModePreference,
    systemPrefersDark?: boolean,
): RTheme {
    const mode = resolveThemeMode(preference, systemPrefersDark)
    return themes[mode]
}

export function mergeThemePatch(base: RThemePatch, next: RThemePatch): RThemePatch {
    const baseParts = splitThemePatch(base)
    const nextParts = splitThemePatch(next)

    return {
        ...mergeTheme(baseParts.shared, nextParts.shared),
        day: mergeTheme(baseParts.day, nextParts.day),
        night: mergeTheme(baseParts.night, nextParts.night),
    }
}
