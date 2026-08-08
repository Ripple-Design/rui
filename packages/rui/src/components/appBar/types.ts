export type RAppBarContentAlign = "full-width" | "centered" | "body"
export type RAppBarColor = "surface" | "primary"

export type RAppBarContainerProps = {
    contentAlign?: RAppBarContentAlign
    color?: RAppBarColor
    collapsing?: boolean
    hideOnScroll?: boolean
    underlap?: boolean
    expandedHeight?: string
    collapsedHeight?: string
}

export type RAppBarProps = RAppBarContainerProps & {
    centered?: boolean
}
