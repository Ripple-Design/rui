<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RTextProps, RTextVariant } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RTextProps>(), {
    variant: "body1",
})

const attrs = useAttrs()

const variant = computed<RTextVariant>(() => props.variant ?? "body1")

const resolvedTag = computed(() => {
    if (props.as) {
        return props.as
    }

    switch (variant.value) {
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

const classes = computed(() => ["rui-text", `rui-text--${variant.value}`])
</script>

<template>
    <component :is="resolvedTag" v-bind="attrs" :class="classes">
        <slot />
    </component>
</template>

<style scoped lang="scss">
.rui-text {
    margin: 0;
    color: inherit;
}
</style>
