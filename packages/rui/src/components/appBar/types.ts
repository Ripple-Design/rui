export type RAppBarContentAlign = "full-width" | "centered" | "body"

export type RAppBarProps = {
    contentAlign?: RAppBarContentAlign
    collapsing?: boolean
    hideOnScroll?: boolean
    underlap?: boolean
    expandedHeight?: string
    collapsedHeight?: string
}
