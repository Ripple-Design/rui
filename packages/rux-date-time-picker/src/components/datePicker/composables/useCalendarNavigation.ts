import { ref, type Ref } from "vue"

import { addMonths, getMonth } from "../../../date/dateMath"
import { clampMonth } from "../../../date/constraints"

import type { CalendarMonth, DateIsoString, DatePickerConstraints } from "../../../date/types"

export function useCalendarNavigation(initialMonth: CalendarMonth, constraints: Ref<DatePickerConstraints>) {
    const displayedMonth = ref<CalendarMonth>(clampMonth(initialMonth, constraints.value))
    const direction = ref<"previous" | "next">("next")
    const showYearSelector = ref(false)

    function setMonth(month: CalendarMonth, nextDirection: "previous" | "next" = "next") {
        direction.value = nextDirection
        displayedMonth.value = clampMonth(month, constraints.value)
    }

    function moveMonth(amount: number) {
        setMonth(addMonths(displayedMonth.value, amount), amount < 0 ? "previous" : "next")
    }

    function selectYear(year: number) {
        setMonth({ year, month: displayedMonth.value.month })
        showYearSelector.value = false
    }

    function focusDate(date: DateIsoString) {
        const target = getMonth(date)
        if (target.year !== displayedMonth.value.year || target.month !== displayedMonth.value.month) {
            setMonth(target, target.year < displayedMonth.value.year || (target.year === displayedMonth.value.year && target.month < displayedMonth.value.month) ? "previous" : "next")
        }
    }

    return {
        displayedMonth,
        direction,
        showYearSelector,
        setMonth,
        moveMonth,
        selectYear,
        focusDate,
    }
}
