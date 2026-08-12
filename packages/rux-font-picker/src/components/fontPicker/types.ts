/** Props for the {@link RFontPicker} component. */
export type RFontPickerProps = {
    /** Sets the visible field label. */
    label?: string
    /** Sets the text shown when no font is selected. */
    placeholder?: string
    /** Displays supporting text below the field control. */
    helperText?: string
    /** Displays an error message below the field control. */
    errorText?: string
    /** Requires a selected font before the field can be submitted. */
    required?: boolean
    /** Prevents opening and selecting fonts. */
    disabled?: boolean
    /** Aligns the popup to the logical inline start or end. */
    align?: "start" | "end"
}

/** Props for the {@link RFontOption} component. */
export type RFontOptionProps = {
    /** Sets the value written to the containing font picker. */
    value: string
    /** Sets the label shown in the picker field and used for filtering. */
    label: string
    /** Sets the font family used to render the option label. */
    fontFamily: string
    /** Prevents selecting this font. */
    disabled?: boolean
}
