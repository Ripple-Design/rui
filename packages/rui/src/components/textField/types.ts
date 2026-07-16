/** Props for the {@link RTextInput} component. */
export type RTextInputProps = {
    /** Renders a multiline textarea instead of a single-line input. */
    textArea?: boolean
    /** Sets the placeholder text shown when the field is empty. */
    placeholder?: string
}

/** Props for the internal text field input surface. */
export type RTextFieldInputProps = RTextInputProps & {
    /** Indicates whether the field is currently focused. */
    focused: boolean
    /** Controls whether the placeholder should be visible. */
    showPlaceholder: boolean
}

/** Props shared by text field label and container primitives. */
export type RFloatingLabelProps = {
    /** Indicates whether the field is currently focused. */
    focused: boolean
    /** Indicates whether the label should float above the input area. */
    floating: boolean
    /** Indicates whether the field currently has a value. */
    hasValue: boolean
    /** Renders a multiline textarea layout instead of a single-line input layout. */
    textArea?: boolean
    /** Sets the visible field label. */
    label?: string
}

/** Props for the internal notched outline container. */
export type RNotchedOutlineProps = RFloatingLabelProps & {
    /** Indicates whether the field is currently hovered. */
    hovered: boolean
}

/** Props for the internal text field shell. */
export type RTextFieldShellProps = RFloatingLabelProps

/** Props for the {@link RTextField} component. */
export type RTextFieldProps = {
    /** Sets the visible field label. */
    label?: string
    /** Renders a multiline textarea instead of a single-line input. */
    textArea?: boolean
    /** Sets the placeholder text shown when the field is empty. */
    placeholder?: string
}
