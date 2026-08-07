import type { InjectionKey, Ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsiveContainer/types"

export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"
export type RScaffoldFabPlacement = "viewport" | "body" | "app-bar-seam"
export type RScaffoldScrollMotionDirection = "up" | "down" | "idle"
export type RScaffoldAppBarState = "expanded" | "collapsed"

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
    setBodyGridMode: (mode: RResponsiveContainerMode) => void
    setAppBarExpandedHeight: (height: string) => void
}

export const scaffoldContextKey: InjectionKey<RScaffoldContext> = Symbol("rui-scaffold")
