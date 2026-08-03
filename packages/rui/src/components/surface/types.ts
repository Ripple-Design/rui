/** Semantic background colors available to {@link RSurface}. */
export type RSurfaceColor = "surface" | "primary" | "secondary"

/** Props for the {@link RSurface} component. */
export type RSurfaceProps = {
    /** Controls the surface treatment. */
    variant?: "elevated" | "outlined"
    /** Chooses the shadow and stacking level for elevated surfaces. Supports 0 through 24. */
    elevation?: number
    /** Chooses which HTML element the surface should render as. */
    as?: string
    /** Chooses the semantic container background color. */
    color?: RSurfaceColor
    /** Overrides the semantic foreground color inherited by surface content. */
    contentColor?: string
}
