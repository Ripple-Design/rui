<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, provide, ref, watchEffect } from "vue"

import { scaffoldContextKey } from "@/components/layout/scaffold/context.ts"

import type { RAppBarContainerProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"
import RResponsiveContainer from "../../layout/responsive/RResponsiveContainer.vue"
import { appBarContextKey } from "./context.ts"
import { useAppBarScroll } from "./useAppBarScroll.ts"

const props = withDefaults(defineProps<RAppBarContainerProps>(), {
    contentAlign: "full-width",
    color: "surface",
    scrollBehavior: "fixed",
    snap: false,
    snapMargins: false,
    liftOnScroll: false,
    hideOnScroll: false,
    underlap: false,
})

const scaffold = inject(scaffoldContextKey, null)
const viewport = ref<HTMLElement | null>(null)
const isCollapsingLayout = ref(false)
let layoutObserver: MutationObserver | null = null
// Slot components keep their owner's injection scope, so the DOM marker is the reliable parent signal.
function updateLayoutMode() {
    const next = Boolean(viewport.value?.querySelector(".rui-collapsing-app-bar"))
    if (next === isCollapsingLayout.value) return
    isCollapsingLayout.value = next
}
const topInsetHandle = scaffold?.registerTopInset()
const contentMode = computed(() => {
    if (props.contentAlign === "body") return scaffold?.bodyGridMode.value ?? "centered"
    return props.contentAlign
})
const effectiveScrollBehavior = computed(() => props.scrollBehavior)
const effectiveHideOnScroll = computed(() =>
    scaffold?.fabPlacement.value === "app-bar-seam" ? false : props.hideOnScroll,
)
const source = scaffold
    ? {
          direction: scaffold.scrollDirection,
          facts: scaffold.scrollFacts,
      }
    : null
const { state: scrollState, refresh } = useAppBarScroll({
    root: viewport,
    source,
    expandedHeight: computed(() => props.expandedHeight),
    collapsedHeight: computed(() => props.collapsedHeight),
    scrollBehavior: effectiveScrollBehavior,
    hideOnScroll: effectiveHideOnScroll,
    liftOnScroll: computed(() => props.liftOnScroll),
    collapsing: isCollapsingLayout,
})

provide(appBarContextKey, { scrollState })

const state = computed(() => scrollState.value.phase)
const classes = computed(() => [
    "rui-app-bar-container",
    `rui-app-bar-container--${state.value}`,
    {
        "rui-app-bar-container--layout-static": !isCollapsingLayout.value,
        "rui-app-bar-container--layout-collapsing": isCollapsingLayout.value,
        "rui-app-bar-container--underlap": props.underlap,
        "rui-app-bar-container--color-surface": props.color === "surface",
        "rui-app-bar-container--color-primary": props.color === "primary",
        "rui-app-bar-container--lifted": scrollState.value.lifted,
        "rui-app-bar-container--elevated": !props.liftOnScroll || scrollState.value.lifted,
    },
])
const style = computed(() => ({
    ...(props.expandedHeight !== undefined
        ? { "--rui-comp-app-bar-expanded-height": props.expandedHeight }
        : isCollapsingLayout.value && props.collapsedHeight !== undefined
          ? { "--rui-comp-app-bar-expanded-height": "var(--rui-comp-app-bar-collapsed-height)" }
          : {}),
    ...(props.collapsedHeight !== undefined ? { "--rui-comp-app-bar-collapsed-height": props.collapsedHeight } : {}),
    "--rui-comp-app-bar-background":
        props.color === "primary" ? "var(--rui-sys-color-primary)" : "var(--rui-sys-color-surface)",
    "--rui-comp-surface-background": "transparent",
    "--rui-comp-app-bar-collapse-offset": `${scrollState.value.collapseOffset}px`,
    "--rui-comp-app-bar-collapse-distance": `${scrollState.value.collapseDistance}px`,
    "--rui-comp-app-bar-collapse-progress": scrollState.value.collapseProgress,
    ...(scrollState.value.visibleHeight > 0
        ? { "--rui-comp-app-bar-visible-height": `${scrollState.value.visibleHeight}px` }
        : {}),
    "--rui-sys-scaffold-collapse-progress": scrollState.value.collapseProgress,
}))

watchEffect(() => topInsetHandle?.set(scrollState.value.visibleHeight))

onMounted(() => {
    updateLayoutMode()
    if (viewport.value && typeof MutationObserver !== "undefined") {
        layoutObserver = new MutationObserver(updateLayoutMode)
        layoutObserver.observe(viewport.value, { childList: true, subtree: true })
    }
    void nextTick(() => {
        updateLayoutMode()
        refresh()
    })
})

onUnmounted(() => {
    layoutObserver?.disconnect()
    layoutObserver = null
    topInsetHandle?.dispose()
})
</script>

<template>
    <RSurface
        as="header"
        :class="classes"
        :style="style"
        :color="color"
        :elevation="scrollState.lifted ? 4 : 0"
        :inert="state === 'hidden' ? '' : undefined"
        :aria-hidden="state === 'hidden' ? 'true' : undefined"
    >
        <div ref="viewport" class="rui-app-bar-container__viewport">
            <div class="rui-app-bar-container__collapsing-content">
                <component
                    :is="contentAlign === 'full-width' ? 'div' : RResponsiveContainer"
                    :mode="contentMode"
                    class="rui-app-bar-container__content"
                >
                    <slot />
                </component>
            </div>
            <div class="rui-app-bar-container__content-scrim" aria-hidden="true" />
        </div>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/breakpoints" as breakpoint;
@use "@/styles/elevations";

.rui-app-bar-container {
    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-end: 0;
    --rui-surface-shape-end-start: 0;
    --rui-comp-app-bar-expanded-height: 56px;
    --rui-comp-app-bar-collapsed-height: 56px;
    --rui-comp-app-bar-lift-duration: 150ms;
    --rui-comp-app-bar-scrim-duration: 600ms;
    position: sticky;
    z-index: 3;
    inset-block-start: 0;
    inline-size: 100%;
    box-sizing: border-box;
    // Static app bars stay in normal flow; collapsing layouts opt into overlay geometry below.
    block-size: auto;
    min-block-size: var(--rui-comp-app-bar-expanded-height);
    margin-block-end: 0;
    overflow-anchor: none;
    contain: none;
    box-shadow: none !important;
}

@include breakpoint.c-up(lg) {
    .rui-app-bar-container {
        --rui-comp-app-bar-expanded-height: 64px;
        --rui-comp-app-bar-collapsed-height: 64px;
    }
}

.rui-app-bar-container--layout-collapsing,
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar)) {
    block-size: var(--rui-comp-app-bar-expanded-height);
    margin-block-end: calc(-1 * var(--rui-comp-app-bar-expanded-height));
    contain: layout;
}

