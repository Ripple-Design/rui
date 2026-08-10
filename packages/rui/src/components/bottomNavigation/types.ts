import type { RippleOptions } from "@/foundations/ripple"
import type { RIconResolvableSource } from "@/components/icon/types"

export type RBottomNavigationLabelVisibility = "auto" | "selected" | "labeled" | "unlabeled"

export type RBottomNavigationColor = "primary" | "surface"

export type RBottomNavigationProps = {
    /** Controls the selected destination value. */
    modelValue?: unknown
    /** Controls the bottom navigation surface color. */
    color?: RBottomNavigationColor
    /** Controls which destination labels are visible. */
    labelVisibility?: RBottomNavigationLabelVisibility
    /** Enables M2 shifting item widths when labels are selected-only. */
    horizontalTranslation?: boolean
}

export type RBottomNavigationItemProps = {
    /** Identifies the destination inside the parent `RBottomNavigation`. */
    value: unknown
    /** Renders the destination icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Uses this icon when the destination is selected. */
    selectedIcon?: RIconResolvableSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
