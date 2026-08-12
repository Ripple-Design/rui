<script setup lang="ts">
import {
    RIAccessTimeFilled,
    RIAccessTimeOutlined,
    RIAccessTimeRounded,
    RIAccessTimeSharp,
    RIAccessTimeTwoTone,
    RIKeyboardFilled,
    RIKeyboardOutlined,
    RIKeyboardRounded,
    RIKeyboardSharp,
    RIKeyboardTwoTone,
} from "@ripple-design/icons"
import { createIconFamily, RButton, RDialog, RIconButton } from "@ripple-design/rui"
import { computed, nextTick, ref, watch } from "vue"

import { getPeriod, resolveTimeFormat, withPeriod } from "../../time/formatting"

import type { ResolvedTimeFormat, TimeIsoString, TimePickerInputMode, TimePickerSelection, TimeValue } from "../../time/types"
import RTimeField from "./RTimeField.vue"
import RTimePickerClock from "./RTimePickerClock.vue"
import { useTimePickerState } from "./composables/useTimePickerState"

import type { TimePickerCloseDetail, TimePickerDialogLabels } from "./types"

const props = withDefaults(defineProps<{
    modelValue: TimeIsoString | null
    open: boolean
    locale: string
    timeFormat: "locale" | "12h" | "24h"
    inputMode: TimePickerInputMode
    title?: string
    closeOnEscape?: boolean
    closeOnBackdrop?: boolean
    labels: TimePickerDialogLabels
}>(), {
    title: undefined,
    closeOnEscape: true,
    closeOnBackdrop: true,
})

const emit = defineEmits<{
    (event: "update:open", value: boolean): void
    (event: "confirm", value: TimeIsoString): void
    (event: "cancel"): void
    (event: "close", detail: TimePickerCloseDetail): void
}>()

const state = useTimePickerState(() => props.modelValue)
const activeSelection = ref<TimePickerSelection>("hour")
const inputMode = ref<TimePickerInputMode>(props.inputMode)
const confirmed = ref(false)
const resolvedTimeFormat = computed<ResolvedTimeFormat>(() => resolveTimeFormat(props.locale, props.timeFormat))
const isClockMode = computed(() => inputMode.value === "clock")
const period = computed(() => getPeriod(state.draft.value))
const title = computed(() => props.title ?? "Select time")
const clockIcon = createIconFamily(RIAccessTimeFilled, RIAccessTimeOutlined, RIAccessTimeRounded, RIAccessTimeSharp, RIAccessTimeTwoTone)
const keyboardIcon = createIconFamily(RIKeyboardFilled, RIKeyboardOutlined, RIKeyboardRounded, RIKeyboardSharp, RIKeyboardTwoTone)
const initialFocus = computed(() => isClockMode.value ? "[data-time-picker-clock-value][tabindex='0']" : ".rui-time-picker__field input")

function updateValue(value: TimeValue) {
    state.setValue(value)
}

function updateSelection(selection: TimePickerSelection) {
    activeSelection.value = selection
}

function updatePeriod(nextPeriod: "am" | "pm") {
    state.setValue(withPeriod(state.draft.value, nextPeriod))
}

function openPicker() {
    confirmed.value = false
    state.reset()
    activeSelection.value = "hour"
    inputMode.value = props.inputMode
    emit("update:open", true)
}

function closePicker(detail: TimePickerCloseDetail) {
    const wasConfirmed = confirmed.value
    if (!wasConfirmed) {
        state.reset()
        if (detail.reason !== "programmatic") emit("cancel")
    }
    confirmed.value = false
    emit("update:open", false)
    emit("close", detail)
}

function handleDialogModelValue(value: boolean) {
    if (!value && props.open) closePicker({ reason: "programmatic" })
}

function confirm() {
    confirmed.value = true
    emit("confirm", state.value.value)
    emit("update:open", false)
}

function toggleInputMode() {
    inputMode.value = inputMode.value === "clock" ? "keyboard" : "clock"
    void nextTick()
}

watch(() => props.open, (open) => {
    if (open) openPicker()
}, { immediate: true })

watch(() => props.inputMode, (mode) => {
    inputMode.value = mode
})

defineExpose({ open: openPicker })
</script>

<template>
    <RDialog
        :model-value="open"
        class="rui-time-picker-dialog"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :initial-focus="initialFocus"
        :aria-label="title"
        @update:model-value="handleDialogModelValue"
        @close="closePicker"
    >
        <div class="rui-time-picker__dialog-content">
            <p class="rui-time-picker__title"><slot name="title">{{ title }}</slot></p>
            <div class="rui-time-picker__body" :class="{ 'rui-time-picker__body--12h': resolvedTimeFormat === '12h' }">
                <RTimeField
                    :mode="inputMode"
                    :value="state.draft.value"
                    :locale="locale"
                    :time-format="resolvedTimeFormat"
                    :selection="activeSelection"
                    :hour-label="labels.hour"
                    :minute-label="labels.minute"
                    @update:value="updateValue"
                    @update:selection="updateSelection"
                />
                <div v-if="resolvedTimeFormat === '12h'" class="rui-time-picker__period" role="radiogroup" aria-label="AM or PM">
                    <button type="button" role="radio" :aria-checked="period === 'am'" :class="{ 'rui-time-picker__period-value--selected': period === 'am' }" @click="updatePeriod('am')">{{ labels.am }}</button>
                    <button type="button" role="radio" :aria-checked="period === 'pm'" :class="{ 'rui-time-picker__period-value--selected': period === 'pm' }" @click="updatePeriod('pm')">{{ labels.pm }}</button>
                </div>
                <RTimePickerClock
                    v-if="isClockMode"
                    :value="state.draft.value"
                    :locale="locale"
                    :time-format="resolvedTimeFormat"
                    :selection="activeSelection"
                    :hour-label="labels.hour"
                    :minute-label="labels.minute"
                    @update:value="updateValue"
                    @update:selection="updateSelection"
                />
            </div>
            <div class="rui-time-picker__actions">
                <RIconButton
                    class="rui-time-picker__mode-button"
                    :icon="isClockMode ? keyboardIcon : clockIcon"
                    :label="isClockMode ? labels.switchToKeyboard : labels.switchToClock"
                    @click="toggleInputMode"
                />
                <RButton class="rui-time-picker__cancel-button" variant="text" @click="closePicker({ reason: 'action', action: 'cancel' })">{{ labels.cancel }}</RButton>
                <RButton class="rui-time-picker__confirm-button" variant="text" @click="confirm">{{ labels.confirm }}</RButton>
            </div>
        </div>
    </RDialog>
</template>
