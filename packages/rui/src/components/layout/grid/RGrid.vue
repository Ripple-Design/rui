<script setup lang="ts">
/**
 * Grid arranges direct children in rows and columns.
 */

import { computed, useAttrs } from "vue"

import type { RContainerResponsiveValue, RViewportResponsiveValue } from "@/foundations/responsive/responsive.ts"

import type { RGridColumnsValue, RGridProps, RGridResponsiveColumns } from "./types.ts"

const props = withDefaults(defineProps<RGridProps>(), {
    columns: 1,
    dense: false,
})

const attrs = useAttrs()

function isResponsiveCols(value: RGridProps["columns"]): value is RGridResponsiveColumns {
    return typeof value === "object" && value != null
}

function isContainerCols(value: RGridResponsiveColumns): value is RContainerResponsiveValue<RGridColumnsValue> {
    return "cxs" in value
}

function normalizeTemplateColumns(value: RGridColumnsValue | undefined) {
    if (typeof value === "number") {
        return `repeat(${value}, minmax(0, 1fr))`
    }

    return value
}

const responsiveMode = computed<"viewport" | "container" | null>(() => {
    if (!isResponsiveCols(props.columns)) return null
    return isContainerCols(props.columns) ? "container" : "viewport"
})

const classes = computed(() => [
    "rui-grid",
    {
        "rui-grid--viewport-responsive": responsiveMode.value === "viewport",
        "rui-grid--container-responsive": responsiveMode.value === "container",
    },
])

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
        const normalized = normalizeTemplateColumns(props.columns)

        return {
            ...baseStyle,
            "--rui-comp-grid-cols-xs": normalized,
            "--rui-comp-grid-cols-sm": normalized,
            "--rui-comp-grid-cols-md": normalized,
            "--rui-comp-grid-cols-lg": normalized,
            "--rui-comp-grid-cols-xl": normalized,
            "--rui-comp-grid-cols-xxl": normalized,
            "--rui-comp-grid-cols-cxs": normalized,
            "--rui-comp-grid-cols-csm": normalized,
            "--rui-comp-grid-cols-cmd": normalized,
            "--rui-comp-grid-cols-clg": normalized,
            "--rui-comp-grid-cols-cxl": normalized,
            "--rui-comp-grid-cols-cxxl": normalized,
        }
    }

    if (isContainerCols(props.columns)) {
        const cxs = normalizeTemplateColumns(props.columns.cxs)
        const csm = normalizeTemplateColumns(props.columns.csm ?? props.columns.cxs)
        const cmd = normalizeTemplateColumns(props.columns.cmd ?? props.columns.csm ?? props.columns.cxs)
        const clg = normalizeTemplateColumns(props.columns.clg ?? props.columns.cmd ?? props.columns.csm ?? props.columns.cxs)
        const cxl = normalizeTemplateColumns(
            props.columns.cxl ?? props.columns.clg ?? props.columns.cmd ?? props.columns.csm ?? props.columns.cxs,
        )
        const cxxl = normalizeTemplateColumns(
            props.columns.cxxl ?? props.columns.cxl ?? props.columns.clg ?? props.columns.cmd ?? props.columns.csm ?? props.columns.cxs,
        )

        return {
            ...baseStyle,
            "--rui-comp-grid-cols-xs": undefined,
            "--rui-comp-grid-cols-sm": undefined,
            "--rui-comp-grid-cols-md": undefined,
            "--rui-comp-grid-cols-lg": undefined,
            "--rui-comp-grid-cols-xl": undefined,
            "--rui-comp-grid-cols-xxl": undefined,
            "--rui-comp-grid-cols-cxs": cxs,
            "--rui-comp-grid-cols-csm": csm,
            "--rui-comp-grid-cols-cmd": cmd,
            "--rui-comp-grid-cols-clg": clg,
            "--rui-comp-grid-cols-cxl": cxl,
            "--rui-comp-grid-cols-cxxl": cxxl,
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
        "--rui-comp-grid-cols-cxs": undefined,
        "--rui-comp-grid-cols-csm": undefined,
        "--rui-comp-grid-cols-cmd": undefined,
        "--rui-comp-grid-cols-clg": undefined,
        "--rui-comp-grid-cols-cxl": undefined,
        "--rui-comp-grid-cols-cxxl": undefined,
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
    grid-template-columns: var(--rui-comp-grid-cols-xs, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr)));
    gap: var(--rui-comp-grid-gap, 0);
    column-gap: var(--rui-comp-grid-column-gap, var(--rui-comp-grid-gap, 0));
    row-gap: var(--rui-comp-grid-row-gap, var(--rui-comp-grid-gap, 0));
    align-items: var(--rui-comp-grid-align-items, stretch);
    justify-items: var(--rui-comp-grid-justify-items, stretch);
    align-content: var(--rui-comp-grid-align-content, normal);
    justify-content: var(--rui-comp-grid-justify-content, normal);
    grid-auto-flow: var(--rui-comp-grid-auto-flow, row);
}

:slotted(.rui-grid__item) {
    grid-column: var(--rui-comp-grid-column-span-xs, var(--rui-comp-grid-column-span-cxs, auto));
    grid-row: var(--rui-comp-grid-row-span-xs, var(--rui-comp-grid-row-span-cxs, auto));
}

@include breakpoint.up(sm) {
    .rui-grid--viewport-responsive {
        grid-template-columns: var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)));
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="viewport"]) {
        grid-column: var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto));
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="viewport"]) {
        grid-row: var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto));
    }
}

