import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const rootDir = fileURLToPath(new URL(".", import.meta.url))
const componentsRoot = path.join(rootDir, "src/components")

function getPublicVueEntries() {
    const entries: Record<string, string> = {}

    const componentDirs = readdirSync(componentsRoot, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())

    for (const dirent of componentDirs) {
        const groupDir = path.join(componentsRoot, dirent.name)
        const files = readdirSync(groupDir, { withFileTypes: true })

        for (const file of files) {
            if (!file.isFile()) {
                continue
            }

            if (!/^R[A-Z].*\.vue$/.test(file.name)) {
                continue
            }

            const componentName = file.name.replace(/\.vue$/, "")
            entries[`components/${dirent.name}/${componentName}`] = path.join(groupDir, file.name)
        }
    }

    return entries
}

const publicVueEntries = getPublicVueEntries()

export default defineConfig({
    plugins: [
        vue(),
        dts({
            entryRoot: "src",
            outDirs: ["./dist/types"],
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
            name: "RUI",
            entry: {
                index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
                styles: fileURLToPath(new URL("./src/styles.ts", import.meta.url)),
                "components/index": fileURLToPath(new URL("./src/components/index.ts", import.meta.url)),
                ...publicVueEntries,
            },
            formats: ["es"],
            fileName: (_format, entryName) => `es/${entryName}.js`,
        },
        rolldownOptions: {
            external: ["vue"],
        },
    },
})
