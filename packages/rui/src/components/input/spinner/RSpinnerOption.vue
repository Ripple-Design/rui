<script setup lang="ts">
import { useAttrs } from "vue"

import RMenuItem from "@/components/overlays/menu/RMenuItem.vue"

import type { RSpinnerOptionProps } from "./types.ts"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RSpinnerOptionProps>(), {
    disabled: false,
})

const emit = defineEmits<{
    (e: "click", event: MouseEvent | KeyboardEvent): void
}>()

const attrs = useAttrs()

function handleClick(event: MouseEvent | KeyboardEvent) {
    emit("click", event)
}
</script>

<template>
    <RMenuItem
        v-bind="attrs"
        :disabled="disabled"
        :icon="icon"
        :label="label"
        :value="value"
        @click="handleClick"
    >
        <slot />
    </RMenuItem>
</template>
