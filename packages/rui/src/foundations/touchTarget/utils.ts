const interactiveSelector =
    "[data-rui-touch-target-anchor], button, a[href], input, textarea, select, [tabindex]:not([tabindex='-1']), [role='button']"

export function shouldRenderTouchTarget(density?: number) {
    return (density ?? 0) === 0
}

export function resolveTouchTargetAnchor(element: Element): HTMLElement | null {
    if (!(element instanceof HTMLElement)) {
        return null
    }

    if (element.matches("[data-rui-touch-target-anchor]")) {
        return element
    }

    const interactive = element.querySelector<HTMLElement>(interactiveSelector)
    return interactive ?? element
}
