<script setup lang="ts">
import { arrow, flip, offset, shift, type Middleware } from "@floating-ui/dom"
import { computed, nextTick, onMounted, ref, watch } from "vue"

import { RTeleport, useFloatingPosition } from "@/foundations/floating"

type RSliderValueIndicatorProps = {
    enterDuration: string
    exitDuration: string
    open: boolean
    pointerSize: string
    positionRevision: string
    reference: HTMLElement | null
    textColor: string
    thumbGap: string
    value: string
    valueIndicatorColor: string
}

const props = defineProps<RSliderValueIndicatorProps>()

const indicatorOffset = computed(() => {
    const pointerSize = Number.parseFloat(props.pointerSize)
    const thumbGap = Number.parseFloat(props.thumbGap)
    return (Number.isFinite(pointerSize) ? pointerSize : 6) + (Number.isFinite(thumbGap) ? thumbGap : 4)
})

const arrowRef = ref<HTMLElement | null>(null)
const indicatorMiddleware = computed<Middleware[]>(() => [
    offset(indicatorOffset.value),
    flip(),
    shift({ padding: 4 }),
    ...(arrowRef.value ? [arrow({ element: arrowRef.value })] : []),
])
const floatingRef = ref<HTMLElement | null>(null)

const position = useFloatingPosition(
    computed(() => props.reference),
    floatingRef,
    {
        middleware: indicatorMiddleware,
        open: computed(() => props.open && !!props.reference),
        placement: "top",
        strategy: "fixed",
    },
)
const floatingStyles = computed(() => ({
    "--rui-comp-slider-value-indicator-color": props.valueIndicatorColor,
    "--rui-comp-slider-value-indicator-enter-duration": props.enterDuration,
    "--rui-comp-slider-value-indicator-exit-duration": props.exitDuration,
    "--rui-comp-slider-value-indicator-pointer-size": props.pointerSize,
    "--rui-comp-slider-value-indicator-thumb-gap": props.thumbGap,
    "--rui-comp-slider-value-indicator-text-color": props.textColor,
    ...position.floatingStyles.value,
}))
const isBottomPlacement = computed(() => position.placement.value.startsWith("bottom"))
const isPositioned = computed(() => position.isPositioned.value)
const arrowStyles = computed(() => {
    const { x, y } = position.middlewareData.value.arrow ?? {}
    return {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
    }
})

watch(
    [() => props.positionRevision, arrowRef, indicatorOffset],
    async () => {
        await nextTick()
        void position.update()
    },
    { flush: "post" },
)

onMounted(() => {
    void nextTick(() => position.update())
})
</script>

<template>
    <RTeleport portal="docked">
        <span
            ref="floatingRef"
            class="rui-slider-value-indicator"
            :class="{
                'rui-slider-value-indicator--bottom': isBottomPlacement,
                'rui-slider-value-indicator--positioned': isPositioned,
                'rui-slider-value-indicator--visible': open,
            }"
            :style="floatingStyles"
        >
            {{ value }}
            <span ref="arrowRef" class="rui-slider-value-indicator__arrow" :style="arrowStyles" />
        </span>
    </RTeleport>
</template>

<style scoped lang="scss">
.rui-slider-value-indicator {
    --rui-comp-slider-value-indicator-color: var(
        --rui-comp-plain-tooltip-background-color,
        color-mix(
            in srgb,
            color-mix(in srgb, var(--rui-sys-color-background) 60%, transparent),
            color-mix(in srgb, var(--rui-sys-color-on-background) 90%, transparent)
        )
    );
    --rui-comp-slider-value-indicator-text-color: var(--rui-sys-color-on-primary);
    --rui-comp-slider-value-indicator-enter-duration: 83ms;
    --rui-comp-slider-value-indicator-exit-duration: 117ms;
    --rui-comp-slider-value-indicator-pointer-size: 6px;

    z-index: 2500;
    padding: 8px 12px;
    border-radius: 4px;
    color: var(--rui-comp-slider-value-indicator-text-color);
    background: var(--rui-comp-slider-value-indicator-color);
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    user-select: none;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: scale(0.8);
    transform-origin: center bottom;
    transition:
        opacity var(--rui-comp-slider-value-indicator-exit-duration) var(--rui-sys-motion-easing-accelerated),
        transform var(--rui-comp-slider-value-indicator-exit-duration) var(--rui-sys-motion-easing-accelerated);

    .rui-slider-value-indicator__arrow {
        position: absolute;
        inset-block-start: 100%;
        inline-size: 0;
        block-size: 0;
        border: var(--rui-comp-slider-value-indicator-pointer-size) solid transparent;
        border-block-start-color: var(--rui-comp-slider-value-indicator-color);
    }

    &--bottom {
        transform-origin: center top;

        .rui-slider-value-indicator__arrow {
            inset-block-start: auto;
            inset-block-end: 100%;
            border-block-start-color: transparent;
            border-block-end-color: var(--rui-comp-slider-value-indicator-color);
        }
    }

    &--positioned {
        visibility: visible;
    }

    &--visible {
        opacity: 1;
        transform: scale(1);
        transition-duration: var(--rui-comp-slider-value-indicator-enter-duration);
        transition-timing-function: var(--rui-sys-motion-easing-decelerated);
    }
}

@media (prefers-reduced-motion: reduce) {
    .rui-slider-value-indicator {
        transition-duration: 0ms !important;
    }
}
</style>
