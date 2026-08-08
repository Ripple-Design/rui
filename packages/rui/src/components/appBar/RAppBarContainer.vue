<script setup lang="ts">
import { computed, inject, onUnmounted, watchEffect } from "vue"

import RResponsiveContainer from "@/components/responsive/RResponsiveContainer.vue"
import { scaffoldContextKey } from "@/components/scaffold/context"
import RSurface from "@/components/surface/RSurface.vue"

import type { RAppBarContainerProps } from "./types"

const props = withDefaults(defineProps<RAppBarContainerProps>(), {
    contentAlign: "full-width",
    color: "surface",
    collapsing: false,
    hideOnScroll: false,
    underlap: false,
})

const scaffold = inject(scaffoldContextKey, null)
const contentMode = computed(() => {
    if (props.contentAlign === "body") return scaffold?.bodyGridMode.value ?? "centered"
    return props.contentAlign
})
const shouldCollapse = computed(() => props.collapsing && scaffold?.fabPlacement.value !== "app-bar-seam")
const state = computed(() => scaffold?.appBarState.value ?? "expanded")
const classes = computed(() => [
    "rui-app-bar-container",
    `rui-app-bar-container--${state.value}`,
    {
        "rui-app-bar-container--underlap": props.underlap,
        "rui-app-bar-container--color-surface": props.color === "surface",
        "rui-app-bar-container--color-primary": props.color === "primary",
        "rui-app-bar-container--collapsed": state.value === "collapsed",
    },
])
const style = computed(() => ({
    ...(props.expandedHeight !== undefined || props.collapsedHeight !== undefined
        ? { "--rui-comp-app-bar-expanded-height": props.expandedHeight ?? props.collapsedHeight }
        : {}),
    ...(props.collapsedHeight !== undefined ? { "--rui-comp-app-bar-collapsed-height": props.collapsedHeight } : {}),
    "--rui-sys-scaffold-collapse-progress": state.value === "collapsed" ? "1" : "0",
}))

watchEffect(() => {
    scaffold?.setAppBarExpandedHeight(props.expandedHeight ?? props.collapsedHeight)
    scaffold?.setAppBarCollapsedHeight(props.collapsedHeight)
    scaffold?.setAppBarHideOnScroll(props.hideOnScroll)
    scaffold?.setAppBarCollapsing(shouldCollapse.value)
})

onUnmounted(() => {
    scaffold?.setAppBarExpandedHeight(undefined)
    scaffold?.setAppBarCollapsedHeight(undefined)
    scaffold?.setAppBarHideOnScroll(false)
    scaffold?.setAppBarCollapsing(false)
})
</script>

<template>
    <RSurface as="div" :class="classes" :style="style" :color="color" :elevation="4">
        <component
            :is="contentAlign !== 'full-width' ? RResponsiveContainer : 'div'"
            :mode="contentMode"
            class="rui-app-bar-container__content"
        >
            <slot />
        </component>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/breakpoints" as breakpoint;

.rui-app-bar-container {
    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-end: 0;
    --rui-surface-shape-end-start: 0;
    --rui-comp-app-bar-expanded-height: 56px;
    --rui-comp-app-bar-collapsed-height: 56px;
    position: sticky;
    z-index: 3;
    inset-block-start: 0;
    inline-size: 100%;
    block-size: var(--rui-comp-app-bar-expanded-height);
    margin-block-end: calc(-1 * var(--rui-comp-app-bar-expanded-height));
    overflow-anchor: none;
    transition: transform 225ms var(--rui-sys-motion-easing-decelerated),
        margin-block-end 225ms var(--rui-sys-motion-easing-decelerated);

    @include breakpoint.c-up(clg) {
        --rui-comp-app-bar-expanded-height: 64px;
        --rui-comp-app-bar-collapsed-height: 64px;
    }
}

.rui-app-bar-container--collapsed {
    block-size: var(--rui-comp-app-bar-collapsed-height);
}

.rui-app-bar-container--hidden {
    transform: translateY(-100%);
    transition-duration: 175ms;
    transition-timing-function: var(--rui-sys-motion-easing-accelerated);
}

.rui-app-bar-container__content {
    block-size: 100%;
}

@media (prefers-reduced-motion: reduce) {
    .rui-app-bar-container {
        transition-duration: 0ms !important;
    }
}
</style>
