import type { RippleOptions } from "@/foundations/ripple"

/** Props for the {@link RCheckbox} component. */
export type RCheckboxProps = {
    /** Disables the checkbox and its interactive feedback. */
    disabled?: boolean
    /** Shows the mixed/indeterminate checkbox state. */
    indeterminate?: boolean
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
