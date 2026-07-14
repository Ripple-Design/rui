import { onUnmounted, watch, type Ref } from "vue"

export function useResizeObserver(target: Ref<HTMLElement | null>, callback: (entry: ResizeObserverEntry) => void) {
    let observer: ResizeObserver | null = null

    const stop = () => {
        if (observer) {
            observer.disconnect()
            observer = null
        }
    }

    watch(
        () => target.value,
        (el) => {
            stop()
            if (el) {
                observer = new ResizeObserver((entries) => {
                    if (entries[0]) callback(entries[0])
                })
                observer.observe(el)
            }
        },
        { immediate: true, flush: "post" },
    )

    onUnmounted(stop)

    return { stop }
}
