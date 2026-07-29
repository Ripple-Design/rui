<script setup lang="ts">
import { computed, provide, ref, useAttrs, watchEffect } from "vue"

import { selectionModelKey, useSelectionModel } from "@/foundations/selectionModel"
import { useResizeObserver } from "@/utils/useResizeObserver"

import type { RTabBarProps } from "./types"

const props = withDefaults(defineProps<RTabBarProps>(), {
    variant: "secondary",
    fullWidth: false,
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const rootRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const selection = useSelectionModel(model, { variant: props.variant })
const classes = computed(() => [
    "rui-tab-bar",
    `rui-tab-bar--${props.variant}`,
    { "rui-tab-bar--full-width": props.fullWidth },
])
const activeElement = computed(() => selection.selectedItem.value?.state.element ?? null)

provide(selectionModelKey, selection)

function resolvePrimaryIndicatorMetrics(root: HTMLElement, element: HTMLElement) {
    const content = element.querySelector<HTMLElement>(".rui-tab__content")
    if (!content) {
        return resolveSecondaryIndicatorMetrics(root, element)
    }

    const rootRect = root.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const inset = 2

    return {
        left: contentRect.left - rootRect.left + root.scrollLeft + inset,
        width: Math.max(24, contentRect.width - inset * 2),
    }
}

function resolveSecondaryIndicatorMetrics(root: HTMLElement, element: HTMLElement) {
    const rootRect = root.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return {
        left: elementRect.left - rootRect.left + root.scrollLeft,
        width: elementRect.width,
    }
}

function resolveScrollMetrics(root: HTMLElement, element: HTMLElement) {
    const rootRect = root.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return {
        left: elementRect.left - rootRect.left + root.scrollLeft,
        width: elementRect.width,
    }
}

function syncIndicator() {
    const root = rootRef.value
    const indicator = indicatorRef.value
    const element = activeElement.value

    if (!root || !indicator || !element) {
        if (indicator) {
            indicator.style.transform = "translateX(0px)"
            indicator.style.width = "0px"
        }

        return
    }

    const indicatorMetrics =
        props.variant === "primary"
            ? resolvePrimaryIndicatorMetrics(root, element)
            : resolveSecondaryIndicatorMetrics(root, element)
    const scrollMetrics = resolveScrollMetrics(root, element)
    const visibleLeft = root.scrollLeft
    const visibleRight = visibleLeft + root.clientWidth
    const scrollRight = scrollMetrics.left + scrollMetrics.width

    if (scrollMetrics.left < visibleLeft) {
        root.scrollTo({ left: scrollMetrics.left, behavior: "smooth" })
    } else if (scrollRight > visibleRight) {
        root.scrollTo({ left: scrollRight - root.clientWidth, behavior: "smooth" })
    }

    indicator.style.transform = `translateX(${indicatorMetrics.left}px)`
    indicator.style.width = `${indicatorMetrics.width}px`
}

watchEffect(
    () => {
        syncIndicator()
    },
    { flush: "post" },
)

useResizeObserver(rootRef, syncIndicator)
useResizeObserver(activeElement, syncIndicator)
</script>

<template>
    <div v-bind="attrs" ref="rootRef" :class="classes">
        <div class="rui-tab-bar__indicator" ref="indicatorRef" aria-hidden="true" />
        <slot />
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/motion";

.rui-tab-bar {
    position: relative;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: stretch;
    gap: 0;
    scrollbar-width: none;

    &::after {
        content: "";
        position: absolute;
        inset-inline: 0;
        inset-block-end: 0;
        block-size: 1px;
        background-color: var(--rui-sys-color-on-surface-outline);
        pointer-events: none;
    }

    &::-webkit-scrollbar {
        display: none;
    }

    &--primary .rui-tab-bar__indicator {
        block-size: 3px;
        border-radius: 3px 3px 0 0;
    }

    &--full-width > :deep(.rui-tab) {
        flex: 1 1 0;
        min-width: 0;
        width: 100%;
    }
}

.rui-tab-bar__indicator {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    block-size: 2px;
    background: color.$primary;
    transition:
        transform motion.$duration-medium-out motion.$easing-standard,
        width motion.$duration-medium-out motion.$easing-standard;
    will-change: transform, width;
    pointer-events: none;
}
</style>
