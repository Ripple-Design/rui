import type { RModalProps } from "@/primitives/modal/types.ts"

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
}

/** Props for the {@link RFullscreenDialog} component. */
export type RFullscreenDialogProps = Omit<RDialogProps, "title" | "message">
