<script setup lang="ts">
import { computed } from "vue"

import { addMonths, getMonth, getToday, getWeekStart } from "../../date/dateMath"
import { formatMonthLabel, formatWeekdayLabels } from "../../date/formatting"

import type { CalendarMonth, DateIsoString, DatePickerConstraints } from "../../date/types"
import RCalendar from "./RCalendar.vue"

const props = defineProps<{
    anchorMonth: CalendarMonth
    locale: string
    constraints: DatePickerConstraints
    selected?: DateIsoString | null
    rangeStart?: DateIsoString | null
    rangeEnd?: DateIsoString | null
    focusedDate: DateIsoString
}>()

const emit = defineEmits<{
    (event: "select", date: DateIsoString): void
    (event: "keydown", value: KeyboardEvent): void
}>()

const weekStart = computed(() => getWeekStart(props.locale))
const weekdays = computed(() => formatWeekdayLabels(props.locale, weekStart.value))
const startMonth = computed(() => getMonth(props.constraints.min ?? "1900-01-01"))
const endMonth = computed(() => getMonth(props.constraints.max ?? "2100-12-31"))

const months = computed(() => {
    const startOffset = Math.max(-6, (startMonth.value.year - props.anchorMonth.year) * 12 + startMonth.value.month - props.anchorMonth.month)
    const endOffset = Math.min(6, (endMonth.value.year - props.anchorMonth.year) * 12 + endMonth.value.month - props.anchorMonth.month)
    return Array.from({ length: endOffset - startOffset + 1 }, (_, index) => addMonths(props.anchorMonth, startOffset + index))
})
</script>

<template>
    <section class="rui-date-picker__fullscreen-calendar" data-rui-modal-scrollable>
        <div class="rui-date-picker__weekdays rui-date-picker__weekdays--fullscreen" aria-hidden="true">
            <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
        </div>
        <div class="rui-date-picker__fullscreen-divider" aria-hidden="true" />
        <div class="rui-date-picker__fullscreen-month-list">
            <RCalendar
                v-for="month in months"
                :key="`${month.year}-${month.month}`"
                :month="month"
                :locale="locale"
                :constraints="constraints"
                :selected="selected"
                :range-start="rangeStart"
                :range-end="rangeEnd"
                :focused-date="focusedDate"
                :show-navigation="false"
                :show-weekdays="false"
                @select="emit('select', $event)"
                @keydown="emit('keydown', $event)"
            />
        </div>
    </section>
</template>
