<script setup lang="ts">
/**
 * Text fields let users enter and edit text.
 */

import { computed, ref, useAttrs, useId, useSlots } from "vue"

import RIcon from "@/components/icon/RIcon.vue"
import RFieldInput from "@/components/input/RFieldInput.vue"
import RFieldShell from "@/components/input/RFieldShell.vue"

import type { RTextFieldProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<RTextFieldProps>()

const attrs = useAttrs()
const slots = useSlots()
const generatedId = useId()
const inputId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const inputRef = ref<InstanceType<typeof RFieldInput> | null>(null)

const model = defineModel<string>()

const isFocused = ref(false)
const hasValue = computed(() => model.value != null && model.value !== "")
const isFloating = computed(() => isFocused.value || hasValue.value)
const showPlaceholder = computed(() => !props.label || isFloating.value)
const hasStartIcon = computed(() => !!props.startIcon || !!slots["start-icon"])
const hasEndIcon = computed(() => !!props.endIcon || !!slots["end-icon"])

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
        :text-area="textArea"
        :input-id="inputId"
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
                <RIcon v-if="endIcon" :icon="endIcon" :size="24" decorative />
            </slot>
        </template>
    </RFieldShell>
</template>
