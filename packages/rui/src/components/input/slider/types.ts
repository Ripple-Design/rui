export type RSliderRangeValue = [start: number, end: number]

export type RSliderModelValue = number | RSliderRangeValue

export type RSliderProps = {
    /** Sets the lowest selectable value. */
    min?: number
    /** Sets the highest selectable value. */
    max?: number
    /** Sets the increment between selectable values. Use `0` for continuous movement. */
    step?: number
    /** Disables pointer, keyboard, and form interaction. */
    disabled?: boolean
    /** Displays tick marks along the slider track. */
    showTicks?: boolean
    /** Formats a value for the slider value indicator. */
    formatValue?: (value: number) => string
    /** Sets the accessible label for a single-value slider. */
    ariaLabel?: string
    /** References elements that label a single-value slider. */
    ariaLabelledby?: string
    /** References elements that describe a single-value slider. */
    ariaDescribedby?: string
    /** Sets the accessible label for the start thumb of a range slider. */
    startAriaLabel?: string
    /** Sets the accessible label for the end thumb of a range slider. */
    endAriaLabel?: string
}
