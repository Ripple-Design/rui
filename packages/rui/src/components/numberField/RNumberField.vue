<script setup lang="ts">
/**
 * Number fields let users enter and edit numeric values.
 */
import { computed, ref, watch } from "vue"

import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"

import type { RNumberFieldProps } from "./types"

const props = defineProps<RNumberFieldProps>()

const model = defineModel<number | null>()
const inputValue = ref(model.value == null ? "" : String(model.value))
const isFocused = ref(false)

watch(
    () => model.value,
    (value) => {
        if (!isFocused.value) {
            inputValue.value = value == null ? "" : String(value)
        }
    },
)

watch(inputValue, (value) => {
    if (value === "") {
        model.value = null
        return
    }

    if (props.inputType === "decimal") {
        if (/^(?:\d+|\d*\.\d+)$/.test(value)) {
            model.value = Number(value)
        }
        return
    }

    model.value = Number(value)
})

watch(isFocused, (focused) => {
    if (!focused) {
        inputValue.value = model.value == null ? "" : String(model.value)
    }
})

const hasValue = computed(() => inputValue.value.trim() !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)
</script>

<template>
    <RFieldShell
        :label="label"
        :focused="isFocused"
        :floating="isFloating"
        :has-value="hasValue"
        @focus-state-change="isFocused = $event"
    >
        <RFieldInput
            v-model="inputValue"
            :focused="isFocused"
            :input-type="inputType ?? 'numeric'"
            :placeholder="placeholder"
            :show-placeholder="showPlaceholder"
        />
    </RFieldShell>
</template>
