export type RSliderRangeValue = [start: number, end: number]

export type RSliderModelValue = number | RSliderRangeValue

export type RSliderProps = {
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    showTicks?: boolean
    formatValue?: (value: number) => string
    ariaLabel?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
    startAriaLabel?: string
    endAriaLabel?: string
}
