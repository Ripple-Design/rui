import type { RippleOptions } from "@/foundations/ripple"
import type { RIconResolvableSource } from "@/components/icon/types"

export type RNavigationRailLabelVisibility = "always" | "selected"

export type RNavigationRailProps = {
    /** Controls the selected destination value. */
    modelValue?: unknown
    /** Controls when destination labels are shown. */
    labelVisibility?: RNavigationRailLabelVisibility
}

export type RNavigationRailItemProps = {
    /** Identifies the destination inside the parent `RNavigationRail`. */
    value: unknown
    /** Renders the leading icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
