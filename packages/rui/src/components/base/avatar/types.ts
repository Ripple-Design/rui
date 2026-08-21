/** Props for the {@link RAvatar} component. */
export type RAvatarProps = {
    /** Image source URL. */
    src?: string
    /** Accessible alternative text; use an empty string for decorative avatars. */
    alt: string
    /** Avatar diameter. Numbers map to pixels, while strings pass through directly. */
    size?: string | number
}
