import type { RAvatarProps, RCardProps } from "@ripple-design/rui"

export type RMessageSender = "self" | "other" | "assistant"

export type RMessageGroupProps = {
    sender?: RMessageSender
    avatar?: RAvatarProps
}

export type RMessageProps = Omit<RCardProps, "variant"> & {
    elevation?: number
    hoverElevation?: number
    sender?: RMessageSender
}
