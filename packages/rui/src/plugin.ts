import type { App, Plugin } from "vue"

import {
    createInternationalizationController,
    internationalizationKey,
} from "./foundations/internationalization/controller"
import type { RInternationalizationPluginOptions } from "./foundations/internationalization/types"
import {
    createThemeController,
    themeKey,
} from "./foundations/theme/controller"
import type { RThemePluginOptions } from "./foundations/theme/types"

export type RUIPluginOptions = {
    theme?: RThemePluginOptions
    internationalization?: RInternationalizationPluginOptions
}

export const ruiPlugin: Plugin = {
    install(app: App, options: RUIPluginOptions = {}) {
        const themeOptions = options.theme ?? {}
        const internationalizationOptions = options.internationalization ?? {}
        const theme = createThemeController(
            themeOptions.theme ?? {},
            themeOptions.target,
            themeOptions.mode ?? "system",
        )
        const internationalization = createInternationalizationController(
            internationalizationOptions.messages ?? {},
            internationalizationOptions.baseMessages ?? {},
            internationalizationOptions.locale ?? "en",
        )

        app.provide(themeKey, theme)
        app.provide(internationalizationKey, internationalization)
    },
}
