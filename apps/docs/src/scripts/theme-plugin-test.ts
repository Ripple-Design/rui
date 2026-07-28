import ThemePluginTestApp from "@docs/components/demos/theme/ThemePluginTestApp.vue"
import { R_ICON_STYLES, themePlugin } from "@ripple-design/rui"
import { createApp } from "vue"

const element = document.getElementById("theme-plugin-test")

if (element) {
    const app = createApp(ThemePluginTestApp)

    app.use(themePlugin, {
        mode: "day",
        theme: {
            color: {
                primary: "#6200ee",
                onSurface: "#000000",
            },
            density: 0,
            iconStyle: R_ICON_STYLES[0],
            shape: {
                small: { family: "rounded" },
                medium: { family: "rounded" },
                large: { family: "rounded" },
                full: { family: "rounded" },
            },
        },
    })

    app.mount(element)
}
