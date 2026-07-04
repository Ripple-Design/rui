import { defineConfig } from "astro/config"
import vue from "@astrojs/vue"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    integrations: [vue()],
    vite: {
        server: {
            fs: {
                allow: [resolve(__dirname, "../..")],
            },
        },
    },
})
