<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RSurfaceProps } from "./types.ts"

const props = withDefaults(defineProps<RSurfaceProps>(), {
    variant: "elevated",
    as: "div",
    color: "surface",
})

function normalizeElevation(value: number | undefined) {
    if (typeof value !== "number" || !Number.isFinite(value)) return 2
    return Math.max(0, Math.min(24, Math.round(value)))
}

const attrs = useAttrs()
const tagName = computed(() => props.as)
const elevation = computed(() => normalizeElevation(props.elevation))
const elevationClass = computed(() => `rui-surface--elevation-${elevation.value}`)
const style = computed(() =>
    props.contentColor ? { "--rui-comp-surface-content-color": props.contentColor } : undefined,
)
const classes = computed(() => [
    "rui-surface",
    `rui-surface--${props.variant}`,
    `rui-surface--color-${props.color}`,
    props.variant === "elevated" ? elevationClass.value : "rui-surface--elevation-0",
])
</script>

<template>
    <component :is="tagName" v-bind="attrs" :class="classes" :style="[attrs.style, style]">
        <slot />
    </component>
</template>

<style scoped lang="scss">
@use "@/styles/shape";
@use "@/styles/elevations";

.rui-surface {
    --rui-surface-shape-family: var(--rui-sys-shape-medium-family);
    --rui-surface-shape-start-start: var(--rui-sys-shape-medium-start-start);
    --rui-surface-shape-start-end: var(--rui-sys-shape-medium-start-end);
    --rui-surface-shape-end-end: var(--rui-sys-shape-medium-end-end);
    --rui-surface-shape-end-start: var(--rui-sys-shape-medium-end-start);
    /* @cssvar Surface background color. */
    --rui-comp-surface-background: var(--rui-sys-color-surface);
    /* @cssvar Default content color. The contentColor prop overrides this value. */
    --rui-comp-surface-content-color: var(--rui-sys-color-on-surface);
    /* @cssvar High-emphasis content color. */
    --rui-comp-surface-content-color-high: var(--rui-sys-color-on-surface-high);
    /* @cssvar Medium-emphasis content color. */
    --rui-comp-surface-content-color-medium: var(--rui-sys-color-on-surface-medium);
    /* @cssvar Low-emphasis content color. */
    --rui-comp-surface-content-color-low: var(--rui-sys-color-on-surface-low);
    /* @cssvar Outline color used by the outlined variant. */
    --rui-comp-surface-outline-color: var(--rui-sys-color-on-surface-outline);

    display: block;
    box-sizing: border-box;
    position: relative;
    margin: 0;
    padding: 0;
    background-color: var(--rui-comp-surface-background);
    color: var(--rui-comp-surface-content-color);

    @include shape.apply(
        var(--rui-surface-shape-family),
        var(--rui-surface-shape-start-start),
        var(--rui-surface-shape-start-end),
        var(--rui-surface-shape-end-end),
        var(--rui-surface-shape-end-start)
    );

    &--color-primary {
        --rui-comp-surface-background: var(--rui-sys-color-primary);
        --rui-comp-surface-content-color: var(--rui-sys-color-on-primary);
        --rui-comp-surface-content-color-high: var(--rui-sys-color-on-primary-high);
        --rui-comp-surface-content-color-medium: var(--rui-sys-color-on-primary-medium);
        --rui-comp-surface-content-color-low: var(--rui-sys-color-on-primary-low);
        --rui-comp-surface-outline-color: var(--rui-sys-color-on-primary-outline);
    }

    &--color-secondary {
        --rui-comp-surface-background: var(--rui-sys-color-secondary);
        --rui-comp-surface-content-color: var(--rui-sys-color-on-secondary);
        --rui-comp-surface-content-color-high: var(--rui-sys-color-on-secondary-high);
        --rui-comp-surface-content-color-medium: var(--rui-sys-color-on-secondary-medium);
        --rui-comp-surface-content-color-low: var(--rui-sys-color-on-secondary-low);
        --rui-comp-surface-outline-color: var(--rui-sys-color-on-secondary-outline);
    }

    [data-rui-theme="night"] &.rui-surface--color-surface {
        &.rui-surface--elevation-0 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(0)};
        }

        &.rui-surface--elevation-1 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(1)};
        }

        &.rui-surface--elevation-2 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(2)};
        }

        &.rui-surface--elevation-3 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(3)};
        }

        &.rui-surface--elevation-4 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(4)};
        }

        &.rui-surface--elevation-5 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(5)};
        }

        &.rui-surface--elevation-6 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(6)};
        }

        &.rui-surface--elevation-7 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(7)};
        }

        &.rui-surface--elevation-8 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(8)};
        }

        &.rui-surface--elevation-9 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(9)};
        }

        &.rui-surface--elevation-10 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(10)};
        }

        &.rui-surface--elevation-11 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(11)};
        }

        &.rui-surface--elevation-12 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(12)};
        }

        &.rui-surface--elevation-13 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(13)};
        }

        &.rui-surface--elevation-14 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(14)};
        }

        &.rui-surface--elevation-15 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(15)};
        }

        &.rui-surface--elevation-16 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(16)};
        }

        &.rui-surface--elevation-17 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(17)};
        }

        &.rui-surface--elevation-18 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(18)};
        }

        &.rui-surface--elevation-19 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(19)};
        }

        &.rui-surface--elevation-20 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(20)};
        }

        &.rui-surface--elevation-21 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(21)};
        }

        &.rui-surface--elevation-22 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(22)};
        }

        &.rui-surface--elevation-23 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(23)};
        }

        &.rui-surface--elevation-24 {
            --rui-comp-surface-background: #{elevations.dark-surface-color(24)};
        }
    }

    &--outlined {
        border: 1px solid var(--rui-comp-surface-outline-color);
        z-index: elevations.z-index(1);
    }

    &--elevation-0 {
        @include elevations.level(0);
    }

    &--elevation-1 {
        @include elevations.level(1);
    }

    &--elevation-2 {
        @include elevations.level(2);
    }

    &--elevation-3 {
        @include elevations.level(3);
    }

    &--elevation-4 {
        @include elevations.level(4);
    }

    &--elevation-5 {
        @include elevations.level(5);
    }

    &--elevation-6 {
        @include elevations.level(6);
    }

    &--elevation-7 {
        @include elevations.level(7);
    }

    &--elevation-8 {
        @include elevations.level(8);
    }

    &--elevation-9 {
        @include elevations.level(9);
    }

    &--elevation-10 {
        @include elevations.level(10);
    }

    &--elevation-11 {
        @include elevations.level(11);
    }

    &--elevation-12 {
        @include elevations.level(12);
    }

    &--elevation-13 {
        @include elevations.level(13);
    }

    &--elevation-14 {
        @include elevations.level(14);
    }

    &--elevation-15 {
        @include elevations.level(15);
    }

    &--elevation-16 {
        @include elevations.level(16);
    }

    &--elevation-17 {
        @include elevations.level(17);
    }

    &--elevation-18 {
        @include elevations.level(18);
    }

    &--elevation-19 {
        @include elevations.level(19);
    }

    &--elevation-20 {
        @include elevations.level(20);
    }

    &--elevation-21 {
        @include elevations.level(21);
    }

    &--elevation-22 {
        @include elevations.level(22);
    }

    &--elevation-23 {
        @include elevations.level(23);
    }

    &--elevation-24 {
        @include elevations.level(24);
    }
}
</style>
