import type { RModalProps } from "@/primitives/modal/types.ts"

export type RSideSheetSide = "start" | "end"

/** Props for the {@link RSideSheet} component. */
export type RSideSheetProps = {
    /** Sets a plain-text title when the title slot is not used. */
    title?: string
    /** Attaches the sheet to the inline start or end edge. */
    side?: RSideSheetSide
    /** Controls the surface elevation. */
    elevation?: number
    /** Controls the sheet width using any valid CSS inline-size value. */
    width?: string
}

/** Props for the {@link RModalSideSheet} component. */
export type RModalSideSheetProps = RModalProps & RSideSheetProps
