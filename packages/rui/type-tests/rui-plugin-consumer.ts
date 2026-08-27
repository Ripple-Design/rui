import {
    createInternationalizationController,
    ruiPlugin,
    type RUIPluginOptions,
    useInternationalization,
} from "@ripple-design/rui"
import { createApp, defineComponent } from "vue"

const options: RUIPluginOptions = {
    internationalization: {
        locale: "zh-CN",
        messages: {
            "fr-CA": {
                "app.save": "Enregistrer",
            },
        },
    },
    theme: {
        mode: "system",
        theme: {
            color: {
                primary: "#3367d6",
            },
        },
    },
}

const app = createApp(defineComponent({
    setup() {
        const internationalization = useInternationalization()
        internationalization.setLocale("zh-CN")
        internationalization.resolveMessage("form.optional")
        return () => null
    },
}))

app.use(ruiPlugin, options)

const controller = createInternationalizationController({}, {}, "en")
controller.setLocale("fr-CA")
