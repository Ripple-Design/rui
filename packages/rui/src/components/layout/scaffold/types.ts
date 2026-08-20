import type { RResponsiveContainerMode } from "@/components/layout/responsive/types.ts"
import type { RAppBarContainerProps } from "@/components/navigation/appBar/types.ts"

import type { RScaffoldFabPlacement, RScaffoldScrollDirection } from "./context.ts"

export type RScaffoldLayoutProps = {
    /** Sets the responsive body and body-aligned app-bar layout mode. */
    gridMode?: RResponsiveContainerMode
    /** Sets the scroll axis used by scaffold scroll behavior. */
    scrollDirection?: RScaffoldScrollDirection
    /** Sets where the floating action button is placed within the scaffold. */
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
