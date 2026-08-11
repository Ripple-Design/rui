import { dateForMonthDay, getMonth, parseDate } from "./dateMath"

import type { CalendarMonth, DateIsoString, DatePickerConstraints } from "./types"

export const DEFAULT_MIN_DATE = "1900-01-01" as DateIsoString
export const DEFAULT_MAX_DATE = "2100-12-31" as DateIsoString

export function validateConstraints(constraints: DatePickerConstraints): void {
    const min = constraints.min ?? DEFAULT_MIN_DATE
    const max = constraints.max ?? DEFAULT_MAX_DATE
    parseDate(min)
    parseDate(max)

    if (min > max) {
        throw new RangeError("The minimum date cannot be after the maximum date.")
    }

    if (constraints.openAt) {
        parseDate(constraints.openAt)
        if (!isDateWithinBounds(constraints.openAt, constraints)) {
            throw new RangeError("The openAt date must be within the picker bounds.")
        }
    }
}

export function isDateWithinBounds(date: DateIsoString, constraints: DatePickerConstraints): boolean {
    const min = constraints.min ?? DEFAULT_MIN_DATE
    const max = constraints.max ?? DEFAULT_MAX_DATE
    return date >= min && date <= max
}

export function isDateSelectable(date: DateIsoString, constraints: DatePickerConstraints): boolean {
    return isDateWithinBounds(date, constraints) && !constraints.isDateDisabled?.(date)
}

export function clampMonth(month: CalendarMonth, constraints: DatePickerConstraints): CalendarMonth {
    const min = getMonth(constraints.min ?? DEFAULT_MIN_DATE)
    const max = getMonth(constraints.max ?? DEFAULT_MAX_DATE)

    if (month.year < min.year || (month.year === min.year && month.month < min.month)) {
        return min
    }

    if (month.year > max.year || (month.year === max.year && month.month > max.month)) {
        return max
    }

    return month
}

export function isMonthSelectable(month: CalendarMonth, constraints: DatePickerConstraints): boolean {
    const first = dateForMonthDay(month, 1)
    const last = dateForMonthDay(month, new Date(month.year, month.month + 1, 0, 12).getDate())
    return isDateWithinBounds(first, constraints) || isDateWithinBounds(last, constraints)
}

export function resolveOpenMonth(
    selection: DateIsoString | null,
    constraints: DatePickerConstraints,
    today: DateIsoString,
): CalendarMonth {
    if (constraints.openAt) {
        return getMonth(constraints.openAt)
    }

    if (selection && isDateWithinBounds(selection, constraints)) {
        return getMonth(selection)
    }

    if (isDateWithinBounds(today, constraints)) {
        return getMonth(today)
    }

    return getMonth(constraints.min ?? DEFAULT_MIN_DATE)
}
