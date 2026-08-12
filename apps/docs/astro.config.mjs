import mdx from "@astrojs/mdx"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"
import path from "node:path"
import { fileURLToPath } from "node:url"

const docsSrc = fileURLToPath(new URL("./src", import.meta.url))
const ruiRoot = fileURLToPath(new URL("../../packages/rui", import.meta.url))
const ruiSrc = fileURLToPath(new URL("../../packages/rui/src", import.meta.url))
const videoPlayerSrc = fileURLToPath(new URL("../../packages/rux-video-player/src", import.meta.url))
const dataTableSrc = fileURLToPath(new URL("../../packages/rux-data-table/src", import.meta.url))
const dateTimePickerSrc = fileURLToPath(new URL("../../packages/rux-date-time-picker/src", import.meta.url))
const fontPickerSrc = fileURLToPath(new URL("../../packages/rux-font-picker/src", import.meta.url))

export default defineConfig({
    integrations: [vue(), mdx()],
    i18n: {
        locales: ["en", "zh-cn"],
        defaultLocale: "en",
    },
    vite: {
        build: {
            cssCodeSplit: false,
        },
        resolve: {
            dedupe: ["vue"],
            alias: {
                "@": ruiSrc,
                "@docs": docsSrc,
                "@ripple-design/rui/playground": path.join(ruiSrc, "playground/index.ts"),
                "@ripple-design/rui/styles.css": path.join(ruiSrc, "styles/index.scss"),
                "@ripple-design/rui/components": path.join(ruiSrc, "components/index.ts"),
                "@ripple-design/rui/rui": path.join(ruiRoot, "rui.scss"),
                "@ripple-design/rui/rui.scss": path.join(ruiRoot, "rui.scss"),
                "@ripple-design/rui/typography": path.join(ruiRoot, "typography.scss"),
                "@ripple-design/rui/typography.scss": path.join(ruiRoot, "typography.scss"),
                "@ripple-design/rui/foundations/ripple": path.join(ruiSrc, "foundations/ripple/index.ts"),
                "@ripple-design/rui/foundations/touchTarget": path.join(ruiSrc, "foundations/touchTarget/index.ts"),
                "@ripple-design/rux-video-player/styles.css": path.join(videoPlayerSrc, "styles.ts"),
                "@ripple-design/rux-video-player": path.join(videoPlayerSrc, "index.ts"),
                "@ripple-design/rux-data-table/styles.css": path.join(dataTableSrc, "styles.ts"),
                "@ripple-design/rux-data-table": path.join(dataTableSrc, "index.ts"),
                "@ripple-design/rux-date-time-picker/styles.css": path.join(dateTimePickerSrc, "styles.ts"),
                "@ripple-design/rux-date-time-picker": path.join(dateTimePickerSrc, "index.ts"),
                "@ripple-design/rux-font-picker/styles.css": path.join(fontPickerSrc, "styles.ts"),
                "@ripple-design/rux-font-picker": path.join(fontPickerSrc, "index.ts"),
                "@ripple-design/rui": path.join(ruiSrc, "index.ts"),
            },
        },
    },
})
