import type { InjectionKey, Ref } from "vue"

import type { RChipGroupSelection } from "./types"

export type RChipGroupItemState = {
    disabled: boolean
    element: HTMLElement | null
    hasValue: boolean
    value: unknown
}

export type RChipGroupContext = {
    selection: Readonly<Ref<RChipGroupSelection | undefined>>
    required: Readonly<Ref<boolean>>
    registerItem: (id: symbol, state: RChipGroupItemState) => void
    unregisterItem: (id: symbol) => void
    isSelected: (value: unknown) => boolean
    activate: (id: symbol) => void
}

export const chipGroupKey: InjectionKey<RChipGroupContext> = Symbol("chipGroup")
