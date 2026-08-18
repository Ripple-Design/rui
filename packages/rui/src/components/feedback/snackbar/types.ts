import type { Ref } from "vue"

export type RSnackbarDuration = "short" | "long" | "indefinite" | number
export type RSnackbarAnimation = "fade" | "slide"
export type RSnackbarDismissReason = "swipe" | "action" | "timeout" | "manual" | "consecutive"

export type RSnackbarAction = {
    label: string
    onClick?: () => void | Promise<void>
}

export type RSnackbarOptions = {
    message: string
    duration?: RSnackbarDuration
    animation?: RSnackbarAnimation
    action?: RSnackbarAction
    twoLine?: boolean
    longAction?: boolean
    swipeDismissible?: boolean
    onShown?: () => void
    onDismissed?: (reason: RSnackbarDismissReason) => void
}

export type RSnackbarProps = {
    /** Controls whether the snackbar is shown. */
    modelValue?: boolean
    /** Sets the snackbar message. */
    message?: string
    /** Sets how long the snackbar remains shown before automatic dismissal. */
    duration?: RSnackbarDuration
    /** Selects the snackbar entry and exit animation. */
    animation?: RSnackbarAnimation
    /** Sets the label of the optional action. */
    actionLabel?: string
    /** Forces the snackbar to use its two-line layout. */
    twoLine?: boolean
    /** Uses the long-action layout for the optional action. */
    longAction?: boolean
    /** Sets the reason reported when the snackbar is dismissed manually. */
    dismissReason?: RSnackbarDismissReason
    /** Allows the snackbar to be dismissed with a horizontal swipe. */
    swipeDismissible?: boolean
}

export type RSnackbarHandle = {
    readonly id: string
    readonly isShown: Readonly<Ref<boolean>>
    dismiss: (reason?: RSnackbarDismissReason) => void
    update: (options: Partial<RSnackbarOptions>) => void
}

export type RSnackbarCloseDetail = {
    reason: RSnackbarDismissReason
}
