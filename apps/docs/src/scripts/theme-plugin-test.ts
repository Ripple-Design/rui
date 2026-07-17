import ThemePluginTestApp from "@docs/components/demos/theme/ThemePluginTestApp.vue"
import { themePlugin } from "@ripple-design/rui"
import { createApp } from "vue"

const element = document.getElementById("theme-plugin-test")

if (element) {
    const app = createApp(ThemePluginTestApp)

    app.use(themePlugin, {
        theme: {
            color: {
                primary: "#6200ee",
                onSurfaceHigh: "rgba(0, 0, 0, 0.87)",
                onSurfaceMedium: "rgba(0, 0, 0, 0.54)",
            },
        },
    })

    app.mount(element)
}
