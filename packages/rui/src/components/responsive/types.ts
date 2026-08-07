import type { CSSProperties } from "vue"

export type RResponsiveContainerMode = "full-width" | "centered"

export type RResponsiveContainerProps = {
    mode?: RResponsiveContainerMode
    maxWidth?: string
}

export type RResponsiveGridProps = RResponsiveContainerProps & {
    gap?: CSSProperties["gap"]
    columnGap?: CSSProperties["columnGap"]
    rowGap?: CSSProperties["rowGap"]
}
