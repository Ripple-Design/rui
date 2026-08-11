<script setup lang="ts">
import { RICalendarTodayOutlined } from "@ripple-design/icons"
import { RTextField } from "@ripple-design/rui"
import { computed } from "vue"

import { formatInputDate } from "../../date/formatting"

import type { DateRangeValue } from "../../date/types"
import type { RDateRangePickerProps } from "./types"
import RDatePickerDialog from "./RDatePickerDialog.vue"

const props = withDefaults(defineProps<RDateRangePickerProps>(), {
    modelValue: () => ({ start: null, end: null }),
    open: false,
    locale: () => (typeof navigator === "undefined" ? "en-US" : navigator.language),
    inputMode: "calendar",
    disabled: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
})

const emit = defineEmits<{
    (event: "update:modelValue", value: DateRangeValue): void
    (event: "update:open", value: boolean): void
    (event: "confirm", value: DateRangeValue): void
    (event: "cancel"): void
    (event: "open"): void
    (event: "close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
}>()

const labels = computed(() => ({
    cancel: "Cancel",
    confirm: "OK",
    save: "Save",
    switchToCalendar: "Switch to calendar input mode",
    switchToText: "Switch to text input mode",
    previousMonth: "Change to previous month",
    nextMonth: "Change to next month",
    ...props.labels,
}))
const displayValue = computed(() => {
    const { start, end } = props.modelValue
    if (!start) return ""
    if (!end) return formatInputDate(start, props.locale)
    return `${formatInputDate(start, props.locale)} – ${formatInputDate(end, props.locale)}`
})

function updateOpen(value: boolean) {
    emit("update:open", value)
    if (value) emit("open")
}

function confirm(value: DateRangeValue) {
    emit("update:modelValue", value)
    emit("confirm", value)
}
</script>

<template>
    <slot name="trigger" :open="() => updateOpen(true)" :value="modelValue">
        <RTextField
            :model-value="displayValue"
            label="Date range"
            :end-icon="RICalendarTodayOutlined"
            readonly
            :disabled="disabled"
            @click="updateOpen(true)"
        />
    </slot>

    <RDatePickerDialog
        mode="range"
        :model-value="modelValue"
        :open="open"
        :locale="locale"
        :constraints="{ min, max, openAt, isDateDisabled }"
        :input-mode="inputMode"
        :title="title"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :labels="labels"
        @update:open="updateOpen"
        @confirm="confirm($event as DateRangeValue)"
        @cancel="emit('cancel')"
        @close="emit('close', $event)"
    >
        <template v-if="$slots.title" #title><slot name="title" /></template>
    </RDatePickerDialog>
</template>
