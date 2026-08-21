import type { CSSProperties } from "vue"

export type RResponsiveContainerMode = "full-width" | "centered"

export type RResponsiveContainerProps = {
    mode?: RResponsiveContainerMode
    maxWidth?: string
    /** Adds responsive padding to the container block axis. */
    blockPadding?: boolean
}

export type RResponsiveGridProps = {
    mode?: RResponsiveContainerMode
    maxWidth?: string
    /** Adds responsive padding to the grid block axis. */
    blockPadding?: boolean
    gap?: CSSProperties["gap"]
    columnGap?: CSSProperties["columnGap"]
    rowGap?: CSSProperties["rowGap"]
}
