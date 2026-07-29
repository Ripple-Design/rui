import type { InjectionKey, Ref } from "vue"

import type { RIconResolvableSource } from "@/components/icon/types"

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
    registerItem: (record: RMenuItemRecord) => void
    unregisterItem: (id: symbol) => void
}

export type RMenuProps = {
    disabled?: boolean
    open?: boolean
}

export type RMenuItemProps = {
    disabled?: boolean
    icon?: RIconResolvableSource
}

export const menuKey: InjectionKey<RMenuContext> = Symbol("menu")
