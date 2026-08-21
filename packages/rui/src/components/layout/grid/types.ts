import type { CSSProperties } from "vue"

import type { RResponsiveValue, RViewportResponsiveValue } from "@/foundations/responsive/responsive.ts"

export type RGridColumnsValue = number | string

export type RGridResponsiveColumns = RViewportResponsiveValue<RGridColumnsValue>

/** Props for the {@link RGrid} component. */
export type RGridProps = {
    /**
     * Defines the grid columns.
     * Numbers become `repeat(n, minmax(0, 1fr))`, strings pass through as native CSS Grid templates,
     * and object values map `xs`, `sm`, `md`, `lg`, `xl`, and `xxl` breakpoints to templates.
     */
    columns?: RResponsiveValue<RGridColumnsValue>
    /** Selects whether responsive columns and spans use viewport or container breakpoints. */
    responsive?: "viewport" | "container"
    /** Sets both row and column gaps between grid items. */
    gap?: CSSProperties["gap"]
    /** Sets the horizontal gap between grid items. */
    columnGap?: CSSProperties["columnGap"]
    /** Sets the vertical gap between grid items. */
    rowGap?: CSSProperties["rowGap"]
    /** Controls how grid items align within their grid areas on the block axis. */
    alignItems?: CSSProperties["alignItems"]
    /** Controls how grid items align within their grid areas on the inline axis. */
    justifyItems?: CSSProperties["justifyItems"]
    /** Controls how grid tracks align within the container on the block axis. */
    alignContent?: CSSProperties["alignContent"]
    /** Controls how grid tracks align within the container on the inline axis. */
    justifyContent?: CSSProperties["justifyContent"]
    /** Controls the automatic placement algorithm for grid items. */
    autoFlow?: CSSProperties["gridAutoFlow"]
    /** Appends `dense` to the automatic placement mode so the browser can backfill gaps. */
    dense?: boolean
}
