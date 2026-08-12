import type { MaybeRefOrGetter, ShallowRef } from "vue"
import { onBeforeUnmount, shallowRef, toValue, watch } from "vue"

type VisibilityElement = HTMLElement | SVGElement | null | undefined

export function useElementVisibility(element: MaybeRefOrGetter<VisibilityElement>): ShallowRef<boolean> {
    const isVisible = shallowRef(false)
    let observer: IntersectionObserver | undefined

    function stop() {
        observer?.disconnect()
        observer = undefined
    }

    watch(
        () => toValue(element),
        (target) => {
            stop()
            if (!target || typeof IntersectionObserver === "undefined") return
            observer = new IntersectionObserver((entries) => {
                const latest = entries.at(-1)
                if (latest) isVisible.value = latest.isIntersecting
            })
            observer.observe(target)
        },
        { immediate: true, flush: "post" },
    )

    onBeforeUnmount(stop)

    return isVisible
}
