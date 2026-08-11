import type { InjectionKey, Ref } from "vue"

import type { RFormController, RFormRequiredIndicator } from "./types"

export type RFormContext = {
    form: Readonly<Ref<RFormController<any>>>
    requiredIndicator: Readonly<Ref<RFormRequiredIndicator | undefined>>
    submit: () => Promise<boolean>
}

export const formContextKey: InjectionKey<RFormContext> = Symbol("rForm")
