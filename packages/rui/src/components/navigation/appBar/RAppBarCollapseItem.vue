<script setup lang="ts">
import { computed, inject, ref } from "vue"

import type { RAppBarCollapseItemProps } from "./types.ts"

import { appBarContextKey } from "./context.ts"

const props = withDefaults(defineProps<RAppBarCollapseItemProps>(), {
    mode: "off",
    parallaxMultiplier: 0.5,
})

const element = ref<HTMLElement | null>(null)
const appBar = inject(appBarContextKey, null)
const style = computed(() => {
    const offset = appBar?.scrollState.value.collapseOffset ?? 0
    const value = props.mode === "off" ? -offset : props.mode === "parallax" ? -offset * props.parallaxMultiplier : 0
    return value ? { transform: `translateY(${value}px)` } : undefined
})
</script>

<template>
    <div ref="element" class="rui-app-bar-collapse-item" :class="`rui-app-bar-collapse-item--${mode}`" :style="style">
        <slot />
    </div>
</template>

<style scoped>
.rui-app-bar-collapse-item {
    position: relative;
    block-size: var(--rui-comp-app-bar-expanded-height, 100%);
    inline-size: 100%;
}

.rui-app-bar-collapse-item--pin,
.rui-app-bar-collapse-item--parallax {
    will-change: transform;
}
</style>
