import type { RippleOptions } from "@/foundations/ripple"

import type { RIconResolvableSource } from "@/components/icon/types"

export type RTabBarVariant = "primary" | "secondary"
export type RTabIconLayout = "horizontal" | "vertical"
export type RTabBarColor = "primary" | "secondary" | "on-primary" | "on-secondary"

/** Props for the {@link RTabBar} component. */
export type RTabBarProps = {
    /** Applies the primary or secondary tab bar treatment. */
    variant?: RTabBarVariant
    /** Expands the tab bar to fill the available inline size and evenly distribute child tabs. */
    fullWidth?: boolean
    /** Controls the default icon and label layout inherited by child `RTab` items. */
    iconLayout?: RTabIconLayout
    /** Controls the semantic tab-bar color treatment. */
    color?: RTabBarColor
    /** Controls whether the bottom divider is rendered. */
    divider?: boolean
    /** Controls the selected tab value. */
    modelValue?: unknown
}

/** Props for the {@link RTab} component. */
export type RTabProps = {
    /** Identifies the tab inside the parent `RTabBar`. */
    value: unknown
    /** Renders the tab as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Renders an icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Controls whether the icon and label are laid out vertically or horizontally. */
    iconLayout?: RTabIconLayout
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
