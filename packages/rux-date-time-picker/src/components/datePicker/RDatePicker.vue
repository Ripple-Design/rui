<script setup lang="ts">
import { RICalendarTodayOutlined } from "@ripple-design/icons"
import { RTextField } from "@ripple-design/rui"
import { computed } from "vue"

import { formatInputDate } from "../../date/formatting"

import type { DateIsoString } from "../../date/types"
import { useDatePickerLabels } from "./localization"
import type { RDatePickerProps } from "./types"
import RDatePickerDialog from "./RDatePickerDialog.vue"

const props = withDefaults(defineProps<RDatePickerProps>(), {
    modelValue: null,
    open: false,
    locale: () => (typeof navigator === "undefined" ? "en-US" : navigator.language),
    inputMode: "calendar",
    disabled: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
})

const emit = defineEmits<{
    (event: "update:modelValue", value: DateIsoString | null): void
    (event: "update:open", value: boolean): void
    (event: "confirm", value: DateIsoString): void
    (event: "cancel"): void
    (event: "open"): void
    (event: "close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
}>()

const labels = useDatePickerLabels(() => props.locale)
const displayValue = computed(() => (props.modelValue ? formatInputDate(props.modelValue, props.locale) : ""))

function updateOpen(value: boolean) {
    emit("update:open", value)
    if (value) emit("open")
}

function confirm(value: DateIsoString) {
    emit("update:modelValue", value)
    emit("confirm", value)
}
</script>

<template>
    <slot name="trigger" :open="() => updateOpen(true)" :value="modelValue">
        <RTextField
            :model-value="displayValue"
            label="Date"
            :end-icon="RICalendarTodayOutlined"
            readonly
            :disabled="disabled"
            @click="updateOpen(true)"
        />
    </slot>

    <RDatePickerDialog
        mode="single"
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
        @confirm="confirm($event as DateIsoString)"
        @cancel="emit('cancel')"
        @close="emit('close', $event)"
    >
        <template v-if="$slots.title" #title><slot name="title" /></template>
    </RDatePickerDialog>
</template>
