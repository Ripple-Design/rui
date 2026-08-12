import type { MaybeRefOrGetter, WritableComputedRef } from "vue"
import { computed, onBeforeUnmount, reactive, shallowRef, toValue, watch } from "vue"

export interface UseScrollOptions {
    throttle?: number
    idle?: number
    offset?: {
        left?: number
        right?: number
        top?: number
        bottom?: number
    }
    observe?: boolean | { mutation?: boolean }
    onScroll?: (event: Event) => void
    onStop?: (event: Event) => void
    eventListenerOptions?: boolean | AddEventListenerOptions
    behavior?: MaybeRefOrGetter<ScrollBehavior>
    window?: Window
    onError?: (error: unknown) => void
}

export interface UseScrollReturn {
    x: WritableComputedRef<number>
    y: WritableComputedRef<number>
    isScrolling: ReturnType<typeof shallowRef<boolean>>
    arrivedState: {
        left: boolean
        right: boolean
        top: boolean
        bottom: boolean
    }
    directions: {
        left: boolean
        right: boolean
        top: boolean
        bottom: boolean
    }
    measure: () => void
}

type ScrollElement = HTMLElement | SVGElement | Window | Document | null | undefined

const ARRIVED_STATE_THRESHOLD_PIXELS = 1

function resolveScrollElement(target: ScrollElement): HTMLElement | SVGElement | null {
    if (!target) return null
    if (typeof Window !== "undefined" && target instanceof Window) return target.document.documentElement
    if (typeof Document !== "undefined" && target instanceof Document) return target.documentElement
    return target as HTMLElement | SVGElement
}

function isDocument(target: ScrollElement): target is Document {
    return typeof Document !== "undefined" && target instanceof Document
}

function isWindow(target: ScrollElement): target is Window {
    return typeof Window !== "undefined" && target instanceof Window
}

function getWindow(target: ScrollElement, configured?: Window) {
    if (configured) return configured
    if (typeof window !== "undefined") return window
    if (typeof target !== "undefined" && target && "window" in target) {
        return (target as Window).window
    }
    return undefined
}

function addListener(target: ScrollElement, type: string, handler: EventListener, options: boolean | AddEventListenerOptions, cleanup: Array<() => void>) {
    if (!target || typeof target.addEventListener !== "function") return
    target.addEventListener(type, handler, options)
    cleanup.push(() => target.removeEventListener(type, handler, options))
}

function createDebounce(callback: (event: Event) => void, delay: number) {
    let timer: ReturnType<typeof setTimeout> | undefined
    return {
        run(event: Event) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                timer = undefined
                callback(event)
            }, delay)
        },
        stop() {
            if (timer) clearTimeout(timer)
            timer = undefined
        },
    }
}

