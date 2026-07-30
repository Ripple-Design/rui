export type {
    RDayNightTheme,
    RShapeFamily,
    RTheme,
    RThemeColors,
    RThemeController,
    RThemeMode,
    RThemeModePreference,
    RThemePatch,
    RThemePluginOptions,
    RThemeShapeCategory,
    RThemeShapeCorner,
    RThemeShapeCorners,
    RThemeShapes,
    RThemeSource,
} from "./types"
export { mergeTheme, themeToCSSVars } from "./core"
export { createThemeBootstrapScript, resolveThemeBootstrapState } from "./bootstrap"
export { defaultDarkTheme, defaultDayNightTheme, defaultLightTheme } from "./defaults"
export { applyTheme, clearTheme, resolveThemeTarget } from "./dom"
export { createThemeController, provideTheme, themePlugin, useTheme } from "./controller"
export { default as RThemeProvider } from "./RThemeProvider.vue"
export { globalTheme, setGlobalTheme } from "./store"
export { mergeThemePatch, resolveActiveTheme, resolveDayNightTheme, resolveSystemThemeMode, resolveThemeMode, splitThemePatch } from "./resolve"
