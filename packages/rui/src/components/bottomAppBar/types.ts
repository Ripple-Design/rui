import type { RSurfaceColor } from "@/components/surface/types"

export type RBottomAppBarFabAlignmentMode = "center" | "end"
export type RBottomAppBarFabAnimationMode = "scale" | "slide"

/** Props for the {@link RBottomAppBar} component. */
export type RBottomAppBarProps = {
    /** Controls whether the docked FAB is centered or aligned to the logical end. */
    fabAlignmentMode?: RBottomAppBarFabAlignmentMode
    /** Chooses scale or horizontal-slide motion when the FAB alignment changes. */
    fabAnimationMode?: RBottomAppBarFabAnimationMode
    /** Controls whether the docked FAB is cradled by the Bottom App Bar. */
    fabAttached?: boolean
    /** Sets the space between the standard FAB and its cradle. */
    fabCradleMargin?: string
    /** Sets the radius of the rounded cradle shoulders. */
    fabCradleRoundedCornerRadius?: string
    /** Sets the distance between the FAB center and the bar top edge. */
    fabCradleVerticalOffset?: string
    /** Hides the parent Scaffold bottom bar while scrolling down. */
    hideOnScroll?: boolean
    /** Controls the Bottom App Bar surface color. */
    color?: RSurfaceColor
    /** Labels the toolbar when no visible label is available. */
    ariaLabel?: string
    /** References an element that labels the toolbar. */
    ariaLabelledby?: string
}
