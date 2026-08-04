<script setup lang="ts">
/**
 * Number fields let users enter and edit numeric values.
 */
import { computed, ref, useAttrs, useId, watch } from "vue"

import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"

import type { RNumberFieldProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<RNumberFieldProps>()

const attrs = useAttrs()
const generatedId = useId()
const inputId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const helperId = computed(() => `${inputId.value}-helper`)
const describedBy = computed(() => {
    const external = typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : ""
    const ids = [external, props.helperText?.trim() ? helperId.value : ""]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const inputRef = ref<InstanceType<typeof RFieldInput> | null>(null)

const model = defineModel<number | null>()
const inputValue = ref(model.value == null ? "" : String(model.value))
const isFocused = ref(false)
const allowNegative = computed(() => props.min == null || props.min < 0)

function clampValue(value: number) {
    let next = value

    if (props.min != null) {
        next = Math.max(next, props.min)
    }

    if (props.max != null) {
        next = Math.min(next, props.max)
    }

    return next
}

watch(
    () => model.value,
    (value) => {
        if (!isFocused.value) {
            inputValue.value = value == null ? "" : String(value)
        }
    },
)

watch(inputValue, (value) => {
    if (
        value === "" ||
        (allowNegative.value && value === "-") ||
        (props.inputType === "decimal" && value === ".") ||
        (props.inputType === "decimal" && allowNegative.value && value === "-.")
    ) {
        model.value = null
        return
    }

    if (props.inputType === "decimal") {
        const decimalPattern = allowNegative.value ? /^-?(?:\d+|\d*\.\d+)$/ : /^(?:\d+|\d*\.\d+)$/
        if (decimalPattern.test(value)) {
            model.value = clampValue(Number(value))
        }
        return
    }

    const numericPattern = allowNegative.value ? /^-?\d+$/ : /^\d+$/
    if (numericPattern.test(value)) {
        model.value = clampValue(Number(value))
    }
})

watch(isFocused, (focused) => {
    if (!focused) {
        inputValue.value = model.value == null ? "" : String(model.value)
    }
})

const hasValue = computed(() => inputValue.value.trim() !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)

function focus() {
    inputRef.value?.focus()
}
</script>

<template>
    <RFieldShell
        :label="label"
        :focused="isFocused"
        :floating="isFloating"
        :has-value="hasValue"
        :input-id="inputId"
        :helper-id="helperId"
        :helper-text="helperText"
        @focus-request="focus"
        @focus-state-change="isFocused = $event"
    >
        <RFieldInput
            ref="inputRef"
            v-bind="attrs"
            :id="inputId"
            :aria-describedby="describedBy"
            v-model="inputValue"
            :focused="isFocused"
            :input-type="inputType ?? 'numeric'"
            :allow-negative="allowNegative"
            :placeholder="placeholder"
            :show-placeholder="showPlaceholder"
        />
    </RFieldShell>
</template>
