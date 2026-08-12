import type { InjectionKey } from "vue"

import { inject, provide, ref } from "vue"

import { normalizeInternationalizationMessageCatalog, resolveInternationalizationMessage } from "./resolve"

import type {
    RInternationalizationController,
    RInternationalizationMessageCatalog,
    RInternationalizationMessages,
} from "./types"

export const internationalizationKey: InjectionKey<RInternationalizationController> = Symbol("ruiInternationalization")

export function createInternationalizationController(
    messageCatalog: RInternationalizationMessageCatalog,
    baseMessages: RInternationalizationMessages,
    initialLocale: string,
): RInternationalizationController {
    const normalizedMessageCatalog = normalizeInternationalizationMessageCatalog(messageCatalog)
    const locale = ref(initialLocale)

    return {
        locale,
        setLocale(nextLocale) {
            locale.value = nextLocale
        },
        resolveMessage(key) {
            return resolveInternationalizationMessage(locale.value, key, normalizedMessageCatalog, baseMessages)
        },
    }
}

export function useInternationalization() {
    const controller = inject(internationalizationKey)
    if (!controller) throw new Error("[RUI] useInternationalization must be used after providing an internationalization controller")
    return controller
}

export function provideInternationalization(controller: RInternationalizationController) {
    provide(internationalizationKey, controller)
    return controller
}
