import type { RInternationalizationMessageCatalog, RInternationalizationMessages } from "./types"

export function normalizeInternationalizationLocale(locale: string) {
    try {
        return Intl.getCanonicalLocales(locale)[0] ?? null
    } catch {
        return null
    }
}

export function resolveInternationalizationLocaleCandidates(locale: string) {
    const normalizedLocale = normalizeInternationalizationLocale(locale)
    if (!normalizedLocale) {
        return []
    }

    const baseName = new Intl.Locale(normalizedLocale).baseName
    const subtags = baseName.split("-")
    const candidates: string[] = []

    for (let length = subtags.length; length > 0; length -= 1) {
        candidates.push(subtags.slice(0, length).join("-"))
    }

    return candidates
}

export function normalizeInternationalizationMessageCatalog(messageCatalog: RInternationalizationMessageCatalog) {
    const normalizedMessageCatalog: Record<string, RInternationalizationMessages> = {}

    for (const [locale, messages] of Object.entries(messageCatalog)) {
        const normalizedLocale = normalizeInternationalizationLocale(locale)
        if (normalizedLocale) {
            normalizedMessageCatalog[normalizedLocale] = messages
        }
    }

    return normalizedMessageCatalog
}

export function resolveInternationalizationMessage(
    locale: string,
    key: string,
    messageCatalog: RInternationalizationMessageCatalog,
    baseMessages: RInternationalizationMessages,
) {
    for (const candidate of resolveInternationalizationLocaleCandidates(locale)) {
        const message = messageCatalog[candidate]?.[key]
        if (message !== undefined) {
            return message
        }
    }

    return baseMessages[key] ?? key
}
