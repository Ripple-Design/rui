<script setup lang="ts">
import {
    RIChevronLeftFilled,
    RIChevronLeftOutlined,
    RIChevronLeftRounded,
    RIChevronLeftSharp,
    RIChevronLeftTwoTone,
    RIChevronRightFilled,
    RIChevronRightOutlined,
    RIChevronRightRounded,
    RIChevronRightSharp,
    RIChevronRightTwoTone,
} from "@ripple-design/icons"
import { createIconFamily, RIconButton, RSpinnerTrigger } from "@ripple-design/rui"
import { vRipple } from "@ripple-design/rui/foundations/ripple"
import { RTouchTargetWrapper } from "@ripple-design/rui/foundations/touchTarget"
import { computed } from "vue"

import { getCalendarDays, getToday, getWeekStart } from "../../date/dateMath"
import { formatAccessibleDate, formatMonthLabel, formatWeekdayLabels } from "../../date/formatting"

import type { CalendarMonth, DateIsoString, DatePickerConstraints } from "../../date/types"

const props = defineProps<{
    month: CalendarMonth
    locale: string
    constraints: DatePickerConstraints
    selected?: DateIsoString | null
    rangeStart?: DateIsoString | null
    rangeEnd?: DateIsoString | null
    focusedDate: DateIsoString
    showNavigation?: boolean
    showWeekdays?: boolean
    showYearSelector?: boolean
}>()

const emit = defineEmits<{
    (event: "select", date: DateIsoString): void
    (event: "previous-month"): void
    (event: "next-month"): void
    (event: "toggle-year-selector"): void
    (event: "keydown", value: KeyboardEvent): void
}>()

const weekStart = computed(() => getWeekStart(props.locale))
const weekdays = computed(() => formatWeekdayLabels(props.locale, weekStart.value))
const days = computed(() => getCalendarDays(props.month, weekStart.value))
const today = computed(() => getToday())
const previousMonthIcon = createIconFamily(RIChevronLeftFilled, RIChevronLeftOutlined, RIChevronLeftRounded, RIChevronLeftSharp, RIChevronLeftTwoTone)
const nextMonthIcon = createIconFamily(RIChevronRightFilled, RIChevronRightOutlined, RIChevronRightRounded, RIChevronRightSharp, RIChevronRightTwoTone)

function isDisabled(date: DateIsoString): boolean {
    return (props.constraints.min != null && date < props.constraints.min) || (props.constraints.max != null && date > props.constraints.max) || !!props.constraints.isDateDisabled?.(date)
}

function isSelected(date: DateIsoString): boolean {
    return props.selected === date || props.rangeStart === date || props.rangeEnd === date
}

function isInRange(date: DateIsoString): boolean {
    return !!props.rangeStart && !!props.rangeEnd && date > props.rangeStart && date < props.rangeEnd
}

function getRangeFillClass(date: DateIsoString): string | null {
    if (!props.rangeStart || !props.rangeEnd || props.rangeStart === props.rangeEnd) {
        return null
    }

    if (date === props.rangeStart) {
        return "rui-date-picker__range-fill--start"
    }

    if (date === props.rangeEnd) {
        return "rui-date-picker__range-fill--end"
    }

    return isInRange(date) ? "rui-date-picker__range-fill--middle" : null
}
</script>

<template>
    <section class="rui-date-picker__calendar" :class="{ 'rui-date-picker__calendar--fullscreen': !showNavigation }">
        <div v-if="showNavigation" class="rui-date-picker__navigation">
            <RSpinnerTrigger
                class="rui-date-picker__month-toggle"
                :label="formatMonthLabel(month.year, month.month, locale)"
                :menu="false"
                :aria-expanded="showYearSelector"
                @click="emit('toggle-year-selector')"
            />
            <div class="rui-date-picker__month-actions">
                <RIconButton :icon="previousMonthIcon" label="Change to previous month" @click="emit('previous-month')" />
                <RIconButton :icon="nextMonthIcon" label="Change to next month" @click="emit('next-month')" />
            </div>
        </div>

        <h3 v-if="!showNavigation" class="rui-date-picker__fullscreen-month" aria-level="2">{{ formatMonthLabel(month.year, month.month, locale) }}</h3>

        <div v-if="showWeekdays !== false" class="rui-date-picker__weekdays" aria-hidden="true">
            <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
        </div>

        <div class="rui-date-picker__month-grid" role="grid" :aria-label="formatMonthLabel(month.year, month.month, locale)" @keydown="emit('keydown', $event)">
            <div v-for="(week, row) in days" :key="row" class="rui-date-picker__week" role="row">
                <div v-for="(day, column) in week" :key="column" class="rui-date-picker__day-wrap" role="gridcell" :aria-selected="day.date && isSelected(day.date) ? 'true' : undefined">
                    <span v-if="day.date && getRangeFillClass(day.date)" class="rui-date-picker__range-fill" :class="getRangeFillClass(day.date)" aria-hidden="true" />
                    <RTouchTargetWrapper v-if="day.date" class="rui-date-picker__day-touch-target">
                        <button
                            :data-date-picker-date="day.date"
                            v-ripple="{ disabled: isDisabled(day.date), getSurfaceTarget: (host) => host.querySelector('.rui-date-picker__day-marker') }"
                            class="rui-date-picker__day"
                            :class="{
                                'rui-date-picker__day--selected': isSelected(day.date),
                                'rui-date-picker__day--today': day.date === today,
                                'rui-date-picker__day--disabled': isDisabled(day.date),
                                'rui-date-picker__day--range-start': rangeStart === day.date,
                                'rui-date-picker__day--range-end': rangeEnd === day.date,
                            }"
                            type="button"
                            :tabindex="focusedDate === day.date ? 0 : -1"
                            :disabled="isDisabled(day.date)"
                            :aria-current="day.date === today ? 'date' : undefined"
                            :aria-label="formatAccessibleDate(day.date, locale)"
                            @click="emit('select', day.date)"
                        >
                            <span class="rui-date-picker__day-marker">
                                <slot name="day" :date="day.date" :label="formatAccessibleDate(day.date, locale)" :selected="isSelected(day.date)" :disabled="isDisabled(day.date)" :today="day.date === today" :range-start="rangeStart === day.date" :range-end="rangeEnd === day.date" :in-range="isInRange(day.date)">
                                    {{ day.day }}
                                </slot>
                            </span>
                        </button>
                    </RTouchTargetWrapper>
                </div>
            </div>
        </div>
    </section>
</template>
