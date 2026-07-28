import { autoUpdate, computePosition, type MiddlewareData, type Placement, type Strategy } from "@floating-ui/dom"
import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue"

import { normalizeFloatingBoolean, normalizeFloatingPlacement, normalizeFloatingStrategy, resolveFloatingValue } from "./shared"

import type { RFloatingPositionOptions, RFloatingPositionState } from "./types"

export function useFloatingPosition(
    reference: Ref<HTMLElement | null>,
    floating: Ref<HTMLElement | null>,
    options: RFloatingPositionOptions = {},
): RFloatingPositionState {
    const placement = ref<Placement>(resolveFloatingValue(options.placement, "bottom"))
    const strategy = ref<Strategy>(resolveFloatingValue(options.strategy, "absolute"))
    const middlewareData = ref<MiddlewareData>({})
    const x = ref(0)
    const y = ref(0)
    const isPositioned = ref(false)

    const resolvedOpen = normalizeFloatingBoolean(options.open, true)
    const resolvedPlacement = normalizeFloatingPlacement(options.placement)
    const resolvedStrategy = normalizeFloatingStrategy(options.strategy)

    let cleanup: (() => void) | null = null

    async function update() {
        const referenceElement = reference.value
        const floatingElement = floating.value

        if (!referenceElement || !floatingElement || !resolvedOpen.value) {
            isPositioned.value = false
            return
        }

        const result = await computePosition(referenceElement, floatingElement, {
            middleware: resolveFloatingValue(options.middleware, []),
            placement: resolvedPlacement.value as Placement,
            strategy: resolvedStrategy.value as Strategy,
        })

        x.value = result.x
        y.value = result.y
        placement.value = result.placement
        strategy.value = result.strategy
        middlewareData.value = result.middlewareData
        isPositioned.value = true
    }

    function stopAutoUpdate() {
        if (cleanup) {
            cleanup()
            cleanup = null
        }
    }

    function startAutoUpdate() {
        stopAutoUpdate()

        const referenceElement = reference.value
        const floatingElement = floating.value
        if (!referenceElement || !floatingElement || !resolvedOpen.value) {
            isPositioned.value = false
            return
        }

        cleanup = autoUpdate(referenceElement, floatingElement, () => {
            void update()
        })

        void update()
    }

    watch(
        [reference, floating, resolvedOpen, resolvedPlacement, resolvedStrategy],
        () => {
            startAutoUpdate()
        },
        { immediate: true, flush: "post" },
    )

    onBeforeUnmount(() => {
        stopAutoUpdate()
    })

    const floatingStyles = computed(() => ({
        left: `${x.value}px`,
        position: strategy.value,
        top: `${y.value}px`,
    }))

    return {
        floatingStyles,
        isPositioned,
        middlewareData,
        placement,
        strategy,
        update,
        x,
        y,
    }
}
