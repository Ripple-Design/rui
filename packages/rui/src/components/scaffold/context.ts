import type { InjectionKey, Ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"
import type { RAppBarRegistration, RAppBarScrollBehavior } from "@/components/appBar/types"

export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"
export type RScaffoldFabPlacement = "viewport" | "body" | "app-bar-seam"
export type RScaffoldScrollMotionDirection = "up" | "down" | "idle"
export type RScaffoldAppBarPhase = "expanded" | "collapsing" | "collapsed" | "hidden"
export type RScaffoldAppBarState = RScaffoldAppBarPhase
export type RScaffoldBottomBarState = "shown" | "hidden"

export type RScaffoldScrollState = {
    top: number
    direction: RScaffoldScrollMotionDirection
}

export type RScaffoldAppBarScrollState = {
    collapseOffset: number
    collapseDistance: number
    collapseProgress: number
    visibleHeight: number
    hideOffset: number
    lifted: boolean
    phase: RScaffoldAppBarPhase
}

export type RScaffoldContext = {
    scrollDirection: Readonly<Ref<RScaffoldScrollDirection>>
    scrollState: Readonly<Ref<RScaffoldScrollState>>
    appBarState: Readonly<Ref<RScaffoldAppBarState>>
    appBarScrollState: Readonly<Ref<RScaffoldAppBarScrollState>>
    bodyGridMode: Readonly<Ref<RResponsiveContainerMode | null>>
    fabPlacement: Readonly<Ref<RScaffoldFabPlacement>>
    appBarExpandedHeight: Readonly<Ref<string | undefined>>
    appBarCollapsedHeight: Readonly<Ref<string | undefined>>
    appBarOffset: Readonly<Ref<string>>
    appBarHideOnScroll: Readonly<Ref<boolean>>
    appBarCollapsing: Readonly<Ref<boolean>>
    bottomBarState: Readonly<Ref<RScaffoldBottomBarState>>
    bottomBarHeight: Readonly<Ref<number>>
    registerAppBar: (registration: RAppBarRegistration) => void
    unregisterAppBar: (element: HTMLElement) => void
    setBodyGridMode: (mode: RResponsiveContainerMode) => void
    setAppBarExpandedHeight: (height: string | undefined) => void
    setAppBarCollapsedHeight: (height: string | undefined) => void
    setAppBarHideOnScroll: (enabled: boolean) => void
    setAppBarCollapsing: (enabled: boolean) => void
    setBottomBarHideOnScroll: (enabled: boolean) => void
    setBottomBarHeight: (height: number) => void
}

export const scaffoldContextKey: InjectionKey<RScaffoldContext> = Symbol("rui-scaffold")
