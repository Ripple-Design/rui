export type RProgressIndicatorCommonProps = {
    /** Sets the accessible label announced by assistive technologies. */
    ariaLabel?: string
    /** References a visible label element for the indicator. */
    ariaLabelledby?: string
    /** References helper text or additional context for the indicator. */
    ariaDescribedby?: string
    /** Hides the indicator when true. */
    closed?: boolean
    /** Controls whether the indicator uses determinate or indeterminate motion. */
    indeterminate?: boolean
}

export type RCircularProgressIndicatorSize = 24 | 36 | 48

/** Props for the {@link RCircularProgressIndicator} component. */
export type RCircularProgressIndicatorProps = RProgressIndicatorCommonProps & {
    /** Sets the filled portion of the circle in the interval [0, 1]. */
    progress?: number
    /** Chooses the rendered size of the circular indicator. */
    size?: RCircularProgressIndicatorSize
    /** Enables the four-color indeterminate animation. */
    fourColor?: boolean
    /** Reverses the circular direction for counterclockwise visual behavior. */
    reversed?: boolean
}

/** Props for the {@link RLinearProgressIndicator} component. */
export type RLinearProgressIndicatorProps = RProgressIndicatorCommonProps & {
    /** Sets the primary progress bar fill in the interval [0, 1]. */
    progress?: number
    /** Sets the buffer bar fill in the interval [0, 1]. */
    buffer?: number
    /** Controls whether the indicator should use the query animation state. */
    query?: boolean
    /** Reverses the linear direction for RTL-like visual behavior. */
    reversed?: boolean
}
