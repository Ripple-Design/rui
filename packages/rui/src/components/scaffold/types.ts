import type { RScaffoldFabPlacement, RScaffoldScrollDirection } from "./context"

export type RScaffoldProps = {
    scrollDirection?: RScaffoldScrollDirection
    fabPlacement?: RScaffoldFabPlacement
    /** Hides the bottom-bar slot while vertically scrolling down and restores it while scrolling up. */
    bottomBarHideOnScroll?: boolean
}
