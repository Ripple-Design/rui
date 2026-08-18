import type { RModalProps } from "@/primitives/modal/types.ts"

/** Props for the {@link RBottomSheet} component. */
export type RBottomSheetProps = {
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Limits the sheet width using any valid CSS max-inline-size value. */
    maxWidth?: string
    /** Limits the sheet height using any valid CSS max-block-size value. */
    maxHeight?: string
    /** Controls the surface elevation. */
    elevation?: number
}

/** Props for the {@link RModalBottomSheet} component. */
export type RModalBottomSheetProps = RModalProps & Pick<RBottomSheetProps, "maxWidth" | "maxHeight" | "elevation">
