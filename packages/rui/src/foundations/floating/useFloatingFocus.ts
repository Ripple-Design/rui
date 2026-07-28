import { onBeforeUnmount, type Ref } from "vue"

import { useReturnFocus } from "@/components/modal/useReturnFocus"

import type { RFloatingInitialFocus } from "./types"

export function useFloatingFocus() {
    const { capture, restore } = useReturnFocus()

    function focusInitialTarget(target: RFloatingInitialFocus, floating: Ref<HTMLElement | null>) {
        const floatingElement = floating.value
        if (!floatingElement) {
            return
        }

        if (typeof target === "string") {
            floatingElement.querySelector<HTMLElement>(target)?.focus()
            return
        }

        if (typeof target === "function") {
            target()?.focus()
            return
        }

        if (target instanceof HTMLElement) {
            target.focus()
            return
        }

        floatingElement.focus()
    }

    onBeforeUnmount(() => {
        restore(true)
    })

    return {
        capture,
        focusInitialTarget,
        restore,
    }
}
