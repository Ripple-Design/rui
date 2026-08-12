import type { RModalProps } from "@/components/modal/types"

/** Props for the {@link RDialog} component. */
export type RDialogProps = RModalProps & {
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Sets the dialog width using any valid CSS width value. */
    width?: string
}
