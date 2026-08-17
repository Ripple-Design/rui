import type { RippleOptions } from "@/foundations/ripple"

import type { RIconResolvableSource } from "@/components/icon/types"
import type { RTextEmphasis } from "@/components/text/types"

export type RButtonVariant = "text" | "outlined" | "contained" | "unelevated"
export type RButtonGroupVariant = RButtonVariant | "icon"
export type RButtonType = "button" | "submit" | "reset"
export type RButtonGroupSelection = "single" | "multiple"
export type RButtonGroupModelValue = unknown | unknown[] | null
export type RFabVariant = "standard" | "extended"
export type RFabSize = "normal" | "mini" | "auto"

/** Props for the {@link RButton} component. */
export type RButtonProps = {
    /** Controls the button’s visual treatment. */
    variant?: RButtonVariant
    /** Disables the button and all interactive feedback. */
    disabled?: boolean
    /** Expands the button to fill the available inline size. */
    fullWidth?: boolean
    /** Expands the button to fill the available block size. */
    fullHeight?: boolean
    /** Allows the label to remain in sentence case instead of uppercase. */
    sentenceCase?: boolean
    /** Sets the native button type when rendering a `<button>`. */
    type?: RButtonType
    /** Renders the button as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Identifies the button inside a selectable `RButtonGroup`. */
    value?: unknown
    /** Renders a leading icon using the shared icon renderer. */
    icon?: RIconResolvableSource
    /** Renders a trailing icon using the shared icon renderer. */
    endIcon?: RIconResolvableSource
    /** Renders a top icon using the shared icon renderer. */
    topIcon?: RIconResolvableSource
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for the {@link RButtonRow} component. */
export type RButtonRowProps = {
    /** Applies a default visual treatment to child `RButton` components that do not set their own variant. */
    variant?: RButtonVariant
}

/** Props for the {@link RIconButton} component. */
export type RIconButtonProps = {
    /** Renders the icon-only button glyph using the shared icon renderer. */
    icon: RIconResolvableSource
    /** Renders the icon-only button glyph while the button is active. */
    activeIcon?: RIconResolvableSource
    /** Sets the accessible name announced for the icon-only button. */
    label: string
    /** Sets the accessible name announced while the button is active. */
    activeLabel?: string
    /** Controls the icon foreground emphasis level. */
    emphasis?: RTextEmphasis
    /** Disables the icon button and all interactive feedback. */
    disabled?: boolean
    /** Sets the native button type when rendering a `<button>`. */
    type?: RButtonType
    /** Renders the icon button as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for the {@link RFab} component. */
export type RFabProps = {
    /** Selects the circular standard or pill-shaped extended FAB. */
    variant?: RFabVariant
    /** Sets the standard FAB size; `auto` uses mini below the Material 470px viewport threshold. */
    size?: RFabSize
    /** Renders the FAB icon. Required for standard and collapsed extended FABs. */
    icon?: RIconResolvableSource
    /** Sets the accessible name when the action has no visible text label. */
    label?: string
    /** Shows or hides the FAB with the Material motion specification. */
    visible?: boolean
    /** Expands or collapses an extended FAB. */
    extended?: boolean
    /** Disables the FAB and all interactive feedback. */
    disabled?: boolean
    /** Sets the native button type when rendering a `<button>`. */
    type?: RButtonType
    /** Renders the FAB as a link when provided. */
    href?: string
    /** Sets the link target when rendering an anchor. */
    target?: string
    /** Sets the link relationship when rendering an anchor. */
    rel?: string
    /** Controls ripple behavior or disables it entirely. */
    ripple?: boolean | RippleOptions
}

/** Props for the {@link RButtonGroup} component. */
export type RButtonGroupProps = {
    /** Applies a shared button variant to grouped `RButton` children that do not set their own variant. */
    variant?: RButtonGroupVariant
    /** Expands the group to fill the available inline size and evenly distribute child buttons. */
    fullWidth?: boolean
    /** Disables every button in the group. */
    disabled?: boolean
    /** Enables single or multiple selection behavior for grouped buttons. */
    selection?: RButtonGroupSelection
    /** Prevents the selection from becoming empty while selection mode is enabled. */
    required?: boolean
    /** Controls the selected value or values when selection mode is enabled. */
    modelValue?: RButtonGroupModelValue
}
