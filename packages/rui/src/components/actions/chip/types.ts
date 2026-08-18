import type { RIconResolvableSource } from "@/components/base/icon/types.ts"
import type { RippleOptions } from "@/foundations/ripple"

export type RChipVariant = "plain" | "outlined"
export type RChipType = "action" | "filter" | "choice" | "input"
export type RChipGroupSelection = "single" | "multiple"
export type RChipGroupModelValue = unknown | unknown[] | null

/** Props for the {@link RChip} component. */
export type RChipProps = {
    /** Controls the visual chip treatment. */
    variant?: RChipVariant
    /** Identifies the chip inside a selectable `RChipGroup`. */
    value?: unknown
    /** Disables the primary and remove actions. */
    disabled?: boolean
    /** Controls the Material chip family and its interaction behavior. */
    type?: RChipType
    /** Renders a leading icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Renders a trailing icon using the shared icon renderer. */
    endIcon?: RIconResolvableSource
    /** Shows a separate trailing remove button. */
    removable?: boolean
    /** Overrides the default trailing remove icon. */
    removeIcon?: RIconResolvableSource
    /** Sets the accessible name announced for the remove button. */
    removeLabel?: string
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for the {@link RChipGroup} component. */
export type RChipGroupProps = {
    /** Controls the visual treatment for child chips. */
    variant?: RChipVariant
    /** Controls the chip family and interaction behavior for child chips. */
    type?: RChipType
    /** Enables single or multiple selection behavior for child chips. */
    selection?: RChipGroupSelection
    /** Binds this selection group to an RForm field path. */
    name?: string
    /** Prevents a selectable group from becoming empty. */
    required?: boolean
    /** Allows chips to wrap onto additional rows. */
    wrap?: boolean
    /** Controls the selected value or values when selection is enabled. */
    modelValue?: RChipGroupModelValue
}
