import type { MaybeRefOrGetter, ComputedRef, UnwrapNestedRefs } from "vue"
import { computed, nextTick, reactive, shallowRef, toValue, watch } from "vue"

import { useElementVisibility } from "./useElementVisibility"
import { useScroll, type ScrollElement, type UseScrollOptions, type UseScrollReturn } from "./useScroll"

export type InfiniteScrollElement = ScrollElement

export interface UseInfiniteScrollOptions<T extends InfiniteScrollElement = InfiniteScrollElement> extends UseScrollOptions {
    distance?: number
    direction?: "top" | "bottom" | "left" | "right"
    interval?: number
    canLoadMore?: (element: T) => boolean
}

export interface UseInfiniteScrollReturn {
    isLoading: ComputedRef<boolean>
    reset: () => void
}

function resolveElement(element: InfiniteScrollElement): HTMLElement | SVGElement | null | undefined {
    if (!element) return element
    if (typeof Window !== "undefined" && element instanceof Window) return element.document.documentElement
    if (typeof Document !== "undefined" && element instanceof Document) return element.documentElement
    return element as HTMLElement | SVGElement
}

export function useInfiniteScroll<T extends InfiniteScrollElement>(
    element: MaybeRefOrGetter<T>,
    onLoadMore: (state: UnwrapNestedRefs<UseScrollReturn>) => void | Promise<void>,
    options: UseInfiniteScrollOptions<T> = {},
): UseInfiniteScrollReturn {
    const direction = options.direction ?? "bottom"
    const interval = options.interval ?? 100
    const canLoadMore = options.canLoadMore ?? (() => true)
    const state = reactive(useScroll(element, {
        ...options,
        offset: {
            [direction]: options.distance ?? 0,
            ...options.offset,
        },
    })) as UnwrapNestedRefs<UseScrollReturn>
    const promise = shallowRef<Promise<unknown> | null>(null)
    const isLoading = computed(() => promise.value !== null)
    const observedElement = computed(() => resolveElement(toValue(element)))
    const isElementVisible = useElementVisibility(observedElement)
    const canLoad = computed(() => {
        if (!observedElement.value) return false
        return canLoadMore(observedElement.value as T)
    })

    function checkAndLoad() {
        state.measure()
        const target = observedElement.value
        if (!target || !isElementVisible.value || !canLoad.value || promise.value) return
        const { scrollHeight, clientHeight, scrollWidth, clientWidth } = target as HTMLElement
        const isNarrower = direction === "bottom" || direction === "top"
            ? scrollHeight <= clientHeight
            : scrollWidth <= clientWidth
        if (!state.arrivedState[direction] && !isNarrower) return

        promise.value = Promise.all([
            onLoadMore(state),
            new Promise<void>((resolve) => setTimeout(resolve, interval)),
        ]).finally(() => {
            promise.value = null
            nextTick(checkAndLoad)
        })
    }

    watch(
        () => [state.arrivedState[direction], isElementVisible.value, canLoad.value],
        checkAndLoad,
        { immediate: true, flush: "post" },
    )

    return {
        isLoading,
        reset: () => nextTick(checkAndLoad),
    }
}

export type { UseScrollOptions, UseScrollReturn }
