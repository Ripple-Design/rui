<script setup lang="ts">
import { computed, provide } from "vue"

import RRow from "@/components/stack/RRow.vue"

import type { RButtonRowProps } from "./types"

import { buttonRowVariantKey } from "./groupContext"

const props = withDefaults(defineProps<RButtonRowProps>(), {
    variant: "text",
})

provide(buttonRowVariantKey, computed(() => props.variant))
</script>

<template>
    <RRow class="rui-button-row" gap="8px" wrap align="center" justify="flex-start">
        <slot />

        <div v-if="$slots.end" class="rui-button-row__end">
            <slot name="end" />
        </div>
    </RRow>
</template>

<style scoped>
.rui-button-row {
    --rui-comp-button-row-touch-target-enabled: clamp(0, calc(var(--rui-sys-density-scale) + 1), 1);

    margin-inline: 8px;
    padding-block: calc(8px - (6px * var(--rui-comp-button-row-touch-target-enabled)));
    column-gap: 8px;
    row-gap: calc(12px - (12px * var(--rui-comp-button-row-touch-target-enabled)));
}

.rui-button-row:has(> .rui-button-row__end) {
    margin-inline-end: 0;
}

.rui-button-row__end {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-start: auto;
}
</style>
