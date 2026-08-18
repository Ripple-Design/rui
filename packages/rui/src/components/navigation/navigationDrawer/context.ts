import type { ComputedRef, InjectionKey, Ref } from "vue"

import type { RSelectionModelContext } from "@/foundations/selection"

export type RNavigationDrawerContext = RSelectionModelContext & {
    hasHeader: Readonly<ComputedRef<boolean>>
    activate: (id: symbol) => void
}

export type RNavigationDrawerGroupContext = {
    hasIcon: Readonly<Ref<boolean>>
    registerIcon: (id: symbol, present: boolean) => void
    unregisterIcon: (id: symbol) => void
}

export const navigationDrawerKey: InjectionKey<RNavigationDrawerContext> = Symbol("navigationDrawer")
export const navigationDrawerGroupKey: InjectionKey<RNavigationDrawerGroupContext> = Symbol("navigationDrawerGroup")
