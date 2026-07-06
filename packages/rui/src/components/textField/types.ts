export type RTextInputProps = {
    textArea?: boolean
    placeholder?: string
}

export type RFloatingLabelProps = {
    floatAbove: boolean
    label?: string
}

export type RNotchedOutlineProps = {
    focused: boolean
    hasValue: boolean
    label?: string
}

export type RTextFieldShellProps = {
    hasValue: boolean
    label?: string
}

export type RTextFieldProps = {} & Omit<RTextFieldShellProps, "hasValue"> & RTextInputProps
