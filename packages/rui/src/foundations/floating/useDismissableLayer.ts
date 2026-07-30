import { onBeforeUnmount, watch, type Ref } from "vue"

import { resolveTouchTargetAnchor } from "@/foundations/touchTarget"

import { normalizeFloatingBoolean } from "./shared"

import type { RFloatingDismissOptions } from "./types"

export function useDismissableLayer(
    reference: Ref<HTMLElement | null>,
    floating: Ref<HTMLElement | null>,
    options: RFloatingDismissOptions,
) {
    const enabled = normalizeFloatingBoolean(options.enabled, true)
    const closeOnEscape = normalizeFloatingBoolean(options.closeOnEscape, true)
    const closeOnOutsidePress = normalizeFloatingBoolean(options.closeOnOutsidePress, true)
    const isTopLayer = normalizeFloatingBoolean(options.isTopLayer, true)
    const resolvedReference = () => {
        const referenceElement = reference.value
        return referenceElement ? resolveTouchTargetAnchor(referenceElement) : null
    }

    function isInsideLayer(target: EventTarget | null) {
        if (!(target instanceof Node)) {
            return false
        }

        return !!resolvedReference()?.contains(target) || !!floating.value?.contains(target)
    }

    function handlePointerDown(event: PointerEvent) {
        if (!enabled.value || !closeOnOutsidePress.value || !isTopLayer.value) {
            return
        }

        if (isInsideLayer(event.target)) {
            return
        }

        options.onDismiss("pointer-outside", event)
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (!enabled.value || !closeOnEscape.value || !isTopLayer.value) {
            return
        }

        if (event.key !== "Escape") {
            return
        }

        options.onDismiss("escape-key", event)
    }

    function attach() {
        if (typeof document === "undefined") {
            return
        }

        document.addEventListener("pointerdown", handlePointerDown, true)
        document.addEventListener("keydown", handleKeyDown)
    }

    function detach() {
        if (typeof document === "undefined") {
            return
        }

        document.removeEventListener("pointerdown", handlePointerDown, true)
        document.removeEventListener("keydown", handleKeyDown)
    }

    watch([enabled, closeOnEscape, closeOnOutsidePress, isTopLayer], () => {
        detach()
        if (enabled.value) {
            attach()
        }
    }, { immediate: true })

    onBeforeUnmount(() => {
        detach()
    })

    return {
        detach,
    }
}
