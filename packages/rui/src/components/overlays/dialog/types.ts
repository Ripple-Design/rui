import type { RButtonVariant } from "@/components/actions/button/types.ts"
import type { RTextFieldProps } from "@/components/input/textField/types.ts"
import type { RModalCloseDetail, RModalProps } from "@/primitives/modal/types.ts"

export type RDialogActionConfig = {
    /** Sets the visible action label. */
    label?: string
    /** Prevents selecting the action. */
    disabled?: boolean
    /** Sets the action button visual treatment. */
    variant?: RButtonVariant
}

export type RDialogAction = boolean | string | RDialogActionConfig

/** Props for the {@link RDialog} component. */
export type RDialogProps = RModalProps & {
    /** Sets the dialog width as a 56dp multiplier, or automatically selects a width increment that fits the viewport. */
    width?: number | "auto"
    /** Sets the dialog height as a 56dp multiplier, or lets content determine the height. */
    height?: number | "auto"
    /** Sets a plain-text message when the message slot is not used. */
    message?: string
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Renders a standard primary action when configured. */
    positive?: RDialogAction
    /** Renders a standard secondary action when configured. */
    negative?: RDialogAction
}

/** Props for the {@link RFullscreenDialog} component. */
export type RFullscreenDialogProps = Omit<RDialogProps, "title" | "message">

export type RTextFieldDialogProps = Omit<RDialogProps, "message"> &
    RTextFieldProps & {
        value?: string
    }

export type RDialogAlertOptions = Omit<RDialogProps, "modelValue">

export type RDialogAlertResult = RModalCloseDetail

export type RDialogTextFieldOptions = Omit<RTextFieldDialogProps, "modelValue"> & {
    value?: string
}

export type RDialogTextFieldResult = {
    value: string
    detail: RModalCloseDetail
}
