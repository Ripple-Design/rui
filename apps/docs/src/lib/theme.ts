import type { RIconStyle, RShapeFamily, RTheme, RThemePatch } from "@ripple-design/rui"

import { R_ICON_STYLES, applyTheme, createThemeBootstrapScript, defaultDayNightTheme } from "@ripple-design/rui"

export const DOCS_THEME_KEY = "rui-docs-theme"
export const DOCS_THEME_MODE_KEY = "rui-docs-theme-mode"
export const DEFAULT_DOCS_THEME: RTheme = defaultDayNightTheme.day
export const DEFAULT_DOCS_DAY_NIGHT_THEME = defaultDayNightTheme

export function createShapeTheme(family: RShapeFamily): NonNullable<RTheme["shape"]> {
    return {
        small: { family },
        medium: { family },
        large: { family },
        full: { family },
    }
}

export function isValidDocsThemeColor(value: string) {
    return value.length > 0 && (typeof CSS === "undefined" || CSS.supports("color", value))
}

export function readDocsThemeStorage() {
    try {
        return localStorage.getItem(DOCS_THEME_KEY)
    } catch {
        return null
    }
}

export function writeDocsThemeStorage(theme: RThemePatch) {
    try {
        localStorage.setItem(DOCS_THEME_KEY, JSON.stringify(theme))
    } catch {
        // Ignore storage failures in restrictive environments.
    }
}

export function removeDocsThemeStorage() {
    try {
        localStorage.removeItem(DOCS_THEME_KEY)
    } catch {
        // Ignore storage failures in restrictive environments.
    }
}

function normalizeIconStyle(value: unknown): RIconStyle {
    return typeof value === "string" && R_ICON_STYLES.includes(value as RIconStyle)
        ? (value as RIconStyle)
        : DEFAULT_DOCS_THEME.iconStyle!
}

export function normalizeDocsThemePatch(theme: unknown): RThemePatch {
    const next = typeof theme === "object" && theme != null ? (theme as RThemePatch) : {}
    const densityOptions = new Set([0, -1, -2, -3])
    const density = densityOptions.has(next.density ?? NaN) ? next.density : DEFAULT_DOCS_THEME.density
    const shapeFamily = next.shape?.small?.family === "cut" ? "cut" : "rounded"
    const legacyPrimary =
        typeof next.color?.primary === "string" && isValidDocsThemeColor(next.color.primary) ? next.color.primary : undefined
    const dayPrimary =
        typeof next.day?.color?.primary === "string" && isValidDocsThemeColor(next.day.color.primary)
            ? next.day.color.primary
            : legacyPrimary
    const nightPrimary =
        typeof next.night?.color?.primary === "string" && isValidDocsThemeColor(next.night.color.primary)
            ? next.night.color.primary
            : undefined

    return {
        density,
        iconStyle: normalizeIconStyle(next.iconStyle),
        shape: createShapeTheme(shapeFamily),
        day: dayPrimary ? { color: { primary: dayPrimary } } : {},
        night: nightPrimary ? { color: { primary: nightPrimary } } : {},
    }
}

export function readDocsTheme(): RThemePatch {
    const raw = readDocsThemeStorage()
    if (!raw) {
        return {}
    }

    try {
        return normalizeDocsThemePatch(JSON.parse(raw))
    } catch {
        return {}
    }
}

export function createDocsThemeBootstrapScript() {
    return createThemeBootstrapScript({
        defaults: DEFAULT_DOCS_DAY_NIGHT_THEME,
        patchKey: DOCS_THEME_KEY,
        modeKey: DOCS_THEME_MODE_KEY,
        normalizePatchScript: `((theme) => {
            const next = typeof theme === "object" && theme != null ? theme : {};
            const densityOptions = new Set([0, -1, -2, -3]);
            const density = densityOptions.has(next.density ?? NaN) ? next.density : ${DEFAULT_DOCS_THEME.density};
            const iconStyles = ${JSON.stringify(R_ICON_STYLES)};
            const iconStyle = typeof next.iconStyle === "string" && iconStyles.includes(next.iconStyle) ? next.iconStyle : ${JSON.stringify(DEFAULT_DOCS_THEME.iconStyle)};
            const shapeFamily = next.shape?.small?.family === "cut" ? "cut" : "rounded";
            const legacyPrimary = typeof next.color?.primary === "string" && next.color.primary ? next.color.primary : undefined;
            const dayPrimary = typeof next.day?.color?.primary === "string" && next.day.color.primary ? next.day.color.primary : legacyPrimary;
            const nightPrimary = typeof next.night?.color?.primary === "string" && next.night.color.primary ? next.night.color.primary : undefined;
            return {
                density,
                iconStyle,
                shape: {
                    small: { family: shapeFamily },
                    medium: { family: shapeFamily },
                    large: { family: shapeFamily },
                    full: { family: shapeFamily },
                },
                day: dayPrimary ? { color: { primary: dayPrimary } } : {},
                night: nightPrimary ? { color: { primary: nightPrimary } } : {},
            };
        })`,
    })
}
