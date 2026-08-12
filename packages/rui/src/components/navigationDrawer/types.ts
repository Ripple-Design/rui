import type { RIconResolvableSource } from "@/components/icon/types"
import type { RModalProps } from "@/components/modal/types"
import type { RippleOptions } from "@/foundations/ripple"

export type RNavigationDrawerSide = "start" | "end"

/** Props for the persistent Material 2 navigation drawer. */
export type RNavigationDrawerProps = {
    /** Controls the selected destination value. */
    modelValue?: unknown
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Attaches the drawer to the inline start or end edge. */
    side?: RNavigationDrawerSide
    /** Controls the drawer width using any valid CSS inline-size value. */
    width?: string
}

/** Props for the modal Material 2 navigation drawer. */
export type RModalNavigationDrawerProps = RModalProps & {
    /** Controls whether the modal drawer is open. */
    modelValue?: boolean
    /** Controls the selected destination value. */
    selected?: unknown
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Attaches the drawer to the inline start or end edge. */
    side?: RNavigationDrawerSide
    /** Controls the drawer width using any valid CSS inline-size value. */
    width?: string
    /** Closes the modal drawer after a destination is selected. */
    closeOnSelect?: boolean
    /** Controls the width of the edge region that starts a drag gesture. */
    edgeSize?: number
}

/** Props for a destination inside an RNavigationDrawer. */
export type RNavigationDrawerItemProps = {
    /** Identifies the destination inside the parent RNavigationDrawer. */
    value: unknown
    /** Renders the destination as an anchor when provided. */
    href?: string
    /** Renders the leading icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Uses this icon when the item is selected. */
    selectedIcon?: RIconResolvableSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for a titled drawer destination group. */
export type RNavigationDrawerGroupProps = {
    /** Renders a Material 2 subheader before the group destinations. */
    title?: string
}
