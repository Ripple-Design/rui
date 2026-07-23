import type { RippleOptions } from "@/foundations/ripple"

export type RButtonVariant = "text" | "outlined" | "contained" | "unelevated"
export type RButtonType = "button" | "submit" | "reset"

/** Props for the {@link RButton} component. */
export type RButtonProps = {
    /** Controls the button’s visual treatment. */
    variant?: RButtonVariant
    /** Disables the button and all interactive feedback. */
    disabled?: boolean
    /** Expands the button to fill the available inline size. */
    fullWidth?: boolean
    /** Sets the native button type when rendering a `<button>`. */
    type?: RButtonType
    /** Renders the button as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Renders a leading icon using the shared icon renderer. */
    icon?: string
    /** Renders a trailing icon using the shared icon renderer. */
    endIcon?: string
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}
