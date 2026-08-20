import type { InjectionKey, Ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/layout/responsive/types.ts"

export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"
export type RScaffoldFabPlacement = "viewport" | "body" | "app-bar-seam"
export type RScaffoldScrollMotionDirection = "up" | "down" | "idle"
export type RScaffoldBottomBarState = "shown" | "hidden"
export type RScaffoldFabAlignment = "center" | "end"
export type RScaffoldFabAnimationMode = "scale" | "slide"

export type RScaffoldBottomAppBarFabState = {
    element: HTMLElement | null
    inlineSize: number
    blockSize: number
    visible: boolean
}

export type RScaffoldBottomAppBarRegistration = {
    fabAlignmentMode: Readonly<Ref<RScaffoldFabAlignment>>
    fabAnimationMode: Readonly<Ref<RScaffoldFabAnimationMode>>
    fabAttached: Readonly<Ref<boolean>>
    fabCradleVerticalOffset: Readonly<Ref<number>>
    hideOnScroll: Readonly<Ref<boolean>>
    onFabStateChange: (state: RScaffoldBottomAppBarFabState) => void
}

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
    bodyGridMode: Readonly<Ref<RResponsiveContainerMode>>
    fabPlacement: Readonly<Ref<RScaffoldFabPlacement>>
    topInset: Readonly<Ref<number>>
    bottomBarState: Readonly<Ref<RScaffoldBottomBarState>>
    bottomBarHeight: Readonly<Ref<number>>
    registerTopInset: () => RScaffoldTopInsetHandle
    setBottomBarHideOnScroll: (enabled: boolean) => void
    setBottomBarHeight: (height: number) => void
    registerBottomAppBar: (registration: RScaffoldBottomAppBarRegistration) => () => void
}

export const scaffoldContextKey: InjectionKey<RScaffoldContext> = Symbol("rui-scaffold")
