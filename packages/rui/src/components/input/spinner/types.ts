import type { RTextEmphasis, RTextVariant } from "@/components/base/text/types.ts"
import type { RMenuItemProps } from "@/components/overlays/menu/types.ts"

/** Props for the {@link RSpinner} component. */
export type RSpinnerProps = {
    /** Prevents opening the listbox and changing the selected option. */
    disabled?: boolean
    /** Aligns the popup to the logical inline start or end. */
    align?: "start" | "end"
    /** Controls the typography style applied to the content. */
    variant?: RTextVariant
    /** Controls the foreground emphasis level. */
    emphasis?: RTextEmphasis
}

/** Props for the {@link RSpinnerOption} component. */
export type RSpinnerOptionProps = Omit<RMenuItemProps, "label" | "value"> & {
    /** Sets the text shown by the spinner trigger. */
    label: string
    /** Sets the value written to the containing spinner. */
    value: unknown
}
