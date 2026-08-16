import mdx from "@astrojs/mdx"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"
import path from "node:path"
import { fileURLToPath } from "node:url"

const docsSrc = fileURLToPath(new URL("./src", import.meta.url))
const ruiSrc = fileURLToPath(new URL("../../packages/rui/src", import.meta.url))

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
        server: {
            fs: {
                allow: [fileURLToPath(new URL("../../", import.meta.url))],
            },
            watch: {
                ignored: ["!**/packages/**"],
            },
        },
        resolve: {
            dedupe: ["vue"],
            conditions: ["sass", "import", "module"],
            alias: [
                { find: "@docs", replacement: docsSrc },
                {
                    find: /^@ripple-design\/rui$/,
                    replacement: path.join(ruiSrc, "index.ts"),
                },
                { find: /^@ripple-design\/rui\/foundations\/(.*)$/, replacement: path.join(ruiSrc, "foundations/$1") },
            ],
        },
    },
})
