/** Props for the {@link RImage} component. */
export type RImageProps = {
    /** Image source URL. */
    src: string
    /** Accessible alternative text; use an empty string for decorative images. */
    alt: string
    /** Controls the rendered image box's CSS aspect ratio. */
    aspectRatio?: number | string
}
