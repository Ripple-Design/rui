import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from "vue"

import type { RDataTableFlatItem, RDataTableSelectItemKey } from "../components/dataTable/types"
import { getPropertyFromItem } from "../utils/value"
import { clamp } from "../utils/value"

const buffer = 100

function resolveVirtualKey<T>(entry: RDataTableFlatItem<T>, itemKey: RDataTableSelectItemKey<T> | null | undefined, fallback: number) {
    if (entry.type === "item") return getPropertyFromItem(entry.raw, itemKey, entry.key ?? fallback)
    return `${entry.type}-${entry.id}`
}

export function useDataTableVirtual<T>(props: { itemHeight?: number | string | null; itemKey?: RDataTableSelectItemKey<T> | null; height?: number | string }, items: Ref<readonly RDataTableFlatItem<T>[]>) {
    const containerRef = ref<HTMLElement | null>(null)
    const markerRef = ref<HTMLElement | null>(null)
    const first = ref(0)
    const last = ref(1)
    const paddingTop = ref(0)
    const paddingBottom = ref(0)
    const itemHeight = ref(Number.parseFloat(String(props.itemHeight ?? 0)) || 56)
    const sizes = ref<number[]>([])
    const viewportHeight = ref(0)
    const hasInitialRender = computed(() => !!(containerRef.value && markerRef.value && viewportHeight.value && itemHeight.value))
    let observer: ResizeObserver | undefined
    let frame = 0
    let targetScrollIndex = -1

    function offsets() { const result = [0]; for (let index = 0; index < items.value.length; index += 1) result.push(result[index]! + (sizes.value[index] ?? itemHeight.value)); return result }
    function indexAt(offset: number) { const values = offsets(); let low = 0; let high = values.length - 1; while (low <= high) { const middle = (low + high) >> 1; if (values[middle]! <= offset) low = middle + 1; else high = middle - 1 } return clamp(high, 0, items.value.length) }
    function applyVisibleRange(scrollTop: number) {
        const start = indexAt(Math.max(0, scrollTop - buffer))
        const end = clamp(indexAt(scrollTop + viewportHeight.value + buffer) + 1, start + 1, items.value.length)
        first.value = start
        last.value = end
        const values = offsets()
        paddingTop.value = values[start] ?? 0
        paddingBottom.value = (values.at(-1) ?? 0) - (values[end] ?? 0)
    }
    function calculateVisibleItems() {
        if (typeof window === "undefined") return
        if (frame) window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(() => {
            frame = 0
            const element = containerRef.value
            if (element) applyVisibleRange(element.scrollTop)
        })
    }
    function handleItemResize(index: number, height: number) {
        if (height > 0 && sizes.value[index] !== height) {
            sizes.value[index] = height
            calculateVisibleItems()
        }
    }
    function handleScroll() { calculateVisibleItems() }
    function scrollToIndex(index: number) {
        const target = clamp(index, 0, items.value.length)
        const targetOffset = offsets()[target] ?? 0
        const element = containerRef.value
        if (!element || (target && !targetOffset)) {
            targetScrollIndex = target
            return
        }
        element.scrollTop = targetOffset
    }

    const stopInitialRenderWatch = watch(hasInitialRender, ready => {
        if (!ready) return
        stopInitialRenderWatch()
        calculateVisibleItems()
        if (targetScrollIndex < 0) return
        nextTick(() => {
            if (typeof window === "undefined") return
            window.requestAnimationFrame(() => {
                if (targetScrollIndex < 0) return
                scrollToIndex(targetScrollIndex)
                targetScrollIndex = -1
            })
        })
    })

    const computedItems = computed(() => items.value.slice(first.value, last.value).map((raw, offset) => {
        const index = offset + first.value
        return { raw, index, key: resolveVirtualKey(raw, props.itemKey, index) }
    }))
    watch(() => props.itemHeight, value => { itemHeight.value = Number.parseFloat(String(value ?? 0)) || 56; calculateVisibleItems() })
    watch([items, containerRef], () => { sizes.value = Array.from({ length: items.value.length }); calculateVisibleItems() }, { deep: false, immediate: true })
    watch(containerRef, element => {
        observer?.disconnect()
        if (!element) {
            viewportHeight.value = 0
            return
        }
        if (typeof ResizeObserver === "undefined") throw new Error("RDataTableVirtual requires ResizeObserver")
        const container = element
        function updateViewportHeight() {
            viewportHeight.value = Math.max(0, container.clientHeight)
            calculateVisibleItems()
        }
        updateViewportHeight()
        observer = new ResizeObserver(() => updateViewportHeight())
        observer.observe(container)
    }, { flush: "post" })
    onBeforeUnmount(() => { observer?.disconnect(); if (typeof window !== "undefined" && frame) window.cancelAnimationFrame(frame) })
    return { containerRef, markerRef, computedItems, itemHeight, paddingTop, paddingBottom, calculateVisibleItems, handleItemResize, handleScroll, scrollToIndex }
}
