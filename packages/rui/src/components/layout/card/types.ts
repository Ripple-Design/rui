import type { RSurfaceColor } from "@/components"

export type RCardVariant = "elevated" | "outlined"

export type RCardHeaderProps = {
    title?: string
    text?: string
}

/** Props for the {@link RCard} component. */
export type RCardProps = {
    /** Controls the card surface treatment. */
    variant?: RCardVariant
    /** Chooses the semantic card background color. */
    color?: RSurfaceColor
    /** Overrides the semantic foreground color inherited by card content. */
    contentColor?: string
    /** Enables ripple feedback for pointer and keyboard interaction. */
    clickable?: boolean
    /** Enables the controlled selected treatment. */
    selectable?: boolean
    /** Applies the controlled 8% foreground state layer when the card is selectable. */
    selected?: boolean
    /** Applies an independent 2px primary inner outline without a state layer. */
    activated?: boolean
    /** Applies the raised appearance while an owning drag interaction is active. */
    dragged?: boolean
}