export function useScroll(
    element: MaybeRefOrGetter<ScrollElement>,
    options: UseScrollOptions = {},
): UseScrollReturn {
    const {
        throttle = 0,
        idle = 200,
        offset = {},
        onScroll = () => undefined,
        onStop = () => undefined,
        eventListenerOptions = { capture: false, passive: true },
        behavior = "auto",
        onError = (error) => console.error(error),
    } = options
    const browserWindow = getWindow(toValue(element), options.window)
    const internalX = shallowRef(0)
    const internalY = shallowRef(0)
    const arrivedState = reactive({ left: true, right: false, top: true, bottom: false })
    const directions = reactive({ left: false, right: false, top: false, bottom: false })
    const isScrolling = shallowRef(false)
    const cleanups: Array<() => void> = []
    const scrollEnd = createDebounce((event) => {
        if (!isScrolling.value) return
        isScrolling.value = false
        directions.left = false
        directions.right = false
        directions.top = false
        directions.bottom = false
        onStop(event)
    }, throttle + idle)

    function scrollTo(x: number | undefined, y: number | undefined) {
        const target = toValue(element)
        if (!browserWindow || !target) return
        const scrollTarget = isDocument(target) ? browserWindow.document.body : target
        if (!scrollTarget || typeof scrollTarget.scrollTo !== "function") return
        scrollTarget.scrollTo({ left: x ?? internalX.value, top: y ?? internalY.value, behavior: toValue(behavior) })
    }

    const x = computed({ get: () => internalX.value, set: (value) => scrollTo(value, undefined) })
    const y = computed({ get: () => internalY.value, set: (value) => scrollTo(undefined, value) })

    function measureTarget(target: ScrollElement) {
        if (!browserWindow || !target) return
        const el = resolveScrollElement(target)
        if (!el) return
        const styles = browserWindow.getComputedStyle(el)
        const multiplier = styles.direction === "rtl" ? -1 : 1
        const scrollLeft = el.scrollLeft
        const left = Math.abs(scrollLeft * multiplier) <= (offset.left || 0)
        const right = Math.abs(scrollLeft * multiplier) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS
        if (styles.display === "flex" && styles.flexDirection === "row-reverse") {
            arrivedState.left = right
            arrivedState.right = left
        } else {
            arrivedState.left = left
            arrivedState.right = right
        }
        directions.left = scrollLeft < internalX.value
        directions.right = scrollLeft > internalX.value
        internalX.value = scrollLeft

        let scrollTop = el.scrollTop
        if (target === browserWindow.document && !scrollTop) scrollTop = browserWindow.document.body.scrollTop
        const top = Math.abs(scrollTop) <= (offset.top || 0)
        const bottom = Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS
        if (styles.display === "flex" && styles.flexDirection === "column-reverse") {
            arrivedState.top = bottom
            arrivedState.bottom = top
        } else {
            arrivedState.top = top
            arrivedState.bottom = bottom
        }
        directions.top = scrollTop < internalY.value
        directions.bottom = scrollTop > internalY.value
        internalY.value = scrollTop
    }

    function onScrollHandler(event: Event) {
        try {
            const target = event.target as Document | null
            measureTarget(target?.documentElement ?? (event.target as ScrollElement))
            isScrolling.value = true
            scrollEnd.run(event)
            onScroll(event)
        } catch (error) {
            onError(error)
        }
    }

    const handler = throttle > 0 ? (() => {
        let timer: ReturnType<typeof setTimeout> | undefined
        let pending: Event | undefined
        return (event: Event) => {
            pending = event
            if (timer) return
            onScrollHandler(event)
            timer = setTimeout(() => {
                timer = undefined
                if (pending) onScrollHandler(pending)
                pending = undefined
            }, throttle)
        }
    })() : onScrollHandler

    const observe = typeof options.observe === "boolean" ? options.observe : options.observe?.mutation
    let mutationObserver: MutationObserver | undefined

    function detach() {
        scrollEnd.stop()
        mutationObserver?.disconnect()
        mutationObserver = undefined
        cleanups.splice(0).forEach((cleanup) => cleanup())
    }

    function attach(target: ScrollElement) {
        detach()
        if (!target) return
        addListener(target, "scroll", handler, eventListenerOptions, cleanups)
        addListener(target, "scrollend", (event) => {
            scrollEnd.stop()
            onStop(event)
        }, eventListenerOptions, cleanups)
        if (observe && !isWindow(target) && !isDocument(target) && typeof MutationObserver !== "undefined") {
            mutationObserver = new MutationObserver(() => measureTarget(toValue(element)))
            mutationObserver.observe(target, { attributes: true, childList: true, subtree: true })
        }
    }

    watch(
        () => toValue(element),
        (target) => {
            attach(target)
            try {
                measureTarget(target)
            } catch (error) {
                onError(error)
            }
        },
        { immediate: true, flush: "post" },
    )

    onBeforeUnmount(detach)

    return { x, y, isScrolling, arrivedState, directions, measure: () => measureTarget(toValue(element)) }
}

export type { ScrollElement }
