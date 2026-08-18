import type { RFieldHelperProps } from "@/components/internal/input/types.ts"
import type { RMenuItemProps } from "@/components/overlays/menu/types.ts"

/** Props for the {@link RSelectField} component. */
export type RSelectFieldProps = RFieldHelperProps & {
    /** Sets the visible field label. */
    label?: string
    /** Sets the text shown when no option is selected. */
    placeholder?: string
    /** Prevents opening and selecting options. */
    disabled?: boolean
    /** Allows users to filter options by typing in the field. */
    filterable?: boolean
    /** Aligns the popup to the logical inline start or end. */
    align?: "start" | "end"
}

/** Props for the {@link RSelectOption} alias. */
export type RSelectOptionProps = RMenuItemProps