@include breakpoint.up(md) {
    .rui-grid--viewport-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-md,
            var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr)))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="viewport"]) {
        grid-column: var(
            --rui-comp-grid-column-span-md,
            var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="viewport"]) {
        grid-row: var(
            --rui-comp-grid-row-span-md,
            var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto))
        );
    }
}

@include breakpoint.up(lg) {
    .rui-grid--viewport-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-lg,
            var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="viewport"]) {
        grid-column: var(
            --rui-comp-grid-column-span-lg,
            var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="viewport"]) {
        grid-row: var(
            --rui-comp-grid-row-span-lg,
            var(--rui-comp-grid-row-span-md, var(--rui-comp-grid-row-span-sm, var(--rui-comp-grid-row-span-xs, auto)))
        );
    }
}

@include breakpoint.up(xl) {
    .rui-grid--viewport-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-xl,
            var(
                --rui-comp-grid-cols-lg,
                var(--rui-comp-grid-cols-md, var(--rui-comp-grid-cols-sm, var(--rui-comp-grid-cols-xs, minmax(0, 1fr))))
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="viewport"]) {
        grid-column: var(
            --rui-comp-grid-column-span-xl,
            var(
                --rui-comp-grid-column-span-lg,
                var(--rui-comp-grid-column-span-md, var(--rui-comp-grid-column-span-sm, var(--rui-comp-grid-column-span-xs, auto)))
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="viewport"]) {
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
    .rui-grid--viewport-responsive {
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

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="viewport"]) {
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
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="viewport"]) {
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

@include breakpoint.c-up(csm) {
    .rui-grid--container-responsive {
        grid-template-columns: var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr)));
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="container"]) {
        grid-column: var(--rui-comp-grid-column-span-csm, var(--rui-comp-grid-column-span-cxs, auto));
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="container"]) {
        grid-row: var(--rui-comp-grid-row-span-csm, var(--rui-comp-grid-row-span-cxs, auto));
    }
}

@include breakpoint.c-up(cmd) {
    .rui-grid--container-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-cmd,
            var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr)))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="container"]) {
        grid-column: var(
            --rui-comp-grid-column-span-cmd,
            var(--rui-comp-grid-column-span-csm, var(--rui-comp-grid-column-span-cxs, auto))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="container"]) {
        grid-row: var(
            --rui-comp-grid-row-span-cmd,
            var(--rui-comp-grid-row-span-csm, var(--rui-comp-grid-row-span-cxs, auto))
        );
    }
}

@include breakpoint.c-up(clg) {
    .rui-grid--container-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-clg,
            var(--rui-comp-grid-cols-cmd, var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr))))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="container"]) {
        grid-column: var(
            --rui-comp-grid-column-span-clg,
            var(--rui-comp-grid-column-span-cmd, var(--rui-comp-grid-column-span-csm, var(--rui-comp-grid-column-span-cxs, auto)))
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="container"]) {
        grid-row: var(
            --rui-comp-grid-row-span-clg,
            var(--rui-comp-grid-row-span-cmd, var(--rui-comp-grid-row-span-csm, var(--rui-comp-grid-row-span-cxs, auto)))
        );
    }
}

@include breakpoint.c-up(cxl) {
    .rui-grid--container-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-cxl,
            var(
                --rui-comp-grid-cols-clg,
                var(--rui-comp-grid-cols-cmd, var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr))))
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="container"]) {
        grid-column: var(
            --rui-comp-grid-column-span-cxl,
            var(
                --rui-comp-grid-column-span-clg,
                var(--rui-comp-grid-column-span-cmd, var(--rui-comp-grid-column-span-csm, var(--rui-comp-grid-column-span-cxs, auto)))
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="container"]) {
        grid-row: var(
            --rui-comp-grid-row-span-cxl,
            var(
                --rui-comp-grid-row-span-clg,
                var(--rui-comp-grid-row-span-cmd, var(--rui-comp-grid-row-span-csm, var(--rui-comp-grid-row-span-cxs, auto)))
            )
        );
    }
}

@include breakpoint.c-up(cxxl) {
    .rui-grid--container-responsive {
        grid-template-columns: var(
            --rui-comp-grid-cols-cxxl,
            var(
                --rui-comp-grid-cols-cxl,
                var(
                    --rui-comp-grid-cols-clg,
                    var(--rui-comp-grid-cols-cmd, var(--rui-comp-grid-cols-csm, var(--rui-comp-grid-cols-cxs, minmax(0, 1fr))))
                )
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-column-span-mode="container"]) {
        grid-column: var(
            --rui-comp-grid-column-span-cxxl,
            var(
                --rui-comp-grid-column-span-cxl,
                var(
                    --rui-comp-grid-column-span-clg,
                    var(
                        --rui-comp-grid-column-span-cmd,
                        var(--rui-comp-grid-column-span-csm, var(--rui-comp-grid-column-span-cxs, auto))
                    )
                )
            )
        );
    }

    :slotted(.rui-grid__item[data-rui-grid-row-span-mode="container"]) {
        grid-row: var(
            --rui-comp-grid-row-span-cxxl,
            var(
                --rui-comp-grid-row-span-cxl,
                var(
                    --rui-comp-grid-row-span-clg,
                    var(
                        --rui-comp-grid-row-span-cmd,
                        var(--rui-comp-grid-row-span-csm, var(--rui-comp-grid-row-span-cxs, auto))
                    )
                )
            )
        );
    }
}
</style>
