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
        cssCodeSplit: true,
        lib: {
            name: "RuxVideoPlayer",
            entry: {
                index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
                styles: fileURLToPath(new URL("./src/styles.ts", import.meta.url)),
            },
            formats: ["es"],
            fileName: (_format, entryName) => `es/${entryName}.js`,
        },
        rolldownOptions: {
            external: ["vue", "@ripple-design/rui", "@ripple-design/icons"],
            output: {
                assetFileNames: (info) => (info.name === "styles.css" ? "rux-video-player.css" : "[name][extname]"),
            },
        },
    },
})
