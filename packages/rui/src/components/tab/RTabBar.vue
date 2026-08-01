<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, useAttrs, watchEffect } from "vue"

import { selectionModelKey, useSelectionModel } from "@/foundations/selectionModel"
import { useResizeObserver } from "@/utils/useResizeObserver"

import { tabBarKey } from "./context"
import type { RTabBarProps } from "./types"

const props = withDefaults(defineProps<RTabBarProps>(), {
    variant: "secondary",
    fullWidth: false,
    iconLayout: "vertical",
    color: "primary",
    divider: true,
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const rootRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const indicatorReady = ref(false)
const selection = useSelectionModel(model, { variant: props.variant })
const resolvedColor = computed(() => props.color ?? "primary")
const resolvedIconLayout = computed(() => props.iconLayout ?? "vertical")
const classes = computed(() => [
    "rui-tab-bar",
    `rui-tab-bar--${props.variant}`,
    `rui-tab-bar--color-${resolvedColor.value}`,
    `rui-tab-bar--icon-${resolvedIconLayout.value}`,
    { "rui-tab-bar--full-width": props.fullWidth },
])
const activeElement = computed(() => selection.selectedItem.value?.state.element ?? null)
let indicatorReadyFrame: number | null = null

provide(selectionModelKey, selection)
provide(tabBarKey, {
    color: resolvedColor,
    iconLayout: resolvedIconLayout,
})

function cancelIndicatorReadyFrame() {
    if (indicatorReadyFrame == null) {
        return
    }

    cancelAnimationFrame(indicatorReadyFrame)
    indicatorReadyFrame = null
}

function scheduleIndicatorReady() {
    if (indicatorReady.value || indicatorReadyFrame != null) {
        return
    }

    indicatorReadyFrame = requestAnimationFrame(() => {
        indicatorReadyFrame = null
        indicatorReady.value = true
    })
}

function resolvePrimaryIndicatorMetrics(root: HTMLElement, element: HTMLElement) {
    const content = element.querySelector<HTMLElement>(".rui-tab__content")
    if (!content) {
        return resolveSecondaryIndicatorMetrics(root, element)
    }

    const rootRect = root.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const inset = 2
    const width = Math.max(24, contentRect.width - inset * 2)

    return {
        left: contentRect.left - rootRect.left + root.scrollLeft + (contentRect.width - width) / 2,
        width,
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
    const scroller = scrollerRef.value
    const content = contentRef.value
    const indicator = indicatorRef.value
    const element = activeElement.value

    if (!scroller || !content || !indicator || !element) {
        cancelIndicatorReadyFrame()

        if (indicator && !indicatorReady.value) {
            indicator.style.transform = "translateX(0px)"
            indicator.style.width = "0px"
        }

        return
    }

    const indicatorMetrics =
        props.variant === "primary"
            ? resolvePrimaryIndicatorMetrics(scroller, element)
            : resolveSecondaryIndicatorMetrics(scroller, element)
    const scrollMetrics = resolveScrollMetrics(scroller, element)
    const maxScrollLeft = Math.max(0, content.offsetWidth - scroller.clientWidth)
    const targetScrollLeft = Math.max(
        0,
        Math.min(scrollMetrics.left + scrollMetrics.width / 2 - scroller.clientWidth / 2, maxScrollLeft),
    )

    if (Math.abs(targetScrollLeft - scroller.scrollLeft) > 1) {
        scroller.scrollTo({ left: targetScrollLeft, behavior: "smooth" })
    }

    indicator.style.transform = `translateX(${indicatorMetrics.left}px)`
    indicator.style.width = `${indicatorMetrics.width}px`
    scheduleIndicatorReady()
}

watchEffect(
    () => {
        syncIndicator()
    },
    { flush: "post" },
)

useResizeObserver(rootRef, syncIndicator)
useResizeObserver(scrollerRef, syncIndicator)
useResizeObserver(activeElement, syncIndicator)

onBeforeUnmount(() => {
    cancelIndicatorReadyFrame()
})
</script>

<template>
    <div v-bind="attrs" ref="rootRef" :class="classes">
        <div v-if="divider" class="rui-tab-bar__divider" aria-hidden="true" />
        <div class="rui-tab-bar__scroller" ref="scrollerRef">
            <div
                ref="indicatorRef"
                :class="[
                    'rui-tab-bar__indicator',
                    { 'rui-tab-bar__indicator--ready': indicatorReady },
                ]"
                aria-hidden="true"
            />
            <div class="rui-tab-bar__content" ref="contentRef">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/motion";

.rui-tab-bar {
    --rui-comp-tab-bar-color: #{color.$on-surface-medium};
    --rui-comp-tab-bar-selected-color: #{color.$primary};
    --rui-comp-tab-bar-divider-color: #{color.$on-surface-outline};

    position: relative;

    &--color-primary {
        --rui-comp-tab-bar-color: #{color.$on-surface-medium};
        --rui-comp-tab-bar-selected-color: #{color.$primary};
        --rui-comp-tab-bar-divider-color: #{color.$on-surface-outline};
    }

    &--color-secondary {
        --rui-comp-tab-bar-color: #{color.$on-surface-medium};
        --rui-comp-tab-bar-selected-color: #{color.$secondary};
        --rui-comp-tab-bar-divider-color: #{color.$on-surface-outline};
    }

    &--color-on-primary {
        --rui-comp-tab-bar-color: #{color.$on-primary-medium};
        --rui-comp-tab-bar-selected-color: #{color.$on-primary};
        --rui-comp-tab-bar-divider-color: #{color.$on-primary-outline};
    }

    &--color-on-secondary {
        --rui-comp-tab-bar-color: #{color.$on-secondary-medium};
        --rui-comp-tab-bar-selected-color: #{color.$on-secondary};
        --rui-comp-tab-bar-divider-color: #{color.$on-secondary-outline};
    }
}

.rui-tab-bar__divider {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    block-size: 1px;
    background-color: var(--rui-comp-tab-bar-divider-color);
    pointer-events: none;
}

.rui-tab-bar__scroller {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.rui-tab-bar--primary .rui-tab-bar__indicator {
    block-size: 3px;
    border-radius: 3px 3px 0 0;
}

.rui-tab-bar--full-width > .rui-tab-bar__scroller > .rui-tab-bar__content > :deep(.rui-tab) {
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
}

.rui-tab-bar--full-width .rui-tab-bar__content {
    width: 100%;
    min-width: 0;
}

.rui-tab-bar__content {
    display: flex;
    width: max-content;
    min-width: 100%;
}

.rui-tab-bar__indicator {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    block-size: 2px;
    background: var(--rui-comp-tab-bar-selected-color);
    will-change: transform, width;
    pointer-events: none;

    &--ready {
        transition:
            transform motion.$duration-medium-out motion.$easing-standard,
            width motion.$duration-medium-out motion.$easing-standard;
    }
}
</style>
