import type { Directive } from "vue"

import { createRippleController } from "./engine.ts"
import { normalizeRippleOptions, type RippleDirectiveValue } from "./types.ts"

const controllers = new WeakMap<HTMLElement, ReturnType<typeof createRippleController>>()
const resizeObservers = new WeakMap<HTMLElement, ResizeObserver>()
const resizeFrames = new WeakMap<HTMLElement, number>()

function stopResizeTracking(el: HTMLElement) {
    const frame = resizeFrames.get(el)
    if (frame != null) {
        cancelAnimationFrame(frame)
        resizeFrames.delete(el)
    }

    const observer = resizeObservers.get(el)
    if (observer) {
        observer.disconnect()
        resizeObservers.delete(el)
    }
}

function startResizeTracking(el: HTMLElement) {
    stopResizeTracking(el)

    const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }

        const existingFrame = resizeFrames.get(el)
        if (existingFrame != null) {
            cancelAnimationFrame(existingFrame)
        }

        const frame = requestAnimationFrame(() => {
            resizeFrames.delete(el)
            controllers.get(el)?.refreshGeometry()
        })

        resizeFrames.set(el, frame)
    })

    observer.observe(el)
    resizeObservers.set(el, observer)
}

/** Adds a Material-style ripple interaction layer to a host element. */
export const vRipple: Directive<HTMLElement, RippleDirectiveValue> = {
    mounted(el, binding) {
        const controller = createRippleController(el, normalizeRippleOptions(binding.value, binding.modifiers))
        controllers.set(el, controller)
        startResizeTracking(el)
    },
    updated(el, binding) {
        const controller = controllers.get(el)
        if (!controller) {
            return
        }

        controller.update(normalizeRippleOptions(binding.value, binding.modifiers))
    },
    unmounted(el) {
        stopResizeTracking(el)

        const controller = controllers.get(el)
        if (!controller) {
            return
        }

        controller.destroy()
        controllers.delete(el)
    },
    getSSRProps() {
        return {}
    },
}
