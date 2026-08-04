import type { VirtualElement } from "@floating-ui/dom"

export type RFloatingCoordinates = {
    clientX: number
    clientY: number
    contextElement?: HTMLElement
}

export function createFloatingVirtualReference({
    clientX,
    clientY,
    contextElement,
}: RFloatingCoordinates): VirtualElement {
    return {
        contextElement,
        getBoundingClientRect() {
            return DOMRect.fromRect({
                height: 0,
                width: 0,
                x: clientX,
                y: clientY,
            })
        },
    }
}
