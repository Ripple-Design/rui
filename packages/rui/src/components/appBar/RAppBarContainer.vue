<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watchEffect } from "vue"

import { scaffoldContextKey } from "@/components/scaffold/context"
import RSurface from "@/components/surface/RSurface.vue"

import type { RAppBarContainerProps } from "./types"

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
const contentMode = computed(() => {
    if (props.contentAlign === "body") return scaffold?.bodyGridMode.value ?? "centered"
    return props.contentAlign
})
const state = computed(() => scaffold?.appBarState.value ?? "expanded")
const scrollState = computed(() => scaffold?.appBarScrollState.value)
const classes = computed(() => [
    "rui-app-bar-container",
    `rui-app-bar-container--${state.value}`,
    {
        "rui-app-bar-container--underlap": props.underlap,
        "rui-app-bar-container--color-surface": props.color === "surface",
        "rui-app-bar-container--color-primary": props.color === "primary",
        "rui-app-bar-container--lifted": scrollState.value?.lifted,
    },
])
const style = computed(() => ({
    ...(props.expandedHeight !== undefined ? { "--rui-comp-app-bar-expanded-height": props.expandedHeight } : {}),
    ...(props.collapsedHeight !== undefined ? { "--rui-comp-app-bar-collapsed-height": props.collapsedHeight } : {}),
    "--rui-comp-app-bar-background": props.color === "primary" ? "var(--rui-sys-color-primary)" : "var(--rui-sys-color-surface)",
    "--rui-comp-surface-background": "transparent",
    "--rui-comp-app-bar-collapse-offset": `${scrollState.value?.collapseOffset ?? 0}px`,
    "--rui-comp-app-bar-collapse-distance": `${scrollState.value?.collapseDistance ?? 0}px`,
    "--rui-comp-app-bar-collapse-progress": scrollState.value?.collapseProgress ?? 0,
    "--rui-comp-app-bar-visible-height": scrollState.value?.visibleHeight
        ? `${scrollState.value.visibleHeight}px`
        : "var(--rui-comp-app-bar-expanded-height)",
    "--rui-sys-scaffold-collapse-progress": scrollState.value?.collapseProgress ?? 0,
}))

function register() {
    if (!viewport.value || !scaffold) return
    scaffold.registerAppBar({
        element: viewport.value,
        expandedHeight: props.expandedHeight ?? props.collapsedHeight ?? "56px",
        collapsedHeight: props.collapsedHeight ?? "56px",
        topInset: props.topInset,
        scrollBehavior: props.scrollBehavior,
        snap: props.snap,
        snapMargins: props.snapMargins,
        scrollTarget: props.scrollTarget,
        liftOnScroll: props.liftOnScroll,
        hideOnScroll: props.hideOnScroll,
    })
}

watchEffect(register)

onMounted(register)

onUnmounted(() => {
    if (viewport.value) scaffold?.unregisterAppBar(viewport.value)
})
</script>

<template>
    <RSurface
        as="header"
        :class="classes"
        :style="style"
        :color="color"
        :elevation="scrollState?.lifted ? 4 : 0"
        :inert="state === 'hidden' ? '' : undefined"
        :aria-hidden="state === 'hidden' ? 'true' : undefined"
    >
        <div ref="viewport" class="rui-app-bar-container__viewport">
            <div class="rui-app-bar-container__collapsing-content">
                <slot />
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
    block-size: var(--rui-comp-app-bar-expanded-height);
    margin-block-end: calc(-1 * var(--rui-comp-app-bar-expanded-height));
    overflow-anchor: none;
    contain: layout paint;
    will-change: clip-path;
    box-shadow: none !important;
    transition: none;
}

@include breakpoint.c-up(clg) {
    .rui-app-bar-container {
        --rui-comp-app-bar-expanded-height: 64px;
        --rui-comp-app-bar-collapsed-height: 64px;
    }
}

.rui-app-bar-container::after {
    position: absolute;
    z-index: 0;
    inset-inline: 0;
    inset-block-start: 0;
    block-size: var(--rui-comp-app-bar-visible-height, var(--rui-comp-app-bar-expanded-height));
    box-shadow: none;
    content: "";
    pointer-events: none;
}

.rui-app-bar-container--lifted::after {
    box-shadow: elevations.shadow(4);
    transition: box-shadow var(--rui-comp-app-bar-lift-duration) linear;
}

.rui-app-bar-container__viewport {
    position: relative;
    block-size: var(--rui-comp-app-bar-visible-height, var(--rui-comp-app-bar-expanded-height));
    overflow: hidden;
    background: var(--rui-comp-app-bar-background);
    will-change: block-size;
}

.rui-app-bar-container__collapsing-content {
    position: absolute;
    inset: 0;
    overflow: visible;
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
