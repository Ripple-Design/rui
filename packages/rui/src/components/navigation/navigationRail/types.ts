import type { RIconResolvableSource } from "@/components/base/icon/types.ts"
import type { RippleOptions } from "@/foundations/ripple"

export type RNavigationRailLabelVisibility = "always" | "selected"

export type RNavigationRailProps = {
    /** Controls the selected destination value. */
    modelValue?: unknown
    /** Controls whether the rail uses compact 56px cells. */
    compact?: boolean
    /** Controls when destination labels are shown. */
    labelVisibility?: RNavigationRailLabelVisibility
}

export type RNavigationRailItemProps = {
    /** Identifies the destination inside the parent `RNavigationRail`. */
    value: unknown
    /** Renders the leading icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Uses this icon when the item is selected. */
    selectedIcon?: RIconResolvableSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
