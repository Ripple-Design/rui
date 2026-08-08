import type { InjectionKey, Ref } from "vue"

export type RAppBarPhase = "expanded" | "collapsing" | "collapsed" | "hidden"

export type RAppBarScrollState = {
    collapseOffset: number
    collapseDistance: number
    collapseProgress: number
    visibleHeight: number
    hideOffset: number
    lifted: boolean
    phase: RAppBarPhase
}

export type RAppBarContext = {
    scrollState: Readonly<Ref<RAppBarScrollState>>
}

export const appBarContextKey: InjectionKey<RAppBarContext> = Symbol("rui-app-bar")
