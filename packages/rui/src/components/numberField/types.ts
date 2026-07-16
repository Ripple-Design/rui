/** Props for the {@link RNumberField} component. */
export type RNumberFieldProps = {
    /** Sets the visible field label. */
    label?: string
    /** Sets the placeholder text shown when the field is empty. */
    placeholder?: string
    /** Controls whether the field accepts integer or decimal numeric input. */
    inputType?: "numeric" | "decimal"
}
