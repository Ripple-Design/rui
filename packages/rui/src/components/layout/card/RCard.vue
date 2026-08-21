<script setup lang="ts">
import { computed, ref } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RCardProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"

const props = withDefaults(defineProps<RCardProps>(), {
    variant: "elevated",
    color: "surface",
    elevation: 2,
    hoverElevation: 8,
    clickable: false,
    selectable: false,
    selected: false,
    activated: false,
    dragged: false,
})

const hovered = ref(false)
const elevation = computed(() => (props.dragged || hovered.value ? props.hoverElevation : props.elevation))
const hoverShadow = computed(() => `var(--rui-sys-elevation-shadow-${props.hoverElevation})`)
const selected = computed(() => props.selectable && props.selected)
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: !props.clickable,
    color: "var(--rui-comp-surface-content-color)",
    contrast: "low",
    selected: selected.value,
}))
const classes = computed(() => [
    "rui-card",
    `rui-card--${props.variant}`,
    {
        "rui-card--selectable": props.selectable,
        "rui-card--selected": selected.value,
        "rui-card--activated": props.activated,
        "rui-card--hovered": hovered.value,
        "rui-card--dragged": props.dragged,
    },
])
</script>

<template>
    <RSurface
        v-ripple="rippleOptions"
        :variant="variant"
        :color="color"
        :content-color="contentColor"
        :elevation="elevation"
        :class="classes"
        @pointerenter="hovered = true"
        @pointerleave="hovered = false"
    >
        <slot />
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/elevations";
@use "@/styles/motion";

.rui-card {
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
        #{elevations.transitionValue()},
        outline-color motion.$duration-small-in motion.$easing-standard;

    &--hovered,
    &--dragged {
        box-shadow: v-bind(hoverShadow);
    }

    &--activated {
        outline-color: var(--rui-sys-color-primary);
    }
}
</style>
