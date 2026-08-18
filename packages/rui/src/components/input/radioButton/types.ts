import type { RippleOptions } from "@/foundations/ripple"

/** Props for the {@link RRadioButton} component. */
export type RRadioButtonProps = {
    /** Identifies this radio option within an `RRadioButtonGroup`. */
    value?: unknown
    /** Sets the native radio name when the radio is not inside a group. */
    name?: string
    /** Disables the radio and its interactive feedback. */
    disabled?: boolean
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

export type RRadioButtonGroupOrientation = "vertical" | "horizontal"
export type RRadioButtonGroupModelValue = unknown | null

/** Props for the {@link RRadioButtonGroup} component. */
export type RRadioButtonGroupProps = {
    /** Sets the shared native name used for form submission. */
    name?: string
    /** Prevents the group from having no selected enabled option. */
    required?: boolean
    /** Controls the visual layout and directional-key axis. */
    orientation?: RRadioButtonGroupOrientation
    /** Sets the gap between radio options. */
    gap?: string
    /** Controls the selected child value. */
    modelValue?: RRadioButtonGroupModelValue
}
