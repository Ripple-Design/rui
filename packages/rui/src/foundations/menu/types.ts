import type { InjectionKey, Ref } from "vue"

export type RMenuItemRecord = {
    disabled: boolean
    element: HTMLElement | null
    id: symbol
}

export type RMenuContext = {
    closeMenu: () => void
    disabled: Readonly<Ref<boolean>>
    focusedItemId: Readonly<Ref<symbol | null>>
    focusByDirection: (fromId: symbol, direction: "next" | "prev" | "first" | "last") => void
    onItemClick: (id: symbol) => void
    onItemFocus: (id: symbol) => void
    open: Readonly<Ref<boolean>>
    registerGroup: (id: symbol) => void
    registerItem: (record: RMenuItemRecord) => void
    unregisterGroup: (id: symbol) => void
    unregisterItem: (id: symbol) => void
}

export type RMenuGroupSelectionIndicator = "overlay" | "check"

export type RMenuGroupContext = {
    indicator: Readonly<Ref<RMenuGroupSelectionIndicator>>
    isSelected: (value: unknown) => boolean
    select: (value: unknown) => void
}

export const menuKey: InjectionKey<RMenuContext> = Symbol("menu")
export const menuGroupKey: InjectionKey<RMenuGroupContext> = Symbol("menu-group")
