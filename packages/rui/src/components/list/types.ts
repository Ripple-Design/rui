import type { Slot } from "vue"

import type { RIconResolvableSource } from "@/components/icon/types"
import type { RippleOptions } from "@/foundations/ripple"

export type RListDivider = "none" | "inset" | "full-bleed"
export type RListItemLines = 1 | 2 | 3

/** Props for the {@link RList} component. */
export type RListProps = {
    /** Draws separators between adjacent list rows. */
    divider?: RListDivider
}

/** Props for the {@link RListGroup} component. */
export type RListGroupProps = {
    /** Visible and accessible heading for the group. */
    label?: string
    /** Draws an Android-style separator after this group when another group follows. */
    divider?: boolean
}

/** Props for the {@link RListItem} component. */
export type RListItemProps = {
    /** Makes the row a native button when no href is supplied. */
    action?: boolean
    /** Disables an interactive row. */
    disabled?: boolean
    /** Renders a leading icon when the leading slot is not used. */
    icon?: RIconResolvableSource
    /** Renders the row as a native link. */
    href?: string
    /** Sets the standard Material one-, two-, or three-line row height. */
    lines?: RListItemLines
    /** Controls the shared ripple or disables it. */
    ripple?: boolean | RippleOptions
    /** Sets the native link target. */
    target?: string
    /** Sets the native link rel attribute. */
    rel?: string
}

export type RListItemSlots = {
    /** Primary row label. */
    default?: Slot
    /** Leading icon, avatar, or other visual content. */
    leading?: Slot
    /** Secondary text. */
    supporting?: Slot
    /** Tertiary text for a three-line row. */
    tertiary?: Slot
    /** Trailing presentational metadata or icon. */
    trailing?: Slot
}
