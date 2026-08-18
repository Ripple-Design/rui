<script setup lang="ts">
import { computed, provide, useAttrs } from "vue"

import { RSurface } from "@/components"
import { selectionModelKey, useSelectionModel } from "@/foundations/selection"

import type { RNavigationRailProps } from "./types.ts"

import { navigationRailKey } from "./context.ts"

const props = withDefaults(defineProps<RNavigationRailProps>(), {
    compact: false,
    labelVisibility: "always",
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const selection = useSelectionModel(model)
const classes = computed(() => ["rui-navigation-rail", { "rui-navigation-rail--compact": props.compact }])

provide(selectionModelKey, selection)
provide(navigationRailKey, {
    ...selection,
    compact: props.compact,
    labelVisibility: props.labelVisibility,
})
</script>

<template>
    <RSurface v-bind="attrs" :class="classes" as="nav" :elevation="0">
        <div class="rui-navigation-rail__divider" aria-hidden="true" />
        <div v-if="$slots.top" class="rui-navigation-rail__top">
            <slot name="top" />
        </div>
        <div class="rui-navigation-rail__items">
            <slot />
        </div>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/color";

.rui-navigation-rail {
    --rui-comp-navigation-rail-divider-color: #{color.$on-surface-outline};
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 72px;
    padding-block: 8px;
    overflow-x: hidden;
    overflow-y: hidden;
    background: color.$surface;
    color: color.$on-surface;

    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-start: 0;
    --rui-surface-shape-end-end: 0;

    &--compact {
        width: 56px;
    }
}

.rui-navigation-rail__divider {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    inline-size: 1px;
    background-color: var(--rui-comp-navigation-rail-divider-color);
    pointer-events: none;
}

.rui-navigation-rail__top {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-block-end: 8px;

    .rui-navigation-rail--compact & {
        width: 56px;
        height: 56px;
    }
}

.rui-navigation-rail__items {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>
