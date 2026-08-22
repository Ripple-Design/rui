<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RWellProps } from "./types.ts"

const props = withDefaults(defineProps<RWellProps>(), {
    as: "div",
})

const attrs = useAttrs()
const tagName = computed(() => props.as)
const style = computed(() =>
    props.contentColor ? { "--rui-comp-well-content-color": props.contentColor } : undefined,
)
</script>

<template>
    <component :is="tagName" v-bind="attrs" class="rui-well" :style="[attrs.style, style]">
        <slot />
    </component>
</template>

<style scoped lang="scss">
@use "@/styles/elevations";

.rui-well {
    /* @cssvar Well background color. */
    --rui-comp-well-background: var(--rui-sys-color-background);
    /* @cssvar Default content color. The contentColor prop overrides this value. */
    --rui-comp-well-content-color: var(--rui-sys-color-on-background);
    /* @cssvar High-emphasis content color. */
    --rui-comp-well-content-color-high: var(--rui-sys-color-on-background-high);
    /* @cssvar Medium-emphasis content color. */
    --rui-comp-well-content-color-medium: var(--rui-sys-color-on-background-medium);
    /* @cssvar Low-emphasis content color. */
    --rui-comp-well-content-color-low: var(--rui-sys-color-on-background-low);
    /* @cssvar Inset shadow used for the recessed treatment. */
    --rui-comp-well-inset-shadow: #{elevations.inset-shadow(2)};

    --rui-comp-surface-content-color: var(--rui-comp-well-content-color);
    --rui-comp-surface-content-color-high: var(--rui-comp-well-content-color-high);
    --rui-comp-surface-content-color-medium: var(--rui-comp-well-content-color-medium);
    --rui-comp-surface-content-color-low: var(--rui-comp-well-content-color-low);

    display: block;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: var(--rui-comp-well-background);
    color: var(--rui-comp-well-content-color);
    box-shadow: var(--rui-comp-well-inset-shadow);
}
</style>
