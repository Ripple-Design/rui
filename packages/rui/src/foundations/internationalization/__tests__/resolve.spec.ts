import { describe, expect, it } from "vitest"

import {
    normalizeInternationalizationMessageCatalog,
    normalizeInternationalizationLocale,
    resolveInternationalizationLocaleCandidates,
    resolveInternationalizationMessage,
} from "../resolve"

describe("internationalization resolution", () => {
    it("canonicalizes locale tags", () => {
        expect(normalizeInternationalizationLocale("EN-us")).toBe("en-US")
        expect(normalizeInternationalizationLocale("not_a_locale")).toBeNull()
    })

    it("resolves locale candidates from most to least specific", () => {
        expect(resolveInternationalizationLocaleCandidates("zh-Hant-TW")).toEqual(["zh-Hant-TW", "zh-Hant", "zh"])
        expect(resolveInternationalizationLocaleCandidates("sl-rozaj-biske")).toEqual(["sl-biske-rozaj", "sl-biske", "sl"])
        expect(resolveInternationalizationLocaleCandidates("en-US-u-nu-latn")).toEqual(["en-US", "en"])
    })

    it("normalizes catalog locale keys", () => {
        expect(normalizeInternationalizationMessageCatalog({
            "EN-us": { marker: "exact" },
            invalid_locale: { ignored: "value" },
        })).toEqual({
            "en-US": { marker: "exact" },
        })
    })

    it("uses an exact locale message before less-specific catalogs", () => {
        expect(resolveInternationalizationMessage(
            "zh-Hant-TW",
            "marker",
            {
                "zh-Hant-TW": { marker: "exact" },
                "zh-Hant": { marker: "script" },
                zh: { marker: "language" },
            },
            {},
        )).toBe("exact")
    })

    it("falls back through less-specific locale catalogs for each key", () => {
        expect(resolveInternationalizationMessage(
            "zh-Hant-TW",
            "marker",
            {
                "zh-Hant-TW": { alternate: "exact" },
                "zh-Hant": { marker: "script" },
                zh: { marker: "language" },
            },
            {},
        )).toBe("script")
    })

    it("uses base messages and then the key", () => {
        expect(resolveInternationalizationMessage("fr-CA", "marker", {}, { marker: "base" })).toBe("base")
        expect(resolveInternationalizationMessage("fr-CA", "missing", {}, {})).toBe("missing")
    })

    it("safely skips invalid locales", () => {
        expect(resolveInternationalizationMessage("invalid_locale", "marker", { en: { marker: "catalog" } }, { marker: "base" })).toBe("base")
    })
})
