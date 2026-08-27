import { createApp, defineComponent, h } from "vue"
import { describe, expect, it } from "vitest"

import { ruiPlugin } from "../plugin"
import { useInternationalization } from "../foundations/internationalization"
import { useTheme } from "../foundations/theme"

describe("ruiPlugin", () => {
    it("provides theme and internationalization controllers", () => {
        let internationalization: ReturnType<typeof useInternationalization> | undefined
        let theme: ReturnType<typeof useTheme> | undefined
        const root = document.createElement("div")
        const Consumer = defineComponent({
            setup() {
                internationalization = useInternationalization()
                theme = useTheme()
                return () => h("div")
            },
        })
        const app = createApp(Consumer)

        app.use(ruiPlugin, {
            internationalization: {
                locale: "zh-CN",
                messages: {
                    en: {
                        marker: "Marker",
                    },
                },
            },
            theme: {
                mode: "day",
            },
        })
        app.mount(root)

        expect(internationalization?.resolveMessage("form.optional")).toBe("（选填）")
        expect(theme?.mode.value).toBe("day")

        internationalization?.setLocale("en")
        expect(internationalization?.resolveMessage("marker")).toBe("Marker")

        app.unmount()
        theme?.destroy()
    })
})
