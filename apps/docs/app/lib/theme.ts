import type { RTheme } from "@ripple-design/rui"

import { R_ICON_STYLES, createThemeBootstrapScript, defaultDayNightTheme } from "@ripple-design/rui"

export const DOCS_THEME_KEY = "rui-docs-theme"
export const DOCS_THEME_MODE_KEY = "rui-docs-theme-mode"
export const DEFAULT_DOCS_DAY_NIGHT_THEME = defaultDayNightTheme

const DEFAULT_DOCS_THEME: RTheme = defaultDayNightTheme.day

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
                    icon: { family: shapeFamily },
                },
                day: dayPrimary ? { color: { primary: dayPrimary } } : {},
                night: nightPrimary ? { color: { primary: nightPrimary } } : {},
            };
        })`,
    })
}
