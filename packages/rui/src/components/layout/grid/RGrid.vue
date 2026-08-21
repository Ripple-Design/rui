<script setup lang="ts">
/**
 * Grid arranges direct children in rows and columns.
 */

import { computed, useAttrs } from "vue"

import type { RViewportResponsiveValue } from "@/foundations/responsive/responsive.ts"

import type { RGridColumnsValue, RGridProps, RGridResponsiveColumns } from "./types.ts"

const props = withDefaults(defineProps<RGridProps>(), {
    columns: 1,
    responsive: "viewport",
    dense: false,
})

const attrs = useAttrs()

function isResponsiveCols(value: RGridProps["columns"]): value is RGridResponsiveColumns {
    return typeof value === "object" && value != null
}

function normalizeTemplateColumns(value: RGridColumnsValue | undefined) {
    if (typeof value === "number") {
        return `repeat(${value}, minmax(0, 1fr))`
    }

    return value
}

const classes = computed(() => ["rui-grid", `rui-grid--responsive-${props.responsive}`])

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

    if (!isResponsiveCols(props.columns)) {
        return {
            ...baseStyle,
            "--rui-comp-grid-cols-xs": normalizeTemplateColumns(props.columns),
        }
    }

    const columns = props.columns as RViewportResponsiveValue<RGridColumnsValue>
    const xs = normalizeTemplateColumns(columns.xs)
    const sm = normalizeTemplateColumns(columns.sm ?? columns.xs)
    const md = normalizeTemplateColumns(columns.md ?? columns.sm ?? columns.xs)
    const lg = normalizeTemplateColumns(columns.lg ?? columns.md ?? columns.sm ?? columns.xs)
    const xl = normalizeTemplateColumns(columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.xs)
    const xxl = normalizeTemplateColumns(columns.xxl ?? columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.xs)

    return {
        ...baseStyle,
        "--rui-comp-grid-cols-xs": xs,
        "--rui-comp-grid-cols-sm": sm,
        "--rui-comp-grid-cols-md": md,
        "--rui-comp-grid-cols-lg": lg,
        "--rui-comp-grid-cols-xl": xl,
        "--rui-comp-grid-cols-xxl": xxl,
    }
})
</script>

<template>
    <div class="rui-grid-container">
        <div v-bind="attrs" :class="classes" :style="style">
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
    grid-template-columns: var(--rui-comp-grid-cols-xs, minmax(0, 1fr));
    gap: var(--rui-comp-grid-gap, 0);
    column-gap: var(--rui-comp-grid-column-gap, var(--rui-comp-grid-gap, 0));
    row-gap: var(--rui-comp-grid-row-gap, var(--rui-comp-grid-gap, 0));
    align-items: var(--rui-comp-grid-align-items, stretch);
    justify-items: var(--rui-comp-grid-justify-items, stretch);
    align-content: var(--rui-comp-grid-align-content, normal);
    justify-content: var(--rui-comp-grid-justify-content, normal);
    grid-auto-flow: var(--rui-comp-grid-auto-flow, row);
}

.rui-grid > :deep(.rui-grid__item) {
    grid-column: var(--rui-comp-grid-column-span-xs, auto);
    grid-row: var(--rui-comp-grid-row-span-xs, auto);
}

@include breakpoint.up(sm) {
    .rui-grid--responsive-viewport {
        grid-template-columns: var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)));
    }

    .rui-grid--responsive-viewport > :deep(.rui-grid__item) {
        grid-column: var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto));
        grid-row: var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto));
    }
}

@include breakpoint.up(md) {
    .rui-grid--responsive-viewport {
        grid-template-columns: var(
            --rui-comp-grid-cols-md,
            var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)))
        );
    }

    .rui-grid--responsive-viewport > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-md,
            var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto))
        );
        grid-row: var(
            --rui-comp-grid-row-span-md,
            var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto))
        );
    }
}

