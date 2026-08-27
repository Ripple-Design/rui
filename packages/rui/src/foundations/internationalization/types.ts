import type { Ref } from "vue"

export type RInternationalizationMessages = Readonly<Record<string, string>>

export type RInternationalizationMessageCatalog = Readonly<Record<string, RInternationalizationMessages>>

export type RInternationalizationPluginOptions = {
    locale?: string
    messages?: RInternationalizationMessageCatalog
    baseMessages?: RInternationalizationMessages
}

export type RInternationalizationController = {
    locale: Ref<string>
    setLocale: (locale: string) => void
    resolveMessage: (key: string) => string
}
