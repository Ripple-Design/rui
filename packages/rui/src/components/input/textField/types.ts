import type { MaybeRef } from "vue"

import type { RIconResolvableSource } from "@/components/base/icon/types.ts"
import type { RFieldHelperProps } from "@/components/internal/input/types.ts"

/** Props for the {@link RTextField} component. */
export type RTextFieldProps = Omit<RFieldHelperProps, "errorText"> & {
    /** Displays an error message below the field control. */
    errorText?: MaybeRef<string | null>
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
