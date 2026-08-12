/** Public props for the {@link RNumberPicker} component. */
export type RNumberPickerProps = {
    /** Sets the minimum selectable value. */
    min: number
    /** Sets the maximum selectable value. */
    max: number
    /** Sets the increment between selectable values. */
    step?: number
    /** Prevents pointer and keyboard interaction. */
    disabled?: boolean
    /** Cycles from the maximum value to the minimum value and vice versa. */
    wrap?: boolean
    /** Formats values displayed in the wheel and announced to assistive technology. */
    formatValue?: (value: number) => string
    /** Provides an accessible name for the spinbutton. */
    ariaLabel?: string
    /** Identifies elements that label the spinbutton. */
    ariaLabelledby?: string
    /** Identifies elements that describe the spinbutton. */
    ariaDescribedby?: string
}
