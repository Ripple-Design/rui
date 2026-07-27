<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RSurfaceProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RSurfaceProps>(), {
    variant: "elevated",
    as: "div",
})

function normalizeElevation(value: number | undefined) {
    if (typeof value !== "number" || !Number.isFinite(value)) return 2
    return Math.max(0, Math.min(24, Math.round(value)))
}

const attrs = useAttrs()
const tagName = computed(() => props.as)
const elevation = computed(() => normalizeElevation(props.elevation))
const elevationClass = computed(() => `rui-surface--elevation-${elevation.value}`)
const classes = computed(() => [
    "rui-surface",
    `rui-surface--${props.variant}`,
    props.variant === "elevated" ? elevationClass.value : "rui-surface--elevation-0",
])
</script>

<template>
    <component :is="tagName" v-bind="attrs" :class="classes">
        <slot />
    </component>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/shape";
@use "@/styles/elevations";

.rui-surface {
    --rui-surface-shape-family: var(--rui-sys-shape-medium-family);
    --rui-surface-shape-start-start: var(--rui-sys-shape-medium-start-start);
    --rui-surface-shape-start-end: var(--rui-sys-shape-medium-start-end);
    --rui-surface-shape-end-end: var(--rui-sys-shape-medium-end-end);
    --rui-surface-shape-end-start: var(--rui-sys-shape-medium-end-start);

    display: block;
    box-sizing: border-box;
    position: relative;
    margin: 0;
    padding: 0;
    background-color: color.$surface;
    color: color.$on-surface;

    @include shape.apply(
        var(--rui-surface-shape-family),
        var(--rui-surface-shape-start-start),
        var(--rui-surface-shape-start-end),
        var(--rui-surface-shape-end-end),
        var(--rui-surface-shape-end-start)
    );

    &--outlined {
        border: 1px solid color.$on-surface-outline;
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
