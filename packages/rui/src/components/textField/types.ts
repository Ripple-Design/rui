export type RTextInputProps = {
    textArea?: boolean
    placeholder?: string
}

export type RTextFieldInputProps = RTextInputProps & {
    focused: boolean
    showPlaceholder: boolean
}

export type RFloatingLabelProps = {
    focused: boolean
    floating: boolean
    hasValue: boolean
    textArea?: boolean
    label?: string
}

export type RNotchedOutlineProps = RFloatingLabelProps & {
    hovered: boolean
}

export type RTextFieldShellProps = RFloatingLabelProps

export type RTextFieldProps = {
    label?: string
    textArea?: boolean
    placeholder?: string
}