@include breakpoint.up(lg) {
    .rui-grid--responsive-viewport {
        grid-template-columns: var(
            --rui-comp-grid-cols-lg,
            var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
        );
    }

    .rui-grid--responsive-viewport > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-lg,
            var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
        );
        grid-row: var(
            --rui-comp-grid-row-span-lg,
            var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
        );
    }
}

@include breakpoint.up(xl) {
    .rui-grid--responsive-viewport {
        grid-template-columns: var(
            --rui-comp-grid-cols-xl,
            var(
                --rui-comp-grid-cols-lg,
                var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
            )
        );
    }

    .rui-grid--responsive-viewport > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-xl,
            var(
                --rui-comp-grid-column-span-lg,
                var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
            )
        );
        grid-row: var(
            --rui-comp-grid-row-span-xl,
            var(
                --rui-comp-grid-row-span-lg,
                var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
            )
        );
    }
}

@include breakpoint.up(xxl) {
    .rui-grid--responsive-viewport {
        grid-template-columns: var(
            --rui-comp-grid-cols-xxl,
            var(
                --rui-comp-grid-cols-xl,
                var(
                    --rui-comp-grid-cols-lg,
                    var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
                )
            )
        );
    }

    .rui-grid--responsive-viewport > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-xxl,
            var(
                --rui-comp-grid-column-span-xl,
                var(
                    --rui-comp-grid-column-span-lg,
                    var(
                        --rui-comp-grid-column-span-md,
                        var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto))
                    )
                )
            )
        );
        grid-row: var(
            --rui-comp-grid-row-span-xxl,
            var(
                --rui-comp-grid-row-span-xl,
                var(
                    --rui-comp-grid-row-span-lg,
                    var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
                )
            )
        );
    }
}

@include breakpoint.c-up(sm) {
    .rui-grid--responsive-container {
        grid-template-columns: var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)));
    }

    .rui-grid--responsive-container > :deep(.rui-grid__item) {
        grid-column: var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto));
        grid-row: var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto));
    }
}

@include breakpoint.c-up(md) {
    .rui-grid--responsive-container {
        grid-template-columns: var(
            --rui-comp-grid-cols-md,
            var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)))
        );
    }

    .rui-grid--responsive-container > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-md,
            var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto))
        );
        grid-row: var(
            --rui-comp-grid-row-span-md,
            var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto))
        );
    }
}

@include breakpoint.c-up(lg) {
    .rui-grid--responsive-container {
        grid-template-columns: var(
            --rui-comp-grid-cols-lg,
            var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
        );
    }

    .rui-grid--responsive-container > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-lg,
            var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
        );
        grid-row: var(
            --rui-comp-grid-row-span-lg,
            var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
        );
    }
}

@include breakpoint.c-up(xl) {
    .rui-grid--responsive-container {
        grid-template-columns: var(
            --rui-comp-grid-cols-xl,
            var(
                --rui-comp-grid-cols-lg,
                var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
            )
        );
    }

    .rui-grid--responsive-container > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-xl,
            var(
                --rui-comp-grid-column-span-lg,
                var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
            )
        );
        grid-row: var(
            --rui-comp-grid-row-span-xl,
            var(
                --rui-comp-grid-row-span-lg,
                var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
            )
        );
    }
}

@include breakpoint.c-up(xxl) {
    .rui-grid--responsive-container {
        grid-template-columns: var(
            --rui-comp-grid-cols-xxl,
            var(
                --rui-comp-grid-cols-xl,
                var(
                    --rui-comp-grid-cols-lg,
                    var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
                )
            )
        );
    }

    .rui-grid--responsive-container > :deep(.rui-grid__item) {
        grid-column: var(
            --rui-comp-grid-column-span-xxl,
            var(
                --rui-comp-grid-column-span-xl,
                var(
                    --rui-comp-grid-column-span-lg,
                    var(
                        --rui-comp-grid-column-span-md,
                        var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto))
                    )
                )
            )
        );
        grid-row: var(
            --rui-comp-grid-row-span-xxl,
            var(
                --rui-comp-grid-row-span-xl,
                var(
                    --rui-comp-grid-row-span-lg,
                    var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
                )
            )
        );
    }
}
</style>
