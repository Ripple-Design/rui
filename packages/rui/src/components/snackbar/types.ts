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
    modelValue?: boolean
    message?: string
    duration?: RSnackbarDuration
    animation?: RSnackbarAnimation
    actionLabel?: string
    twoLine?: boolean
    longAction?: boolean
    dismissReason?: RSnackbarDismissReason
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
