<script setup lang="ts">
/**
 * Text fields let users enter and edit text.
 */

import { computed, ref } from "vue"

import type { RTextFieldProps } from "./types.ts"

import RTextFieldShell from "./components/RTextFieldShell.vue"
import RTextInput from "./RTextInput.vue"

const props = defineProps<RTextFieldProps>()

const model = defineModel<string>()
const isFocused = ref(false)
const hasValue = computed(() => model.value != null && model.value !== "")
const shouldFloatLabel = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || shouldFloatLabel.value)
</script>

<template>
    <RTextFieldShell
        class="rui-text-field"
        :label="props.label"
        :should-float-label="shouldFloatLabel"
        @focus-state-change="isFocused = $event"
    >
        <RTextInput
            class="rui-text-field__input"
            v-model="model"
            :placeholder="props.placeholder"
            :show-placeholder="showPlaceholder"
            :text-area="props.textArea"
        />
    </RTextFieldShell>
</template>

<style scoped lang="scss">
.rui-text-field {
    &__input {
        padding: 0 16px;
    }
}
</style>
