<script setup lang="ts">
import { useAttrs } from "vue"

import type { RDividerProps } from "./types.ts"

const props = withDefaults(defineProps<RDividerProps>(), {
    variant: "full-bleed",
})
const attrs = useAttrs()
</script>

<template>
    <hr v-bind="attrs" :class="['rui-divider', `rui-divider--${props.variant}`]" />
</template>

<style scoped lang="scss">
@use "@/styles/color";

.rui-divider {
    --rui-comp-divider-color: #{color.$on-surface-outline};
    --rui-comp-divider-middle-inset: 24px;

    box-sizing: border-box;
    inline-size: 100%;
    block-size: 1px;
    margin: 0;
    border: 0;
    border-block-start: 1px solid var(--rui-comp-divider-color);
}

.rui-divider--middle {
    inline-size: calc(100% - var(--rui-comp-divider-middle-inset) - var(--rui-comp-divider-middle-inset));
    margin-inline: var(--rui-comp-divider-middle-inset);
}

.rui-divider--inset {
    margin-inline: 0;
}

.rui-divider--full-bleed {
    margin-inline: 0;
}
</style>
