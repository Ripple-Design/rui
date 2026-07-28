import type { App, InjectionKey, Plugin } from "vue"

import { computed, inject, ref } from "vue"

import { applyTheme, clearTheme } from "./dom"
import { defaultDayNightTheme } from "./defaults"
import { mergeThemePatch, resolveActiveTheme, resolveDayNightTheme, resolveThemeMode } from "./resolve"
import { globalTheme, setGlobalTheme } from "./store"

import type { RTheme, RThemeController, RThemeModePreference, RThemePatch, RThemePluginOptions } from "./types"

export const themeKey: InjectionKey<RThemeController> = Symbol("ruiTheme")

export function createThemeController(
    initialThemePatch: RThemePatch = {},
    target?: HTMLElement | null,
    initialMode: RThemeModePreference = "system",
): RThemeController {
    const themePatch = ref<RThemePatch>(initialThemePatch)
    const defaultThemePatch = initialThemePatch
    const mode = ref<RThemeModePreference>(initialMode)
    const systemPrefersDark = ref(resolveThemeMode("system") === "night")
    const resolvedMode = computed(() => resolveThemeMode(mode.value, systemPrefersDark.value))
    const resolvedThemes = ref(resolveDayNightTheme(defaultDayNightTheme, themePatch.value))
    const theme = ref<RTheme>(resolveActiveTheme(resolvedThemes.value, mode.value, systemPrefersDark.value))

    const mediaQuery = typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null

    function applyResolvedTheme() {
        clearTheme(globalTheme.value, target)
        resolvedThemes.value = resolveDayNightTheme(defaultDayNightTheme, themePatch.value)
        theme.value = resolveActiveTheme(resolvedThemes.value, mode.value, systemPrefersDark.value)
        setGlobalTheme(theme.value)
        applyTheme(theme.value, target)
    }

    if (mediaQuery) {
        const handleSystemChange = (event: MediaQueryListEvent) => {
            systemPrefersDark.value = event.matches
            if (mode.value === "system") {
                applyResolvedTheme()
            }
        }

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleSystemChange)
        } else {
            mediaQuery.addListener(handleSystemChange)
        }
    }

    systemPrefersDark.value = mediaQuery?.matches ?? systemPrefersDark.value
    setGlobalTheme(theme.value)
    applyTheme(theme.value, target)

    return {
        theme,
        mode,
        resolvedMode,
        setTheme(nextTheme: RThemePatch) {
            themePatch.value = mergeThemePatch(themePatch.value, nextTheme)
            applyResolvedTheme()
        },
        setMode(nextMode) {
            mode.value = nextMode
            applyResolvedTheme()
        },
        resetTheme() {
            themePatch.value = defaultThemePatch
            mode.value = initialMode
            applyResolvedTheme()
        },
    }
}

export const themePlugin: Plugin = {
    install(app: App, options: RThemePluginOptions = {}) {
        const controller = createThemeController(options.theme ?? {}, options.target, options.mode ?? "system")
        app.provide(themeKey, controller)
        app.config.globalProperties.$ruiTheme = controller
    },
}

export function useTheme() {
    const controller = inject(themeKey)
    if (!controller) throw new Error("[RUI] useTheme must be used after installing themePlugin")
    return controller
}
