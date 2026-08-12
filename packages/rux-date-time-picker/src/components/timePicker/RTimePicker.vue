<script setup lang="ts">
import { RIAccessTimeOutlined } from "@ripple-design/icons"
import { RTextField } from "@ripple-design/rui"
import { computed } from "vue"

import { formatDisplayTime, parseTime, resolveTimeFormat } from "../../time/formatting"

import type { TimeIsoString } from "../../time/types"
import RTimePickerDialog from "./RTimePickerDialog.vue"

import type { RTimePickerProps } from "./types"

const props = withDefaults(defineProps<RTimePickerProps>(), {
    modelValue: null,
    open: false,
    locale: () => (typeof navigator === "undefined" ? "en-US" : navigator.language),
    timeFormat: "locale",
    inputMode: "clock",
    disabled: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
})

const emit = defineEmits<{
    (event: "update:modelValue", value: TimeIsoString): void
    (event: "update:open", value: boolean): void
    (event: "confirm", value: TimeIsoString): void
    (event: "cancel"): void
    (event: "open"): void
    (event: "close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
}>()

const labels = computed(() => ({
    cancel: "Cancel",
    confirm: "OK",
    switchToClock: "Switch to clock input mode",
    switchToKeyboard: "Switch to keyboard input mode",
    hour: "Hour",
    minute: "Minute",
    am: "AM",
    pm: "PM",
    ...props.labels,
}))
const displayValue = computed(() => formatDisplayTime(parseTime(props.modelValue), props.locale, resolveTimeFormat(props.locale, props.timeFormat)))

function updateOpen(value: boolean) {
    emit("update:open", value)
    if (value) emit("open")
}

function confirm(value: TimeIsoString) {
    emit("update:modelValue", value)
    emit("confirm", value)
}
</script>

<template>
    <slot name="trigger" :open="() => updateOpen(true)" :value="modelValue">
        <RTextField
            :model-value="displayValue"
            label="Time"
            :end-icon="RIAccessTimeOutlined"
            readonly
            :disabled="disabled"
            @click="updateOpen(true)"
        />
    </slot>

    <RTimePickerDialog
        :model-value="modelValue"
        :open="open"
        :locale="locale"
        :time-format="timeFormat"
        :input-mode="inputMode"
        :title="title"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :labels="labels"
        @update:open="updateOpen"
        @confirm="confirm"
        @cancel="emit('cancel')"
        @close="emit('close', $event)"
    >
        <template v-if="$slots.title" #title><slot name="title" /></template>
    </RTimePickerDialog>
</template>
