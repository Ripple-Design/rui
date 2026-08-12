import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
    plugins: [
        vue(),
        dts({
            copyDtsFiles: true,
            outDir: "dist/types",
            tsconfigPath: "./tsconfig.json",
            entryRoot: "src",
        }),
    ],
    build: {
        lib: {
            name: "RuxFontPicker",
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            formats: ["es"],
            fileName: () => "es/index.js",
        },
    },
})
