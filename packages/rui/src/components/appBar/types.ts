export type RAppBarContentAlign = "full-width" | "centered" | "body"
export type RAppBarColor = "surface" | "primary"
export type RAppBarScrollBehavior =
    | "fixed"
    | "scroll"
    | "exit-until-collapsed"
    | "enter-always"
    | "enter-always-collapsed"
export type RAppBarCollapseItemMode = "off" | "pin" | "parallax"
export type RAppBarTitleGravity = "start" | "center" | "end"

export type RAppBarLogicalInsets = {
    start?: string
    top?: string
    end?: string
    bottom?: string
}

export type RAppBarTitleAppearance = {
    color?: string
    fontFamily?: string
    fontSize?: string
    fontWeight?: string | number
    letterSpacing?: string
    lineHeight?: string
}

export type RAppBarContainerProps = {
    contentAlign?: RAppBarContentAlign
    color?: RAppBarColor
    expandedHeight?: string
    collapsedHeight?: string
    topInset?: string
    scrollBehavior?: RAppBarScrollBehavior
    snap?: boolean
    snapMargins?: boolean
    liftOnScroll?: boolean
    hideOnScroll?: boolean
    underlap?: boolean
    contentScrim?: string | false
    statusBarScrim?: string | false
    scrimVisibleHeightTrigger?: string
}

export type RTopAppBarProps = {
    /** Sets the visible app-bar title when no title slot is provided. */
    title?: string
    /** Sets the visible app-bar subtitle when no subtitle slot is provided. */
    subtitle?: string
    /** Centers the title and subtitle between the navigation and action areas. */
    centered?: boolean
    /** Sets the accessible label of the app-bar toolbar. */
    ariaLabel?: string
    /** References the element that labels the app-bar toolbar. */
    ariaLabelledby?: string
}

export type RCollapsingAppBarProps = {
    title?: string
    titleEnabled?: boolean
    expandedTitleGravity?: RAppBarTitleGravity
    collapsedTitleGravity?: RAppBarTitleGravity
    expandedTitleMargin?: RAppBarLogicalInsets
    expandedTitleAppearance?: RAppBarTitleAppearance
    collapsedTitleAppearance?: RAppBarTitleAppearance
}

export type RAppBarCollapseItemProps = {
    mode?: RAppBarCollapseItemMode
    parallaxMultiplier?: number
}
