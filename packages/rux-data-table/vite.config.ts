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
            compilerOptions: {
                removeComments: false,
            },
        }),
    ],
    build: {
        lib: {
            name: "ruxDataTable",
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        },
        rolldownOptions: {
            external: ["vue", "@ripple-design/rui"],
            output: [
                {
                    format: "es",
                    entryFileNames: "es/[name].js",
                    chunkFileNames: "es/_chunks/[name]-[hash].js",
                    assetFileNames: "assets/styles.css",
                },
                {
                    format: "cjs",
                    entryFileNames: "cjs/[name].cjs",
                    chunkFileNames: "cjs/_chunks/[name]-[hash].cjs",
                    assetFileNames: "assets/styles.css",
                    exports: "named",
                },
            ],
        },
    },
})
