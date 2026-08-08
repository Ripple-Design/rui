import type { InjectionKey, Ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"

export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"
export type RScaffoldFabPlacement = "viewport" | "body" | "app-bar-seam"
export type RScaffoldScrollMotionDirection = "up" | "down" | "idle"
export type RScaffoldBottomBarState = "shown" | "hidden"

export type RScaffoldScrollFacts = {
    top: number
    maxTop: number
    delta: number
    direction: RScaffoldScrollMotionDirection
    atStart: boolean
    atEnd: boolean
    timestamp: number
}

export type RScaffoldTopInsetHandle = {
    set: (value: number) => void
    dispose: () => void
}

export type RScaffoldContext = {
    scrollDirection: Readonly<Ref<RScaffoldScrollDirection>>
    scrollFacts: Readonly<Ref<RScaffoldScrollFacts>>
    bodyGridMode: Readonly<Ref<RResponsiveContainerMode | null>>
    fabPlacement: Readonly<Ref<RScaffoldFabPlacement>>
    topInset: Readonly<Ref<number>>
    bottomBarState: Readonly<Ref<RScaffoldBottomBarState>>
    bottomBarHeight: Readonly<Ref<number>>
    registerTopInset: () => RScaffoldTopInsetHandle
    setBodyGridMode: (mode: RResponsiveContainerMode) => void
    setBottomBarHideOnScroll: (enabled: boolean) => void
    setBottomBarHeight: (height: number) => void
}

export const scaffoldContextKey: InjectionKey<RScaffoldContext> = Symbol("rui-scaffold")
