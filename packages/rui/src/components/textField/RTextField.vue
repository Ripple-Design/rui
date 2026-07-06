<script setup lang="ts">
import { computed } from "vue"

import type { RTextFieldProps } from "./types.ts"

import RTextFieldShell from "./components/RTextFieldShell.vue"
import RTextInput from "./RTextInput.vue"

defineProps<RTextFieldProps>()

const model = defineModel<string>()
const hasValue = computed(() => model.value != null && model.value !== "")
</script>

<template>
    <RTextFieldShell :has-value="hasValue" :label="label">
        <RTextInput v-model="model" :placeholder="placeholder" />
    </RTextFieldShell>
</template>

<style scoped lang="scss"></style>
