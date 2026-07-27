import type { RippleOptions } from "@/foundations/ripple"

import type { RButtonVariant } from "./types"

export function resolveButtonHref(href: string | undefined, disabled: boolean) {
    return disabled ? undefined : href
}

export function resolveDisabledLinkTabIndex(isLink: boolean, disabled: boolean) {
    if (isLink && disabled) {
        return -1
    }

    return undefined
}

export function consumeDisabledLinkClick(event: MouseEvent, isLink: boolean, disabled: boolean) {
    if (isLink && disabled) {
        event.preventDefault()
        event.stopImmediatePropagation()
        return true
    }

    return false
}

export function resolveButtonRippleOptions(
    variant: RButtonVariant,
    ripple: boolean | RippleOptions | undefined,
    disabled: boolean,
): RippleOptions {
    const defaultContrast = ["contained", "unelevated"].includes(variant) ? "high" : "low"

    if (ripple === false) {
        return { disabled: true }
    }

    if (ripple === true || ripple == null) {
        return {
            disabled,
            contrast: defaultContrast,
        }
    }

    return {
        ...ripple,
        contrast: ripple.contrast ?? defaultContrast,
        disabled: disabled || !!ripple.disabled,
    }
}
