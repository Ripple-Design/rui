import type {
    App,
    InjectionKey,
    Plugin,
} from "vue"

import { computed, inject, provide, ref } from "vue"

import { applyTheme, clearTheme } from "./dom"
import { defaultDayNightTheme } from "./defaults"
import { mergeThemePatch, resolveActiveTheme, resolveDayNightTheme, resolveThemeMode } from "./resolve"
import { setGlobalTheme } from "./store"

import type {
    RTheme,
    RThemeController,
    RThemeModePreference,
    RThemeModeSetOptions,
    RThemePatch,
    RThemePluginOptions,
    RThemeSetOptions,
} from "./types"

export const themeKey: InjectionKey<RThemeController> = Symbol("ruiTheme")

export function createThemeController(
    initialThemePatch: RThemePatch = {},
    target?: import("./dom").RThemeTarget,
    initialMode: RThemeModePreference = "system",
    options: { syncGlobal?: boolean } = {},
): RThemeController {
    const syncGlobal = options.syncGlobal ?? true
    const themePatch = ref<RThemePatch>(initialThemePatch)
    const defaultThemePatch = ref<RThemePatch>(initialThemePatch)
    const mode = ref<RThemeModePreference>(initialMode)
    const defaultMode = ref<RThemeModePreference>(initialMode)
    const systemPrefersDark = ref(resolveThemeMode("system") === "night")
    const resolvedMode = computed(() => resolveThemeMode(mode.value, systemPrefersDark.value))
    const resolvedThemes = ref(resolveDayNightTheme(defaultDayNightTheme, themePatch.value))
    const theme = ref<RTheme>(resolveActiveTheme(resolvedThemes.value, mode.value, systemPrefersDark.value))

    const mediaQuery = typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null

    function applyResolvedTheme(previousTheme?: RTheme) {
        clearTheme(previousTheme ?? theme.value, target)
        resolvedThemes.value = resolveDayNightTheme(defaultDayNightTheme, themePatch.value)
        theme.value = resolveActiveTheme(resolvedThemes.value, mode.value, systemPrefersDark.value)
        if (syncGlobal) {
            setGlobalTheme(theme.value)
        }
        applyTheme(theme.value, target, { syncGlobal })
    }

    const handleSystemChange = (event: MediaQueryListEvent) => {
        systemPrefersDark.value = event.matches
        if (mode.value === "system") {
            applyResolvedTheme()
        }
    }

    if (mediaQuery) {
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleSystemChange)
        } else {
            mediaQuery.addListener(handleSystemChange)
        }
    }

    systemPrefersDark.value = mediaQuery?.matches ?? systemPrefersDark.value
    if (syncGlobal) {
        setGlobalTheme(theme.value)
    }
    applyTheme(theme.value, target, { syncGlobal })

    return {
        theme,
        mode,
        resolvedMode,
        setTheme(nextTheme: RThemePatch, options: RThemeSetOptions = {}) {
            const previousTheme = theme.value
            themePatch.value = options.replace ? nextTheme : mergeThemePatch(themePatch.value, nextTheme)
            if (options.resetDefault) {
                defaultThemePatch.value = themePatch.value
            }
            applyResolvedTheme(previousTheme)
        },
        setMode(nextMode, options: RThemeModeSetOptions = {}) {
            const previousTheme = theme.value
            mode.value = nextMode
            if (options.resetDefault) {
                defaultMode.value = nextMode
            }
            applyResolvedTheme(previousTheme)
        },
        resetTheme() {
            const previousTheme = theme.value
            themePatch.value = defaultThemePatch.value
            mode.value = defaultMode.value
            applyResolvedTheme(previousTheme)
        },
        destroy() {
            clearTheme(theme.value, target)
            if (mediaQuery) {
                if (typeof mediaQuery.removeEventListener === "function") {
                    mediaQuery.removeEventListener("change", handleSystemChange)
                } else {
                    mediaQuery.removeListener(handleSystemChange)
                }
            }
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

export function provideTheme(controller: RThemeController) {
    provide(themeKey, controller)
    return controller
}
