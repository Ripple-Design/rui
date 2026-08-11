<script setup lang="ts">
/**
 * Text fields let users enter and edit text.
 */

import { RICancelFilled, RICancelOutlined, RICancelRounded, RICancelSharp, RICancelTwoTone } from "@ripple-design/icons"
import { computed, ref, toRef, unref, useAttrs, useId, useSlots, type Slots } from "vue"

import RIconButton from "@/components/button/RIconButton.vue"
import { createIconFamily } from "@/components/icon/family"
import RIcon from "@/components/icon/RIcon.vue"
import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"
import { useFormField } from "@/components/form/useFormField"

import type { RTextFieldProps } from "./types"

const props = withDefaults(defineProps<RTextFieldProps>(), {
    clearable: false,
    clearLabel: "Clear",
})

const attrs = useAttrs()
const slots: Slots = useSlots()
const generatedId = useId()
const name = computed(() => (typeof attrs.name === "string" ? attrs.name : undefined))
const localModel = defineModel<string>()
const formField = useFormField({
    defaultValue: "",
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
    const ids = [external, errorText.value?.trim() || props.helperText?.trim() || formField.helperIndicator.value ? helperId.value : ""]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const inputRef = ref<InstanceType<typeof RFieldInput> | null>(null)

const isFocused = ref(false)
const hasValue = computed(() => model.value != null && model.value !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)
const hasStartIcon = computed(() => !!props.startIcon || !!slots["start-icon"])
const showClear = computed(() => props.clearable && hasValue.value)
const hasEndIcon = computed(() => !!props.endIcon || !!slots["end-icon"] || showClear.value)
const clearIcon = createIconFamily(RICancelFilled, RICancelOutlined, RICancelRounded, RICancelSharp, RICancelTwoTone)

function handleFocusStateChange(focused: boolean) {
    isFocused.value = focused

    if (!focused) {
        formField.onBlur()
    }
}

function focus() {
    inputRef.value?.focus()
}

function clear() {
    model.value = ""
    focus()
}
</script>

<template>
    <RFieldShell
        :label="label"
        :focused="isFocused"
        :floating="isFloating"
        :has-value="hasValue"
        :text-area="textArea"
        :input-id="inputId"
        :helper-id="helperId"
        :helper-text="helperText"
        :helper-indicator="formField.helperIndicator.value"
        :error-text="errorText"
        :error="error"
        :required="required"
        :label-suffix="formField.labelSuffix.value"
        :has-start-icon="hasStartIcon"
        :has-end-icon="hasEndIcon"
        @focus-request="focus"
        @focus-state-change="handleFocusStateChange"
    >
        <template #start-icon>
            <slot name="start-icon">
                <RIcon v-if="startIcon" :icon="startIcon" :size="24" emphasis="inherit" decorative />
            </slot>
        </template>

        <RFieldInput
            ref="inputRef"
            v-bind="attrs"
            :id="inputId"
            :aria-describedby="describedBy"
            :aria-invalid="error ? 'true' : undefined"
            :required="required"
            v-model="model"
            :focused="isFocused"
            :has-start-icon="hasStartIcon"
            :has-end-icon="hasEndIcon"
            :placeholder="placeholder"
            :show-placeholder="showPlaceholder"
            :text-area="textArea"
        />

        <template #end-icon>
            <slot name="end-icon">
                <RIconButton v-if="showClear" :icon="clearIcon" :label="clearLabel" @click="clear" />
                <RIcon v-else-if="endIcon" :icon="endIcon" :size="24" emphasis="inherit" decorative />
            </slot>
        </template>
    </RFieldShell>
</template>
