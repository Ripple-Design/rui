import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { createHighlighter } from "shiki"

import { R_ICON_STYLES } from "../../packages/rui/src/foundations/icon/style"
import { locales } from "./app/lib/docs"

const repoRoot = fileURLToPath(new URL("../..", import.meta.url))
const demosRoot = fileURLToPath(new URL("./app/components/demos", import.meta.url))
const ruiSrc = path.join(repoRoot, "packages/rui/src")
const ruxChatSrc = path.join(repoRoot, "packages/rux-chat/src")
const ruxDataTableSrc = path.join(repoRoot, "packages/rux-data-table/src")
const ruxDateTimePickerSrc = path.join(repoRoot, "packages/rux-date-time-picker/src")

function toPosix(value: string) {
    return value.replace(/\\/g, "/")
}

const demoSources = new Map<string, string>()

function collectDemoSources(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            collectDemoSources(fullPath)
        } else if (entry.name.endsWith(".vue")) {
            demoSources.set(entry.name.slice(0, -".vue".length), readFileSync(fullPath, "utf8"))
        }
    }
}

collectDemoSources(demosRoot)

let demoHighlighter: ReturnType<typeof createHighlighter> | null = null

// Inject the highlighted demo source into the MDC AST so it travels with the page
// payload and survives client-side navigation without shipping Shiki to the browser.
async function injectDemoSources(content: { body?: { value?: unknown[] } }) {
    const value = content.body?.value

    if (!Array.isArray(value)) {
        return
    }

    const highlighter = (demoHighlighter ??= createHighlighter({
        themes: ["github-light"],
        langs: ["vue"],
    }))

    async function visit(node: unknown) {
        if (!Array.isArray(node) || typeof node[0] !== "string") {
            return
        }

        const [tag, rawProps, ...children] = node as [string, Record<string, unknown>, ...unknown[]]
        const props = rawProps ?? {}

        if (tag === "demo-block") {
            const demo = typeof props.demo === "string" ? props.demo : null
            const source = demo ? demoSources.get(demo) : null

            if (source && typeof props.source !== "string") {
                props.source = (await highlighter).codeToHtml(source.trimEnd(), {
                    lang: typeof props.language === "string" ? props.language : "vue",
                    theme: "github-light",
                })
            }
        }

        await Promise.all(children.map(visit))
    }

    await Promise.all(value.map(visit))
}

function resolveSassFile(basePath: string) {
    const baseName = path.basename(basePath)
    const directory = path.dirname(basePath)
    const candidates = [
        basePath,
        `${basePath}.scss`,
        path.join(directory, `_${baseName}.scss`),
        path.join(basePath, "index.scss"),
        path.join(basePath, "_index.scss"),
    ]

    return candidates.find((candidate) => {
        try {
            return statSync(candidate).isFile()
        } catch {
            return false
        }
    })
}

// Workspace packages are consumed from source so the docs always reflect `packages/*/src`.
// Their `@/` imports point into the same package source and are mapped below, and their
// `@ripple-design/rui/styles/*` imports must resolve without a built package.
const ruiStyleImporter = {
    canonicalize(url: string, context: { containingUrl?: URL | string | null }) {
        let basePath: string | null = null

        if (url.startsWith("@ripple-design/rui/")) {
            basePath = path.join(ruiSrc, url.slice("@ripple-design/rui/".length))
        } else if (url.startsWith("@/")) {
            if (!context?.containingUrl) {
                return null
            }

            const containingPath = fileURLToPath(context.containingUrl).replace(/\\/g, "/")
            const match = containingPath.match(/\/packages\/([^/]+)\/src\//)

            if (!match) {
                return null
            }

            basePath = path.join(repoRoot, "packages", match[1], "src", url.slice(2))
        }

        if (!basePath) {
            return null
        }

        const file = resolveSassFile(basePath)
        return file ? pathToFileURL(file) : null
    },
    load(canonicalUrl: URL) {
        return {
            contents: readFileSync(fileURLToPath(canonicalUrl), "utf8"),
            syntax: "scss",
        }
    },
}

// Docs and API routes are discovered by the prerender crawler from the rendered
// navigation; only routes without inbound links need to be listed explicitly.
function collectPrerenderRoutes() {
    const routes = new Set<string>()

    for (const locale of locales) {
        routes.add(`/${locale}`)
        routes.add(`/${locale}/icons`)
        routes.add(`/${locale}/theme-plugin-test`)

        for (const style of R_ICON_STYLES.slice(1)) {
            routes.add(`/${locale}/icons/${style}`)
        }
    }

    return [...routes].sort()
}

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: false },
    ssr: true,
    modules: ["@nuxtjs/i18n", "@nuxt/content"],
    content: {
        build: {
            markdown: {
                toc: { depth: 3, searchDepth: 3 },
            },
        },
    },
    css: ["~/assets/styles/base.scss", "~/assets/styles/docs-prose.scss"],
    alias: {
        "@docs": fileURLToPath(new URL("./app", import.meta.url)),
    },
    components: [
        { path: "~/components/content", global: true },
        { path: "~/components/docs" },
        { path: "~/components/icons" },
    ],
    app: {
        head: {
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width" },
            ],
            link: [
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Roboto:wght@300;400;500;700&display=swap",
                },
            ],
        },
    },
    i18n: {
        strategy: "prefix",
        defaultLocale: "en",
        // Set NUXT_PUBLIC_SITE_URL in production so hreflang/canonical URLs are absolute.
        baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
        detectBrowserLanguage: false,
        langDir: "locales",
        locales: [
            { code: "en", language: "en", name: "English", file: "en.json" },
            { code: "zh-cn", language: "zh-CN", name: "简体中文", file: "zh-cn.json" },
        ],
    },
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: collectPrerenderRoutes(),
        },
    },
    hooks: {
        "content:file:afterParse"(ctx) {
            return injectDemoSources(ctx.content as { body?: { value?: unknown[] } })
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    importers: [ruiStyleImporter],
                },
            },
        },
        resolve: {
            dedupe: ["vue"],
            conditions: ["sass", "import", "module"],
            alias: [
                // `packages/rui/src` uses `@/` for package-local imports. These four
                // prefixes cover all of them; the docs app itself uses `~/` or `@docs`.
                { find: /^@\/components$/, replacement: toPosix(path.join(ruiSrc, "components/index.ts")) },
                { find: /^@\/components\//, replacement: toPosix(path.join(ruiSrc, "components/")) },
                { find: /^@\/foundations\//, replacement: toPosix(path.join(ruiSrc, "foundations/")) },
                { find: /^@\/primitives\//, replacement: toPosix(path.join(ruiSrc, "primitives/")) },
                { find: /^@\/utils\//, replacement: toPosix(path.join(ruiSrc, "utils/")) },
                { find: /^@ripple-design\/rui$/, replacement: toPosix(path.join(ruiSrc, "index.ts")) },
                {
                    find: /^@ripple-design\/rui\/foundations\/(.*)$/,
                    replacement: toPosix(path.join(ruiSrc, "foundations/$1")),
                },
                { find: /^@ripple-design\/rux-chat$/, replacement: toPosix(path.join(ruxChatSrc, "index.ts")) },
                {
                    find: /^@ripple-design\/rux-data-table$/,
                    replacement: toPosix(path.join(ruxDataTableSrc, "index.ts")),
                },
                {
                    find: /^@ripple-design\/rux-date-time-picker$/,
                    replacement: toPosix(path.join(ruxDateTimePickerSrc, "index.ts")),
                },
            ],
        },
        server: {
            fs: {
                allow: [repoRoot],
            },
        },
    },
})
