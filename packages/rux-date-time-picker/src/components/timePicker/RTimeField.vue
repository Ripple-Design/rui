<script setup lang="ts">
import { vRipple } from "@ripple-design/rui/foundations/ripple"
import { computed, nextTick, ref } from "vue"

import { formatClockValue, getDisplayHour, withDisplayHour } from "../../time/formatting"

import type { ResolvedTimeFormat, TimePickerInputMode, TimePickerSelection, TimeValue } from "../../time/types"

const props = defineProps<{
    mode: TimePickerInputMode
    value: TimeValue
    locale: string
    timeFormat: ResolvedTimeFormat
    selection: TimePickerSelection
    hourLabel: string
    minuteLabel: string
}>()

const emit = defineEmits<{
    (event: "update:value", value: TimeValue): void
    (event: "update:selection", value: TimePickerSelection): void
}>()

const minuteRef = ref<HTMLInputElement | null>(null)
const displayHour = computed(() => getDisplayHour(props.value, props.timeFormat))
const maxHour = computed(() => props.timeFormat === "12h" ? 12 : 23)
const clockMode = computed(() => props.mode === "clock")

function select(selection: TimePickerSelection) {
    emit("update:selection", selection)
}

function updateHour(event: Event) {
    const hour = Number((event.target as HTMLInputElement).value)
    if (!Number.isInteger(hour) || hour < (props.timeFormat === "12h" ? 1 : 0) || hour > maxHour.value) return
    emit("update:value", withDisplayHour(props.value, hour, props.timeFormat))
    if ((event.target as HTMLInputElement).value.length === 2) {
        select("minute")
        void nextTick(() => minuteRef.value?.focus())
    }
}

function updateMinute(event: Event) {
    const minute = Number((event.target as HTMLInputElement).value)
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) return
    emit("update:value", { ...props.value, minute })
}
</script>

<template>
    <div class="rui-time-picker__field" :class="`rui-time-picker__field--${mode}`" role="group" aria-label="Time input">
        <button
            v-if="clockMode"
            v-ripple
            type="button"
            class="rui-time-picker__field-segment rui-time-picker__field-segment--button"
            :class="{ 'rui-time-picker__field-segment--active': selection === 'hour' }"
            :aria-pressed="selection === 'hour'"
            :aria-label="`${hourLabel}: ${formatClockValue(displayHour, locale, timeFormat === '24h')}`"
            @click="select('hour')"
        >
            {{ formatClockValue(displayHour, locale, timeFormat === '24h') }}
        </button>
        <label v-else class="rui-time-picker__field-segment rui-time-picker__field-segment--input" :class="{ 'rui-time-picker__field-segment--active': selection === 'hour' }">
            <input
                :value="formatClockValue(displayHour, locale, timeFormat === '24h')"
                inputmode="numeric"
                maxlength="2"
                :min="timeFormat === '12h' ? 1 : 0"
                :max="maxHour"
                :aria-label="hourLabel"
                @focus="select('hour')"
                @input="updateHour"
            >
        </label>
        <span class="rui-time-picker__field-divider" aria-hidden="true">:</span>
        <button
            v-if="clockMode"
            v-ripple
            type="button"
            class="rui-time-picker__field-segment rui-time-picker__field-segment--button"
            :class="{ 'rui-time-picker__field-segment--active': selection === 'minute' }"
            :aria-pressed="selection === 'minute'"
            :aria-label="`${minuteLabel}: ${formatClockValue(value.minute, locale, true)}`"
            @click="select('minute')"
        >
            {{ formatClockValue(value.minute, locale, true) }}
        </button>
        <label v-else class="rui-time-picker__field-segment rui-time-picker__field-segment--input" :class="{ 'rui-time-picker__field-segment--active': selection === 'minute' }">
            <input
                ref="minuteRef"
                :value="formatClockValue(value.minute, locale, true)"
                inputmode="numeric"
                maxlength="2"
                min="0"
                max="59"
                :aria-label="minuteLabel"
                @focus="select('minute')"
                @input="updateMinute"
            >
        </label>
        <template v-if="!clockMode">
            <span class="rui-time-picker__field-label">{{ hourLabel }}</span>
            <span class="rui-time-picker__field-label">{{ minuteLabel }}</span>
        </template>
    </div>
</template>
