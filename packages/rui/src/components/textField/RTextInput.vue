<script setup lang="ts">
import type { RTextInputProps } from "./types.ts"

withDefaults(defineProps<RTextInputProps>(), {
    textArea: false,
})

const model = defineModel<string>()
</script>

<template>
    <input v-if="!textArea" v-model="model" :placeholder="placeholder" />
    <textarea v-else v-model="model" :placeholder="placeholder" />
</template>
