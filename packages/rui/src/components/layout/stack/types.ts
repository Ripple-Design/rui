import type { CSSProperties } from "vue"

/** Props shared by the stack layout primitives. */
export type RStackBaseProps = {
    /** Sets the gap between direct children. */
    gap?: CSSProperties["gap"]
    /** Controls how direct children align on the cross axis. */
    align?: CSSProperties["alignItems"]
    /** Controls how direct children are distributed on the main axis. */
    justify?: CSSProperties["justifyContent"]
    /** Controls whether direct children can wrap; `true` maps to `wrap`. */
    wrap?: CSSProperties["flexWrap"] | boolean
    /** Switches the container display from `flex` to `inline-flex`. */
    inline?: boolean
}

/** Props for the {@link RStack} component. */
export type RStackProps = RStackBaseProps & {
    /** Controls the main axis direction for direct children. */
    direction?: CSSProperties["flexDirection"]
}

/** Props for the {@link RRow} component. */
export type RRowProps = RStackBaseProps

/** Props for the {@link RColumn} component. */
export type RColumnProps = RStackBaseProps
