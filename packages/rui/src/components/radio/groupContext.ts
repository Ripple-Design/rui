import type { InjectionKey, Ref } from "vue"

import type { RRadioButtonGroupOrientation } from "./types"

export type RRadioButtonGroupItemState = {
    disabled: boolean
    element: HTMLInputElement | null
    hasValue: boolean
    value: unknown
}

export type RRadioButtonGroupContext = {
    name: Readonly<Ref<string>>
    orientation: Readonly<Ref<RRadioButtonGroupOrientation>>
    required: Readonly<Ref<boolean>>
    registerItem: (id: symbol, state: RRadioButtonGroupItemState) => void
    unregisterItem: (id: symbol) => void
    isSelected: (value: unknown) => boolean
    getTabIndex: (id: symbol) => number
    activate: (id: symbol) => void
    focusByKey: (id: symbol, key: string, isRtl: boolean) => void
}

export const radioButtonGroupKey: InjectionKey<RRadioButtonGroupContext> = Symbol("radioButtonGroup")
