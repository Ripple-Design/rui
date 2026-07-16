<script setup lang="ts">
/**
 * Text fields let users enter and edit text.
 */

import { computed, ref } from "vue"

import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"

import type { RTextFieldProps } from "./types"

const props = defineProps<RTextFieldProps>()

const model = defineModel<string>()

const isFocused = ref(false)
const hasValue = computed(() => model.value != null && model.value !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)
</script>

<template>
    <RFieldShell
        :label="label"
        :focused="isFocused"
        :floating="isFloating"
        :has-value="hasValue"
        :text-area="textArea"
        @focus-state-change="isFocused = $event"
    >
        <RFieldInput
            v-model="model"
            :focused="isFocused"
            :placeholder="placeholder"
            :show-placeholder="showPlaceholder"
            :text-area="textArea"
        />
    </RFieldShell>
</template>
