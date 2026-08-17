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
    margin-inline: 8px;
    column-gap: 8px;
    row-gap: 0;
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
