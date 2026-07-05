<script setup lang="ts">
import type { RTextFieldBaseProps } from "./types.ts"

withDefaults(defineProps<RTextFieldBaseProps>(), {
    textArea: false,
})
</script>

<template>
    <input v-if="!textArea" class="rui-text-input" />
    <textarea v-else class="rui-text-input" />
</template>

<style scoped lang="scss">
.rui-text-input {
    border: none;
    background: transparent;
    outline: none;
}
</style>
