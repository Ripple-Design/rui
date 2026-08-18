<script setup lang="ts">
import { computed, provide, useAttrs } from "vue"

import type { RListProps } from "./types.ts"

import { listKey } from "./context.ts"

const props = withDefaults(defineProps<RListProps>(), {
    divider: "none",
})
const attrs = useAttrs()
const divider = computed(() => props.divider)

provide(listKey, { divider })
</script>

<template>
    <ul v-bind="attrs" :class="['rui-list', `rui-list--divider-${divider}`]">
        <slot />
    </ul>
</template>

<style scoped lang="scss">
@use "@/styles/color";

.rui-list {
    --rui-comp-list-divider-color: #{color.$on-surface-outline};
    --rui-comp-list-divider-thickness: 1px;
    --rui-comp-list-item-padding-inline: 16px;
    --rui-comp-list-item-icon-size: 24px;
    --rui-comp-list-item-icon-gap: 16px;

    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>
