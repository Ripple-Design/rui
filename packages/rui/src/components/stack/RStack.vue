<script setup lang="ts">
import { computed } from "vue"

import type { RStackProps } from "./types"

const props = defineProps<RStackProps>()

const style = computed(() => ({
    "--rui-stack-display": props.inline ? "inline-flex" : "flex",
    "--rui-stack-direction": props.direction ?? "column",
    "--rui-stack-gap": props.gap,
    "--rui-stack-align": props.align ?? "stretch",
    "--rui-stack-justify": props.justify ?? "flex-start",
    "--rui-stack-wrap": props.wrap === true ? "wrap" : props.wrap === false ? "nowrap" : props.wrap ?? "nowrap",
}))
</script>

<template>
    <div class="rui-stack" :style="style">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.rui-stack {
    display: var(--rui-stack-display, flex);
    flex-direction: var(--rui-stack-direction, column);
    gap: var(--rui-stack-gap, 0);
    align-items: var(--rui-stack-align, stretch);
    justify-content: var(--rui-stack-justify, flex-start);
    flex-wrap: var(--rui-stack-wrap, nowrap);
}
</style>
