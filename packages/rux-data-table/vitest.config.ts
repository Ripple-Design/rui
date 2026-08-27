import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: "@ripple-design/rui/foundations/internationalization/controller",
                replacement: fileURLToPath(
                    new URL("../rui/src/foundations/internationalization/controller.ts", import.meta.url),
                ),
            },
            {
                find: /^@ripple-design\/rui$/,
                replacement: fileURLToPath(new URL("../rui/src/index.ts", import.meta.url)),
            },
            {
                find: "@",
                replacement: fileURLToPath(new URL("../rui/src", import.meta.url)),
            },
        ],
    },
    test: {
        environment: "jsdom",
        include: ["src/**/__tests__/**/*.spec.ts"],
        setupFiles: ["./vitest.setup.ts"],
    },
})
