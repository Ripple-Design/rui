import type { RShapeFamily, RTheme } from "@ripple-design/rui"

import { applyTheme } from "@ripple-design/rui"

export const DOCS_THEME_KEY = "rui-docs-theme"
export const DEFAULT_DOCS_THEME: RTheme = {
    color: {
        primary: "#6200ee",
    },
    density: 0,
    shape: {
        small: { family: "rounded" },
        medium: { family: "rounded" },
        large: { family: "rounded" },
        full: { family: "rounded" },
    },
}

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

export function writeDocsThemeStorage(theme: RTheme) {
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

export function normalizeDocsTheme(theme: unknown): RTheme {
    const next = typeof theme === "object" && theme != null ? (theme as RTheme) : {}
    const densityOptions = new Set([0, -1, -2, -3])
    const density = densityOptions.has(next.density ?? NaN) ? next.density : DEFAULT_DOCS_THEME.density
    const shapeFamily = next.shape?.small?.family === "cut" ? "cut" : "rounded"

    return {
        color: {
            primary:
                typeof next.color?.primary === "string" && isValidDocsThemeColor(next.color.primary)
                    ? next.color.primary
                    : DEFAULT_DOCS_THEME.color?.primary,
        },
        density,
        shape: createShapeTheme(shapeFamily),
    }
}

export function readDocsTheme(): RTheme {
    const raw = readDocsThemeStorage()
    if (!raw) {
        return DEFAULT_DOCS_THEME
    }

    try {
        return normalizeDocsTheme(JSON.parse(raw))
    } catch {
        return DEFAULT_DOCS_THEME
    }
}

export function applyDocsTheme(theme: RTheme, target?: HTMLElement | null) {
    applyTheme(theme, target)
}
