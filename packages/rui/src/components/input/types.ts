/** Props shared by public fields that render supporting helper text. */
export type RFieldHelperProps = {
    /** Displays supporting text below the field control. */
    helperText?: string
}

/** Props for the {@link RInput} component. */
export type RInputProps = {
    /** Renders a multiline textarea instead of a single-line input. */
    textArea?: boolean
    /** Sets the placeholder text shown when the field is empty. */
    placeholder?: string
    /** Controls whether the placeholder should be visible. */
    showPlaceholder?: boolean
    /** Controls how the input value should be interpreted and sanitized. */
    inputType?: "text" | "numeric" | "decimal"
    /** Controls whether negative values are allowed for numeric input types. */
    allowNegative?: boolean
}

/** Props for the internal text field input surface. */
export type RFieldInputProps = RInputProps & {
    /** Indicates whether the field is currently focused. */
    focused: boolean
    /** Reserves the logical inline-start adornment region. */
    hasStartIcon?: boolean
    /** Reserves the logical inline-end adornment region. */
    hasEndIcon?: boolean
}

/** Props shared by field label and container primitives. */
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
    /** Associates the visible label with the native input. */
    inputId?: string
    /** Sets the ID used to reference the visible label. */
    labelId?: string
}

/** Props for the internal notched outline container. */
export type RNotchedOutlineProps = RFloatingLabelProps & {
    /** Indicates whether the field is currently hovered. */
    hovered: boolean
    /** Indicates whether the field has a logical inline-start adornment. */
    hasStartIcon?: boolean
}

/** Props for the internal input field shell. */
export type RFieldShellProps = RFloatingLabelProps &
    RFieldHelperProps & {
        /** Sets the ID used by the helper text description. */
        helperId?: string
        /** Reserves the logical inline-start adornment region. */
        hasStartIcon?: boolean
        /** Reserves the logical inline-end adornment region. */
        hasEndIcon?: boolean
    }
