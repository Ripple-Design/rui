<script setup lang="ts">
/**
 * Text fields let users enter and edit text.
 */

import { RICancelFilled, RICancelOutlined, RICancelRounded, RICancelSharp, RICancelTwoTone } from "@ripple-design/icons"
import { computed, ref, useAttrs, useId, useSlots } from "vue"

import RIconButton from "@/components/button/RIconButton.vue"
import { createIconFamily } from "@/components/icon/family"
import RIcon from "@/components/icon/RIcon.vue"
import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"

import type { RTextFieldProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RTextFieldProps>(), {
    clearable: false,
    clearLabel: "Clear",
})

const attrs = useAttrs()
const slots = useSlots()
const generatedId = useId()
const inputId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const helperId = computed(() => `${inputId.value}-helper`)
const error = computed(() => !!props.errorText?.trim())
const describedBy = computed(() => {
    const external = typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : ""
    const ids = [external, props.errorText?.trim() || props.helperText?.trim() ? helperId.value : ""]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const inputRef = ref<InstanceType<typeof RFieldInput> | null>(null)

const model = defineModel<string>()

const isFocused = ref(false)
const hasValue = computed(() => model.value != null && model.value !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)
const hasStartIcon = computed(() => !!props.startIcon || !!slots["start-icon"])
const showClear = computed(() => props.clearable && hasValue.value)
const hasEndIcon = computed(() => !!props.endIcon || !!slots["end-icon"] || showClear.value)
const clearIcon = createIconFamily(RICancelFilled, RICancelOutlined, RICancelRounded, RICancelSharp, RICancelTwoTone)

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
        :error-text="errorText"
        :error="error"
        :has-start-icon="hasStartIcon"
        :has-end-icon="hasEndIcon"
        @focus-request="focus"
        @focus-state-change="isFocused = $event"
    >
        <template #start-icon>
            <slot name="start-icon">
                <RIcon v-if="startIcon" :icon="startIcon" :size="24" decorative />
            </slot>
        </template>

        <RFieldInput
            ref="inputRef"
            v-bind="attrs"
            :id="inputId"
            :aria-describedby="describedBy"
            :aria-invalid="error ? 'true' : undefined"
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
                <RIcon v-else-if="endIcon" :icon="endIcon" :size="24" decorative />
            </slot>
        </template>
    </RFieldShell>
</template>
