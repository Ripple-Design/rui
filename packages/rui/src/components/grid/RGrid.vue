<script setup lang="ts">
/**
 * Grid arranges direct children in rows and columns.
 */

import { computed, useAttrs } from "vue"

import type { RGridColsValue, RGridContainerCols, RGridProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RGridProps>(), {
    cols: 1,
    dense: false,
})

const attrs = useAttrs()

function isContainerCols(value: RGridProps["cols"]): value is RGridContainerCols {
    return typeof value === "object" && value != null
}

function normalizeTemplateColumns(value: RGridColsValue | undefined) {
    if (typeof value === "number") {
        return `repeat(${value}, minmax(0, 1fr))`
    }

    return value
}

const style = computed(() => {
    const autoFlow = props.dense ? (props.autoFlow ? `${props.autoFlow} dense` : "row dense") : props.autoFlow
    const baseStyle = {
        "--rui-comp-grid-gap": props.gap,
        "--rui-comp-grid-column-gap": props.columnGap,
        "--rui-comp-grid-row-gap": props.rowGap,
        "--rui-comp-grid-align-items": props.alignItems,
        "--rui-comp-grid-justify-items": props.justifyItems,
        "--rui-comp-grid-align-content": props.alignContent,
        "--rui-comp-grid-justify-content": props.justifyContent,
        "--rui-comp-grid-auto-flow": autoFlow,
    }

    if (isContainerCols(props.cols)) {
        const csm = normalizeTemplateColumns(props.cols.csm)
        const cmd = normalizeTemplateColumns(props.cols.cmd ?? props.cols.csm)
        const clg = normalizeTemplateColumns(props.cols.clg ?? props.cols.cmd ?? props.cols.csm)
        const cxl = normalizeTemplateColumns(props.cols.cxl ?? props.cols.clg ?? props.cols.cmd ?? props.cols.csm)

        return {
            ...baseStyle,
            "--rui-comp-grid-cols-base": undefined,
            "--rui-comp-grid-cols-csm": csm,
            "--rui-comp-grid-cols-cmd": cmd,
            "--rui-comp-grid-cols-clg": clg,
            "--rui-comp-grid-cols-cxl": cxl,
        }
    }

    return {
        ...baseStyle,
        "--rui-comp-grid-cols-base": normalizeTemplateColumns(props.cols),
        "--rui-comp-grid-cols-csm": undefined,
        "--rui-comp-grid-cols-cmd": undefined,
        "--rui-comp-grid-cols-clg": undefined,
        "--rui-comp-grid-cols-cxl": undefined,
    }
})
</script>

<template>
    <div class="rui-grid-container">
        <div v-bind="attrs" class="rui-grid" :style="style">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/breakpoints" as breakpoint;

.rui-grid-container {
    display: block;
    width: 100%;
    min-width: 0;
    container-type: inline-size;
}

.rui-grid {
    display: grid;
    grid-template-columns: var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-base, minmax(0, 1fr)));
    gap: var(--rui-comp-grid-gap, 0);
    column-gap: var(--rui-comp-grid-column-gap, var(--rui-comp-grid-gap, 0));
    row-gap: var(--rui-comp-grid-row-gap, var(--rui-comp-grid-gap, 0));
    align-items: var(--rui-comp-grid-align-items, stretch);
    justify-items: var(--rui-comp-grid-justify-items, stretch);
    align-content: var(--rui-comp-grid-align-content, normal);
    justify-content: var(--rui-comp-grid-justify-content, normal);
    grid-auto-flow: var(--rui-comp-grid-auto-flow, row);
}

@include breakpoint.c-up(cmd) {
    .rui-grid {
        grid-template-columns: var(
            --rui-comp-grid-cols-cmd,
            var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-base, minmax(0, 1fr)))
        );
    }
}

@include breakpoint.c-up(clg) {
    .rui-grid {
        grid-template-columns: var(
            --rui-comp-grid-cols-clg,
            var(--rui-comp-grid-cols-cmd, var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-base, minmax(0, 1fr))))
        );
    }
}

@include breakpoint.c-up(cxl) {
    .rui-grid {
        grid-template-columns: var(
            --rui-comp-grid-cols-cxl,
            var(
                --rui-comp-grid-cols-clg,
                var(--rui-comp-grid-cols-cmd, var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-base, minmax(0, 1fr))))
            )
        );
    }
}
</style>
