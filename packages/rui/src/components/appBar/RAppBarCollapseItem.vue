<script setup lang="ts">
import { computed, inject, ref } from "vue"

import { scaffoldContextKey } from "@/components/scaffold/context"

import type { RAppBarCollapseItemProps } from "./types"

const props = withDefaults(defineProps<RAppBarCollapseItemProps>(), {
    mode: "off",
    parallaxMultiplier: 0.5,
})

const element = ref<HTMLElement | null>(null)
const scaffold = inject(scaffoldContextKey, null)
const style = computed(() => {
    const offset = scaffold?.appBarScrollState.value.collapseOffset ?? 0
    const value = props.mode === "parallax" ? offset * props.parallaxMultiplier : props.mode === "pin" ? offset : 0
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
    block-size: 100%;
    inline-size: 100%;
}

.rui-app-bar-collapse-item--pin,
.rui-app-bar-collapse-item--parallax {
    will-change: transform;
}
</style>