.rui-app-bar-container::after {
    position: absolute;
    z-index: 0;
    inset-inline: 0;
    inset-block-start: 0;
    block-size: var(--rui-comp-app-bar-visible-height, var(--rui-comp-app-bar-expanded-height));
    clip-path: inset(0 0 -24px);
    box-shadow: none;
    content: "";
    pointer-events: none;
}

.rui-app-bar-container--elevated::after {
    box-shadow: elevations.shadow(4);
}

.rui-app-bar-container--lifted::after {
    transition: box-shadow var(--rui-comp-app-bar-lift-duration) linear;
}

.rui-app-bar-container__viewport {
    position: relative;
    block-size: auto;
    min-block-size: var(--rui-comp-app-bar-expanded-height);
    overflow: visible;
    background: var(--rui-comp-app-bar-background);
    will-change: auto;
}

.rui-app-bar-container__collapsing-content {
    position: static;
    inset: auto;
    overflow: visible;
}

.rui-app-bar-container__content {
    block-size: auto;
    min-block-size: auto;
}

.rui-app-bar-container--layout-collapsing .rui-app-bar-container__viewport,
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar)) .rui-app-bar-container__viewport {
    block-size: var(--rui-comp-app-bar-visible-height, var(--rui-comp-app-bar-expanded-height));
    min-block-size: 0;
    overflow: hidden;
    will-change: block-size;
}

.rui-app-bar-container--layout-collapsing .rui-app-bar-container__collapsing-content,
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar)) .rui-app-bar-container__collapsing-content {
    position: absolute;
    inset: 0;
    overflow: visible;
}

.rui-app-bar-container--layout-collapsing .rui-app-bar-container__content,
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar)) .rui-app-bar-container__content {
    block-size: 100%;
    min-block-size: 0;
}

.rui-app-bar-container--layout-collapsing
    .rui-app-bar-container__content
    :deep(.rui-responsive-container),
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar))
    .rui-app-bar-container__content
    :deep(.rui-responsive-container),
.rui-app-bar-container--layout-collapsing
    .rui-app-bar-container__content
    :deep(.rui-responsive-container__container),
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar))
    .rui-app-bar-container__content
    :deep(.rui-responsive-container__container),
.rui-app-bar-container--layout-collapsing
    .rui-app-bar-container__content
    :deep(.rui-responsive-container__content),
.rui-app-bar-container:has(:deep(.rui-collapsing-app-bar))
    .rui-app-bar-container__content
    :deep(.rui-responsive-container__content) {
    block-size: 100%;
}

.rui-app-bar-container__content-scrim {
    position: absolute;
    z-index: 1;
    inset: 0;
    background: var(--rui-comp-app-bar-content-scrim, transparent);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--rui-comp-app-bar-scrim-duration) var(--rui-sys-motion-easing-accelerated);
}

.rui-app-bar-container--collapsed .rui-app-bar-container__content-scrim {
    opacity: 1;
}

.rui-app-bar-container--hidden {
    transform: translateY(-100%);
    pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
    .rui-app-bar-container,
    .rui-app-bar-container__content-scrim {
        transition-duration: 0ms !important;
    }
}
</style>
