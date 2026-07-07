export type RTextInputProps = {
    textArea?: boolean
    placeholder?: string
}

export type RTextFieldInputProps = RTextInputProps & {
    showPlaceholder: boolean
}

export type RFloatingLabelProps = {
    focused: boolean
    floating: boolean
    label?: string
}

export type RNotchedOutlineProps = {
    focused: boolean
    floating: boolean
    hovered: boolean
    label?: string
}

export type RTextFieldShellProps = {
    focused: boolean
    floating: boolean
    label?: string
}

export type RTextFieldProps = {
    label?: string
    textArea?: boolean
    placeholder?: string
}
