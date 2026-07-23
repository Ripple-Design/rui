import type { RIIcon } from "@ripple-design/icons"
import type { Component } from "vue"

export type RIconSource = RIIcon | Component

/** Props for the {@link RIcon} component. */
export type RIconProps = {
    /** Optimized icon source or a Vue component to render. */
    icon?: RIconSource
    /** Controls the icon size. Numbers map to pixels, while strings pass through directly. */
    size?: string | number
    /** Forces the icon to be decorative and hidden from assistive technology. */
    decorative?: boolean
    /** Sets the accessible name announced for a non-decorative icon. */
    label?: string
}
