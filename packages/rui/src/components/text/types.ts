export type RTextVariant =
    | "headline1"
    | "headline2"
    | "headline3"
    | "headline4"
    | "headline5"
    | "headline6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"

/** Props for the {@link RText} component. */
export type RTextProps = {
    /** Controls the typography style applied to the content. */
    variant?: RTextVariant
    /** Overrides the semantic HTML tag chosen from the active variant. */
    as?: string
}
