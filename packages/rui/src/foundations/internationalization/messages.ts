import { resolveInternationalizationLocaleCandidates } from "./resolve"

import type { RInternationalizationMessageCatalog, RInternationalizationMessages } from "./types"

const baseMessages: RInternationalizationMessages = {
    "form.optional": " (Optional)",
    "form.required": " Required",
}
const messageCatalog: RInternationalizationMessageCatalog = {
    "zh-CN": {
        "form.optional": "（选填）",
        "form.required": "必填",
    },
}

export function resolveBuiltInInternationalizationMessage(locale: string, key: string) {
    for (const candidate of resolveInternationalizationLocaleCandidates(locale)) {
        const message = messageCatalog[candidate]?.[key]
        if (message !== undefined) {
            return message
        }
    }

    return baseMessages[key]
}
