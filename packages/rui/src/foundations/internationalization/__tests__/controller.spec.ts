import { createApp, defineComponent, h } from "vue"
import { describe, expect, it } from "vitest"

import {
    createInternationalizationController,
    internationalizationKey,
    provideInternationalization,
    useInternationalization,
} from "../controller"

describe("internationalization controller", () => {
    it("updates message resolution when the locale changes", () => {
        const controller = createInternationalizationController(
            {
                en: { marker: "english" },
                fr: { marker: "french" },
            },
            {},
            "en",
        )

        expect(controller.locale.value).toBe("en")
        expect(controller.resolveMessage("marker")).toBe("english")

        controller.setLocale("fr")

        expect(controller.locale.value).toBe("fr")
        expect(controller.resolveMessage("marker")).toBe("french")
    })

    it("resolves built-in component messages before supplied catalogs", () => {
        const controller = createInternationalizationController(
            {
                "zh-CN": {
                    "form.required": "overridden",
                },
            },
            {
                "form.optional": "overridden",
            },
            "zh-CN",
        )

        expect(controller.resolveMessage("form.required")).toBe("必填")
        expect(controller.resolveMessage("form.optional")).toBe("（选填）")
        expect(controller.resolveMessage("data-table.all")).toBe("全部")
        expect(controller.resolveMessage("data-table.prev-page")).toBe("上一页")
        expect(controller.resolveMessage("data-table.next-page")).toBe("下一页")
    })

    it("provides the controller to nested component setup", () => {
        const controller = createInternationalizationController({}, {}, "en")
        let resolvedController: ReturnType<typeof useInternationalization> | undefined
        const root = document.createElement("div")

        const Consumer = defineComponent({
            setup() {
                resolvedController = useInternationalization()
                return () => h("div")
            },
        })
        const Provider = defineComponent({
            setup() {
                provideInternationalization(controller)
                return () => h(Consumer)
            },
        })

        const app = createApp(Provider)
        app.mount(root)

        expect(resolvedController).toBe(controller)

        app.unmount()
    })

    it("throws without an internationalization controller", () => {
        const root = document.createElement("div")
        let error: unknown
        const Consumer = defineComponent({
            setup() {
                try {
                    useInternationalization()
                } catch (nextError) {
                    error = nextError
                }
                return () => h("div")
            },
        })

        const app = createApp(Consumer)
        app.mount(root)

        expect(error).toEqual(new Error("[RUI] useInternationalization must be used after providing an internationalization controller"))

        app.unmount()
    })

    it("uses the injection key internally", () => {
        expect(internationalizationKey).toBeTypeOf("symbol")
    })
})
