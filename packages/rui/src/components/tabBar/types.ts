import type { RippleOptions } from "@/foundations/ripple"

import type { RIconResolvableSource } from "@/components/icon/types"

export type RTabBarVariant = "primary" | "secondary"

/** Props for the {@link RTabBar} component. */
export type RTabBarProps = {
    /** Applies the primary or secondary tab bar treatment. */
    variant?: RTabBarVariant
    /** Expands the tab bar to fill the available inline size and evenly distribute child tabs. */
    fullWidth?: boolean
    /** Controls the selected tab value. */
    modelValue?: unknown
}

/** Props for the {@link RTab} component. */
export type RTabProps = {
    /** Identifies the tab inside the parent `RTabBar`. */
    value: unknown
    /** Disables the tab and prevents it from becoming selected. */
    disabled?: boolean
    /** Renders a leading or stacked icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Stacks the icon above the label instead of placing it inline. */
    stacked?: boolean
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
