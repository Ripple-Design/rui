import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            outDirs: ["./dist"],
            tsconfigPath: "./tsconfig.json",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            formats: ["es"],
            fileName: "index",
        },
        rolldownOptions: {
            external: ["vue"],
        },
    },
})
