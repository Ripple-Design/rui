<script setup lang="ts">
import { computed, useAttrs, useId } from "vue"

import type { RListGroupProps } from "./types"

const props = withDefaults(defineProps<RListGroupProps>(), {
    divider: true,
})
const attrs = useAttrs()
const headingId = useId()
const hasHeading = computed(() => props.label != null)
</script>

<template>
    <li
        v-bind="attrs"
        :class="['rui-list-group', { 'rui-list-group--divider': divider }]"
    >
        <div v-if="hasHeading || $slots.header" :id="headingId" class="rui-list-group__header">
            <slot name="header">{{ label }}</slot>
        </div>
        <ul
            class="rui-list-group__items"
            :aria-labelledby="hasHeading || $slots.header ? headingId : undefined"
        >
            <slot />
        </ul>
    </li>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-list-group {
    box-sizing: border-box;
    list-style: none;

    &--divider:not(:last-child) {
        padding-block-end: 8px;
    }

    &--divider + & {
        padding-block-start: 8px;
        border-block-start: 1px solid var(--rui-comp-list-divider-color, #{color.$on-surface-outline});
    }
}

.rui-list-group__header {
    @include typography.subtitle2("--rui-comp-list-group-header");

    padding: 8px var(--rui-comp-list-item-padding-inline, 16px);
    color: color.$on-surface-medium;
}

.rui-list-group__items {
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>
