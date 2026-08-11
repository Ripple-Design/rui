import type { RAppBarContainerProps } from "../appBar/types"

import type { RScaffoldFabPlacement, RScaffoldScrollDirection } from "./context"

export type RScaffoldLayoutProps = {
    scrollDirection?: RScaffoldScrollDirection
    fabPlacement?: RScaffoldFabPlacement
    /** Reserves the server-rendered app-bar height until a registered app bar reports its measured inset. */
    initialTopInset?: string
    /** Hides the bottom-bar slot while vertically scrolling down and restores it while scrolling up. */
    bottomBarHideOnScroll?: boolean
}

export type RScaffoldProps = RScaffoldLayoutProps & {
    /** Wraps app-bar slot content in an RAppBarContainer. */
    appBar?: RAppBarContainerProps
}
