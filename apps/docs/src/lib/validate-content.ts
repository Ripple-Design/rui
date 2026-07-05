import type { CollectionEntry } from "astro:content"
import { locales } from "./docs"

const BASE_LOCALE = locales[0]
const REQUIRED_TABS = new Set(["spec", "guidelines", "implementation"])

function diffSets(base: Set<string>, target: Set<string>) {
    return {
        missing: [...base].filter((key) => !target.has(key)),
        extra: [...target].filter((key) => !base.has(key)),
    }
}

function ensureNoDuplicateKeys<T>(entries: T[], keyFor: (entry: T) => string, label: string) {
    const seen = new Set<string>()

    for (const entry of entries) {
        const key = keyFor(entry)
        if (seen.has(key)) {
            throw new Error(`${label} contains a duplicate key: ${key}`)
        }
        seen.add(key)
    }
}

export function validateDocsLocales(entries: CollectionEntry<"docs">[]) {
    ensureNoDuplicateKeys(
        entries,
        (entry) => `${entry.data.locale}::${entry.data.docSlug}::${entry.data.tab}`,
        "docs",
    )

    const byLocale = new Map<string, Set<string>>()
    const tabsByDoc = new Map<string, Set<string>>()

    for (const entry of entries) {
        const pageKey = `${entry.data.docSlug}::${entry.data.tab}`
        const localeBucket = byLocale.get(entry.data.locale) ?? new Set<string>()
        localeBucket.add(pageKey)
        byLocale.set(entry.data.locale, localeBucket)

        const docKey = `${entry.data.locale}::${entry.data.docSlug}`
        const tabs = tabsByDoc.get(docKey) ?? new Set<string>()
        tabs.add(entry.data.tab)
        tabsByDoc.set(docKey, tabs)
    }

    const base = byLocale.get(BASE_LOCALE)
    if (!base) {
        throw new Error(`Base locale "${BASE_LOCALE}" has no docs content`)
    }

    for (const locale of locales) {
        const keys = byLocale.get(locale)
        if (!keys) {
            throw new Error(`Docs locale missing entirely: ${locale}`)
        }

        if (locale !== BASE_LOCALE) {
            const { missing, extra } = diffSets(base, keys)
            if (missing.length || extra.length) {
                throw new Error(
                    [
                        `Docs locale mismatch: ${locale}`,
                        missing.length ? `Missing: ${missing.join(", ")}` : "",
                        extra.length ? `Extra: ${extra.join(", ")}` : "",
                    ]
                        .filter(Boolean)
                        .join("\n"),
                )
            }
        }
    }

    for (const [docKey, tabs] of tabsByDoc.entries()) {
        const missingTabs = [...REQUIRED_TABS].filter((tab) => !tabs.has(tab))
        if (missingTabs.length) {
            throw new Error(`Docs page is missing required tabs for ${docKey}: ${missingTabs.join(", ")}`)
        }
    }
}

export function validateApiLocales(entries: CollectionEntry<"api">[]) {
    ensureNoDuplicateKeys(entries, (entry) => `${entry.data.locale}::${entry.data.routeSlug}`, "api")

    const byLocale = new Map<string, Set<string>>()

    for (const entry of entries) {
        const localeBucket = byLocale.get(entry.data.locale) ?? new Set<string>()
        localeBucket.add(entry.data.routeSlug)
        byLocale.set(entry.data.locale, localeBucket)
    }

    const base = byLocale.get(BASE_LOCALE)
    if (!base) {
        throw new Error(`Base locale "${BASE_LOCALE}" has no api content`)
    }

    for (const locale of locales) {
        const keys = byLocale.get(locale)
        if (!keys) {
            throw new Error(`API locale missing entirely: ${locale}`)
        }

        if (locale !== BASE_LOCALE) {
            const { missing, extra } = diffSets(base, keys)
            if (missing.length || extra.length) {
                throw new Error(
                    [
                        `API locale mismatch: ${locale}`,
                        missing.length ? `Missing: ${missing.join(", ")}` : "",
                        extra.length ? `Extra: ${extra.join(", ")}` : "",
                    ]
                        .filter(Boolean)
                        .join("\n"),
                )
            }
        }
    }
}

export function validateCrossLinks(docs: CollectionEntry<"docs">[], api: CollectionEntry<"api">[]) {
    const validApiPaths = new Set(api.map((entry) => `/${entry.data.locale}/api/${entry.data.routeSlug}`))
    const validDocPaths = new Set(docs.map((entry) => `/${entry.data.locale}/${entry.data.docSlug}/${entry.data.tab}`))

    for (const entry of docs) {
        if (!validApiPaths.has(entry.data.api)) {
            throw new Error(`Docs entry ${entry.data.locale}::${entry.data.docSlug}::${entry.data.tab} points to missing API page: ${entry.data.api}`)
        }
    }

    for (const entry of api) {
        if (!validDocPaths.has(entry.data.docs)) {
            throw new Error(`API entry ${entry.data.locale}::${entry.data.routeSlug} points to missing docs page: ${entry.data.docs}`)
        }
    }
}
