import type { App, InjectionKey, Plugin } from "vue"

import { inject, ref } from "vue"

import type { RTheme, RThemeController, RThemePluginOptions } from "./types"

import { mergeTheme } from "./core"
import { applyTheme, clearTheme } from "./dom"

export const themeKey: InjectionKey<RThemeController> = Symbol("ruiTheme")

export function createThemeController(initialTheme: RTheme = {}, target?: HTMLElement | null): RThemeController {
    const theme = ref<RTheme>(initialTheme)
    const defaultTheme = initialTheme

    applyTheme(initialTheme, target)

    return {
        theme,
        setTheme(nextTheme) {
            const merged = mergeTheme(theme.value, nextTheme)
            clearTheme(theme.value, target)
            theme.value = merged
            applyTheme(theme.value, target)
        },
        resetTheme() {
            clearTheme(theme.value, target)
            theme.value = defaultTheme
            applyTheme(defaultTheme, target)
        },
    }
}

export const themePlugin: Plugin = {
    install(app: App, options: RThemePluginOptions = {}) {
        const controller = createThemeController(options.theme ?? {}, options.target)
        app.provide(themeKey, controller)
        app.config.globalProperties.$ruiTheme = controller
    },
}

export function useTheme() {
    const controller = inject(themeKey)
    if (!controller) throw new Error("[RUI] useTheme must be used after installing themePlugin")
    return controller
}
