<script setup lang="ts">
import { computed, inject, onUnmounted, watchEffect } from "vue"

import RResponsiveContainer from "@/components/responsive/RResponsiveContainer.vue"
import { scaffoldContextKey } from "@/components/scaffold/context"
import RSurface from "@/components/surface/RSurface.vue"

import type { RAppBarProps } from "./types"

const props = withDefaults(defineProps<RAppBarProps>(), {
    contentAlign: "full-width",
    collapsing: false,
    hideOnScroll: false,
    underlap: false,
    collapsedHeight: "64px",
})

const scaffold = inject(scaffoldContextKey, null)
const contentMode = computed(() => {
    if (props.contentAlign === "body") return scaffold?.bodyGridMode.value ?? "centered"
    return props.contentAlign
})
const shouldCollapse = computed(() => props.collapsing && scaffold?.fabPlacement.value !== "app-bar-seam")
const hidden = computed(() => props.hideOnScroll && scaffold?.scrollState.value.direction === "down")
const collapsed = computed(() => shouldCollapse.value && scaffold?.appBarState.value === "collapsed")
const style = computed(() => ({
    "--rui-comp-app-bar-expanded-height": props.expandedHeight ?? props.collapsedHeight,
    "--rui-comp-app-bar-collapsed-height": props.collapsedHeight,
    "--rui-sys-scaffold-collapse-progress": collapsed.value ? "1" : "0",
}))
const classes = computed(() => [
    "rui-app-bar",
    {
        "rui-app-bar--hidden": hidden.value,
        "rui-app-bar--collapsed": collapsed.value,
        "rui-app-bar--underlap": props.underlap,
    },
])

watchEffect(() => {
    scaffold?.setAppBarExpandedHeight(props.expandedHeight ?? props.collapsedHeight)
})

onUnmounted(() => {
    scaffold?.setAppBarExpandedHeight("64px")
})
</script>

<template>
    <RSurface as="div" :class="classes" :style="style" :elevation="4">
        <RResponsiveContainer v-if="contentAlign !== 'full-width'" :mode="contentMode">
            <div class="rui-app-bar__content">
                <slot />
            </div>
        </RResponsiveContainer>
        <div v-else class="rui-app-bar__content rui-app-bar__content--full-width">
            <slot />
        </div>
    </RSurface>
</template>

<style scoped lang="scss">
.rui-app-bar {
    position: relative;
    min-block-size: var(--rui-comp-app-bar-expanded-height);
    transition:
        transform 180ms ease,
        min-block-size 180ms ease;
    overflow: visible;
}

.rui-app-bar--hidden {
    transform: translateY(-100%);
}

.rui-app-bar--collapsed {
    min-block-size: var(--rui-comp-app-bar-collapsed-height);
}

.rui-app-bar__content {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-block-size: inherit;
    gap: 16px;
    padding-block: 8px;
}

.rui-app-bar__content--full-width {
    padding-inline: 24px;
}
</style>
