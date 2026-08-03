<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RTextProps, RTextVariant } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RTextProps>(), {
    variant: "body1",
    emphasis: "high",
    disabled: false,
})

const attrs = useAttrs()
const effectiveEmphasis = computed(() => (props.disabled ? "low" : props.emphasis))

const resolvedTag = computed(() => {
    if (props.as) return props.as

    switch (props.variant) {
        case "headline1":
            return "h1"
        case "headline2":
            return "h2"
        case "headline3":
            return "h3"
        case "headline4":
            return "h4"
        case "headline5":
            return "h5"
        case "headline6":
            return "h6"
        case "subtitle1":
        case "subtitle2":
        case "body1":
        case "body2":
            return "p"
        case "caption":
        case "button":
        case "overline":
        default:
            return "span"
    }
})

const classes = computed(() => [
    "rui-text",
    `rui-text--${props.variant}`,
    {
        [`rui-text--color-${props.color}`]: props.color,
        [`rui-text--emphasis-${effectiveEmphasis.value}`]: effectiveEmphasis.value,
        "rui-text--disabled": props.disabled,
    },
])
</script>

<template>
    <component :is="resolvedTag" v-bind="attrs" :class="classes" :aria-disabled="disabled ? 'true' : undefined">
        <slot />
    </component>
</template>

<style scoped lang="scss">
.rui-text {
    --rui-comp-text-color: inherit;
    --rui-comp-text-color-high: var(--rui-comp-surface-content-color-high, var(--rui-sys-color-on-surface-high));
    --rui-comp-text-color-medium: var(--rui-comp-surface-content-color-medium, var(--rui-sys-color-on-surface-medium));
    --rui-comp-text-color-low: var(--rui-comp-surface-content-color-low, var(--rui-sys-color-on-surface-low));

    margin: 0;
    padding: 0;
    color: var(--rui-comp-text-color);

    &--color-primary {
        --rui-comp-text-color: var(--rui-sys-color-primary);
        --rui-comp-text-color-high: var(--rui-sys-color-primary-high);
        --rui-comp-text-color-medium: var(--rui-sys-color-primary-medium);
        --rui-comp-text-color-low: var(--rui-sys-color-primary-low);
    }

    &--color-secondary {
        --rui-comp-text-color: var(--rui-sys-color-secondary);
        --rui-comp-text-color-high: var(--rui-sys-color-secondary-high);
        --rui-comp-text-color-medium: var(--rui-sys-color-secondary-medium);
        --rui-comp-text-color-low: var(--rui-sys-color-secondary-low);
    }

    &--color-onsurface {
        --rui-comp-text-color: var(--rui-sys-color-on-surface);
        --rui-comp-text-color-high: var(--rui-sys-color-on-surface-high);
        --rui-comp-text-color-medium: var(--rui-sys-color-on-surface-medium);
        --rui-comp-text-color-low: var(--rui-sys-color-on-surface-low);
    }

    &--emphasis-high {
        --rui-comp-text-color: var(--rui-comp-text-color-high);
    }

    &--emphasis-medium {
        --rui-comp-text-color: var(--rui-comp-text-color-medium);
    }

    &--emphasis-low {
        --rui-comp-text-color: var(--rui-comp-text-color-low);
    }
}
</style>
