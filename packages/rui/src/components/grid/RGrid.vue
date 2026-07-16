<script setup lang="ts">
/**
 * Grid arranges direct children in rows and columns.
 */

import { computed } from "vue"

import type { RGridProps } from "./types"

const props = withDefaults(defineProps<RGridProps>(), {
    cols: 1,
    dense: false,
})

const style = computed(() => {
    const templateColumns = typeof props.cols === "number" ? `repeat(${props.cols}, minmax(0, 1fr))` : props.cols
    const autoFlow = props.dense ? (props.autoFlow ? `${props.autoFlow} dense` : "row dense") : props.autoFlow

    return {
        "--rui-grid-template-columns": templateColumns,
        "--rui-grid-gap": props.gap,
        "--rui-grid-column-gap": props.columnGap,
        "--rui-grid-row-gap": props.rowGap,
        "--rui-grid-align-items": props.alignItems,
        "--rui-grid-justify-items": props.justifyItems,
        "--rui-grid-align-content": props.alignContent,
        "--rui-grid-justify-content": props.justifyContent,
        "--rui-grid-auto-flow": autoFlow,
    }
})
</script>

<template>
    <div class="rui-grid" :style="style">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.rui-grid {
    display: grid;
    grid-template-columns: var(--rui-grid-template-columns, minmax(0, 1fr));
    gap: var(--rui-grid-gap, 0);
    column-gap: var(--rui-grid-column-gap, var(--rui-grid-gap, 0));
    row-gap: var(--rui-grid-row-gap, var(--rui-grid-gap, 0));
    align-items: var(--rui-grid-align-items, stretch);
    justify-items: var(--rui-grid-justify-items, stretch);
    align-content: var(--rui-grid-align-content, normal);
    justify-content: var(--rui-grid-justify-content, normal);
    grid-auto-flow: var(--rui-grid-auto-flow, row);
}
</style>
