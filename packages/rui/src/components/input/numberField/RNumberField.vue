<script setup lang="ts">
/**
 * Number fields let users enter and edit numeric values.
 */
import { computed, ref, toRef, unref, useAttrs, useId, watch } from "vue"

import RFieldInput from "@/components/internal/input/RFieldInput.vue"
import RFieldShell from "@/components/internal/input/RFieldShell.vue"
import { useFormField } from "@/components/layout/form/useFormField.ts"

import type { RNumberFieldProps } from "./types.ts"

const props = defineProps<RNumberFieldProps>()

const attrs = useAttrs()
const generatedId = useId()
const name = computed(() => (typeof attrs.name === "string" ? attrs.name : undefined))
const localModel = defineModel<number | null>()
const formField = useFormField({
    defaultValue: null,
    model: localModel,
    name,
    required: toRef(props, "required"),
})
const model = formField.model
const externalErrorText = computed(() => unref(props.errorText))
const errorText = computed(() => externalErrorText.value ?? formField.errorText.value)
const error = computed(() => !!errorText.value?.trim())
const required = formField.required
const inputId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const helperId = computed(() => `${inputId.value}-helper`)
const describedBy = computed(() => {
    const external = typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : ""
    const ids = [
        external,
        errorText.value?.trim() || props.helperText?.trim() || formField.helperIndicator.value ? helperId.value : "",
    ]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const inputRef = ref<InstanceType<typeof RFieldInput> | null>(null)

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

function handleFocusStateChange(focused: boolean) {
    isFocused.value = focused

    if (!focused) {
        formField.onBlur()
    }
}

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
        :helper-indicator="formField.helperIndicator.value"
        :error-text="errorText"
        :error="error"
        :required="required"
        :label-suffix="formField.labelSuffix.value"
        @focus-request="focus"
        @focus-state-change="handleFocusStateChange"
    >
        <RFieldInput
            ref="inputRef"
            v-bind="attrs"
            :id="inputId"
            :aria-describedby="describedBy"
            :aria-invalid="error ? 'true' : undefined"
            :required="required"
            v-model="inputValue"
            :focused="isFocused"
            :input-type="inputType ?? 'numeric'"
            :allow-negative="allowNegative"
            :placeholder="placeholder"
            :show-placeholder="showPlaceholder"
        />
    </RFieldShell>
</template>
