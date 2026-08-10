import type { RIIcon } from "@ripple-design/icons"
import type { Component } from "vue"

import type { RTextEmphasis } from "@/components/text/types"

import type { RIconStyle, RIconStyleMap } from "@/foundations/icon"

export type RIconEmphasis = RTextEmphasis | "inherit"

export type RIconSource = RIIcon | Component
export type RIconFamily = RIconStyleMap<RIconSource>
export type RIconResolvableSource = RIconSource | RIconFamily

/** Props for the {@link RIcon} component. */
export type RIconProps = {
    /** Optimized icon source, a themed icon family, or a Vue component to render. */
    icon?: RIconResolvableSource
    /** Overrides the active themed icon style when resolving an icon family. */
    iconStyle?: RIconStyle
    /** Controls the icon size. Numbers map to pixels, while strings pass through directly. */
    size?: string | number
    /** Controls the icon foreground emphasis level, or inherits the surrounding foreground. */
    emphasis?: RIconEmphasis
    /** Forces the icon to be decorative and hidden from assistive technology. */
    decorative?: boolean
    /** Sets the accessible name announced for a non-decorative icon. */
    label?: string
}
