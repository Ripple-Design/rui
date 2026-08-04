import type { RIconResolvableSource } from "@/components/icon/types"

/** Props for the {@link RTextField} component. */
export type RTextFieldProps = {
    /** Sets the visible field label. */
    label?: string
    /** Renders a multiline textarea instead of a single-line input. */
    textArea?: boolean
    /** Sets the placeholder text shown when the field is empty. */
    placeholder?: string
    /** Renders a decorative icon at the logical inline start of the field. */
    startIcon?: RIconResolvableSource
    /** Renders a decorative icon at the logical inline end of the field. */
    endIcon?: RIconResolvableSource
    /** Shows an end action that clears the field while it is focused and has a value. */
    clearable?: boolean
    /** Sets the accessible name announced for the clear action. */
    clearLabel?: string
}
