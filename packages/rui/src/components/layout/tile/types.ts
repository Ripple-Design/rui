import type { Slot } from "vue"

import type { RIconResolvableSource } from "@/components/base/icon/types.ts"
import type { RippleOptions } from "@/foundations/ripple"

export type RTileMode = "outside" | "scrim" | "gradient"
export type RTilePosition = "header" | "footer"

/** Props for the {@link RTile} component. */
export type RTileProps = {
    /** Makes the tile a native button when no href is supplied. */
    action?: boolean
    /** Renders a built-in trailing icon action. */
    actionIcon?: RIconResolvableSource
    /** Sets the accessible name for the built-in trailing action. */
    actionLabel?: string
    /** Disables an interactive tile. */
    disabled?: boolean
    /** Renders the tile as a native link. */
    href?: string
    /** Controls where the shared title and text region is placed. */
    position?: RTilePosition
    /** Controls the shared ripple or disables it. */
    ripple?: boolean | RippleOptions
    /** Chooses external, translucent-scrim, or gradient text treatment. */
    mode?: RTileMode
    /** Sets the native link target. */
    target?: string
    /** Sets the native link rel attribute. */
    rel?: string
}

export type RTileSlots = {
    /** Tile media, such as an image, picture, or video. */
    default?: Slot
    /** Primary tile text. */
    title?: Slot
    /** Secondary tile text. */
    text?: Slot
    /** Trailing action, typically an icon button. */
    action?: Slot
}
