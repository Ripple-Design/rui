import type { App, InjectionKey, Plugin, Ref } from "vue"
import { inject, ref } from "vue"

export type ThemeColors = {
    primary?: string
    onSurfaceHigh?: string
    onSurfaceMedium?: string
}

export type Theme = {
    color?: ThemeColors
}

export type ThemeController = {
    theme: Ref<Theme>
    setTheme: (nextTheme: Partial<Theme>) => void
    resetTheme: () => void
}

export type ThemePluginOptions = {
    theme?: Theme
    target?: HTMLElement
}

/** Converts a runtime theme object into CSS variable key-value pairs. */
export function themeToCSSVars(theme: Theme) {
    const vars: Record<string, string> = {}

    if (theme.color?.primary) {
        vars["--rui-sys-color-primary"] = theme.color.primary
    }

    if (theme.color?.onSurfaceHigh) {
        vars["--rui-sys-color-on-surface-high"] = theme.color.onSurfaceHigh
    }

    if (theme.color?.onSurfaceMedium) {
        vars["--rui-sys-color-on-surface-medium"] = theme.color.onSurfaceMedium
    }

    return vars
}

/** Applies a runtime theme by writing CSS variables onto the target element. */
export function applyTheme(theme: Theme, target: HTMLElement = document.documentElement) {
    const vars = themeToCSSVars(theme)

    for (const [name, value] of Object.entries(vars)) {
        target.style.setProperty(name, value)
    }
}

const themeKey: InjectionKey<ThemeController> = Symbol("theme")

function mergeTheme(base: Theme, nextTheme: Partial<Theme>): Theme {
    return {
        color: {
            ...base.color,
            ...nextTheme.color,
        },
    }
}

function createThemeController(initialTheme: Theme = {}, target: HTMLElement = document.documentElement): ThemeController {
    const theme = ref<Theme>(initialTheme)
    const defaultTheme = initialTheme

    applyTheme(initialTheme, target)

    return {
        theme,
        setTheme(nextTheme) {
            theme.value = mergeTheme(theme.value, nextTheme)
            applyTheme(theme.value, target)
        },
        resetTheme() {
            theme.value = defaultTheme
            applyTheme(defaultTheme, target)
        },
    }
}

export const themePlugin: Plugin = {
    install(app: App, options: ThemePluginOptions = {}) {
        const controller = createThemeController(options.theme ?? {}, options.target ?? document.documentElement)
        app.provide(themeKey, controller)
        app.config.globalProperties.$theme = controller
    },
}

export function useTheme() {
    const controller = inject(themeKey)

    if (!controller) {
        throw new Error("useTheme must be used after installing themePlugin")
    }

    return controller
}
