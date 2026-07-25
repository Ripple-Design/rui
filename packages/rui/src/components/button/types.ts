import type { RippleOptions } from "@/foundations/ripple"

import type { RIconSource } from "@/components/icon/types"

export type RButtonVariant = "text" | "outlined" | "contained" | "unelevated"
export type RButtonGroupVariant = RButtonVariant | "icon"
export type RButtonType = "button" | "submit" | "reset"
export type RButtonGroupSelection = "single" | "multiple"
export type RButtonGroupModelValue = unknown | unknown[] | null

/** Props for the {@link RButton} component. */
export type RButtonProps = {
    /** Controls the button’s visual treatment. */
    variant?: RButtonVariant
    /** Disables the button and all interactive feedback. */
    disabled?: boolean
    /** Expands the button to fill the available inline size. */
    fullWidth?: boolean
    /** Allows the label to remain in sentence case instead of uppercase. */
    sentenceCase?: boolean
    /** Sets the native button type when rendering a `<button>`. */
    type?: RButtonType
    /** Renders the button as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Identifies the button inside a selectable `RButtonGroup`. */
    value?: unknown
    /** Renders a leading icon using the shared icon renderer. */
    icon?: RIconSource
    /** Renders a trailing icon using the shared icon renderer. */
    endIcon?: RIconSource
    /** Renders a top icon using the shared icon renderer. */
    topIcon?: RIconSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for the {@link RButtonGroup} component. */
export type RButtonGroupProps = {
    /** Applies a shared button variant to grouped `RButton` children that do not set their own variant. */
    variant?: RButtonGroupVariant
    /** Enables single or multiple selection behavior for grouped buttons. */
    selection?: RButtonGroupSelection
    /** Prevents the selection from becoming empty while selection mode is enabled. */
    required?: boolean
    /** Controls the selected value or values when selection mode is enabled. */
    modelValue?: RButtonGroupModelValue
}
