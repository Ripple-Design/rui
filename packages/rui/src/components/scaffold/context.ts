import type { InjectionKey, Ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"

export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"
export type RScaffoldFabPlacement = "viewport" | "body" | "app-bar-seam"
export type RScaffoldScrollMotionDirection = "up" | "down" | "idle"
export type RScaffoldAppBarState = "expanded" | "collapsed" | "hidden"
export type RScaffoldBottomBarState = "shown" | "hidden"

export type RScaffoldScrollState = {
    top: number
    direction: RScaffoldScrollMotionDirection
}

export type RScaffoldContext = {
    scrollDirection: Readonly<Ref<RScaffoldScrollDirection>>
    scrollState: Readonly<Ref<RScaffoldScrollState>>
    appBarState: Readonly<Ref<RScaffoldAppBarState>>
    bodyGridMode: Readonly<Ref<RResponsiveContainerMode | null>>
    fabPlacement: Readonly<Ref<RScaffoldFabPlacement>>
    appBarExpandedHeight: Readonly<Ref<string>>
    appBarOffset: Readonly<Ref<string>>
    appBarHideOnScroll: Readonly<Ref<boolean>>
    appBarCollapsing: Readonly<Ref<boolean>>
    bottomBarState: Readonly<Ref<RScaffoldBottomBarState>>
    bottomBarHeight: Readonly<Ref<number>>
    setBodyGridMode: (mode: RResponsiveContainerMode) => void
    setAppBarExpandedHeight: (height: string) => void
    setAppBarCollapsedHeight: (height: string) => void
    setAppBarHideOnScroll: (enabled: boolean) => void
    setAppBarCollapsing: (enabled: boolean) => void
    setBottomBarHideOnScroll: (enabled: boolean) => void
    setBottomBarHeight: (height: number) => void
}

export const scaffoldContextKey: InjectionKey<RScaffoldContext> = Symbol("rui-scaffold")
