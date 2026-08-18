import type { RIconResolvableSource } from "@/components/base/icon/types.ts"

/** Props for the {@link RBanner} component. */
export type RBannerProps = {
    /** Controls whether the banner is shown in its parent flow. */
    modelValue?: boolean
    /** Sets the persistent message displayed by the banner. */
    message: string
    /** Sets the message line count, reserves that height, and truncates overflowing text. */
    lines?: 1 | 2 | 3
    /** Renders an optional decorative leading icon. */
    icon?: RIconResolvableSource
    /** Sets the optional left action label. */
    leftAction?: string
    /** Sets the optional right action label. */
    rightAction?: string
}
