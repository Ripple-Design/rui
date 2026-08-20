export type RSliderRangeValue = [start: number, end: number]

type RSliderCommonProps = {
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
}

export type RSliderProps = RSliderCommonProps & {
    /** Sets the accessible label for a single-value slider. */
    ariaLabel?: string
    /** References elements that label a single-value slider. */
    ariaLabelledby?: string
    /** References elements that describe a single-value slider. */
    ariaDescribedby?: string
}

export type RRangeSliderProps = RSliderCommonProps & {
    /** Sets the accessible label for the range slider. */
    ariaLabel?: string
    /** References elements that label the range slider. */
    ariaLabelledby?: string
    /** References elements that describe the range slider. */
    ariaDescribedby?: string
    /** Sets the accessible label for the start thumb. */
    startAriaLabel?: string
    /** Sets the accessible label for the end thumb. */
    endAriaLabel?: string
}
