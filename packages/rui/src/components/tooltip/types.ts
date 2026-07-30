export type RPlainTooltipProps = {
    /** Plain text content shown inside the tooltip bubble. */
    text: string
    /** Real DOM target element used as the tooltip anchor. */
    target?: HTMLElement | null
    /** Disables tooltip behavior entirely. */
    disabled?: boolean
}

export type TooltipDirectiveObject = {
    disabled?: boolean
    text: string
}

export type TooltipDirectiveValue = string | TooltipDirectiveObject
