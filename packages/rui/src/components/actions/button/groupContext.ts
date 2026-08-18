import type { InjectionKey, Ref } from "vue"

import type { RButtonGroupSelection, RButtonVariant } from "./types.ts"

export type RButtonGroupItemState = {
    disabled: boolean
    element: HTMLElement | null
    hasValue: boolean
    href: string | undefined
    value: unknown
}

export type RButtonGroupContext = {
    variant: Readonly<Ref<RButtonVariant | undefined>>
    icon: Readonly<Ref<boolean>>
    fullWidth: Readonly<Ref<boolean>>
    disabled: Readonly<Ref<boolean>>
    selection: Readonly<Ref<RButtonGroupSelection | undefined>>
    required: Readonly<Ref<boolean>>
    registerItem: (id: symbol, state: RButtonGroupItemState) => void
    unregisterItem: (id: symbol) => void
    isSelected: (value: unknown) => boolean
    getTabIndex: (id: symbol) => number | undefined
    activate: (id: symbol) => void
}

export const buttonGroupKey: InjectionKey<RButtonGroupContext> = Symbol("buttonGroup")
export const buttonRowVariantKey: InjectionKey<Readonly<Ref<RButtonVariant>>> = Symbol("buttonRowVariant")
