import type { CalendarDay, CalendarMonth, DateIsoString } from "./types"

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDate(date: DateIsoString): Date {
    const match = ISO_DATE_PATTERN.exec(date)
    if (!match) {
        throw new TypeError(`Expected an ISO date in YYYY-MM-DD form, received ${date}.`)
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const parsed = new Date(year, month - 1, day, 12)

    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
        throw new RangeError(`Expected a valid ISO date, received ${date}.`)
    }

    return parsed
}

export function formatDate(date: Date): DateIsoString {
    return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}` as DateIsoString
}

export function getToday(): DateIsoString {
    return formatDate(new Date())
}

export function getMonth(date: DateIsoString): CalendarMonth {
    const parsed = parseDate(date)
    return { year: parsed.getFullYear(), month: parsed.getMonth() }
}

export function createMonth(year: number, month: number): CalendarMonth {
    const normalised = new Date(year, month, 1, 12)
    return { year: normalised.getFullYear(), month: normalised.getMonth() }
}

export function formatMonth(month: CalendarMonth): string {
    return `${month.year.toString().padStart(4, "0")}-${(month.month + 1).toString().padStart(2, "0")}`
}

export function compareDates(left: DateIsoString, right: DateIsoString): number {
    return left.localeCompare(right)
}

export function compareMonths(left: CalendarMonth, right: CalendarMonth): number {
    return left.year === right.year ? left.month - right.month : left.year - right.year
}

export function addMonths(month: CalendarMonth, amount: number): CalendarMonth {
    return createMonth(month.year, month.month + amount)
}

export function daysInMonth(month: CalendarMonth): number {
    return new Date(month.year, month.month + 1, 0, 12).getDate()
}

export function dateForMonthDay(month: CalendarMonth, day: number): DateIsoString {
    return formatDate(new Date(month.year, month.month, day, 12))
}

export function getWeekStart(locale: string): number {
    const Locale = Intl.Locale as (new (tag: string) => { getWeekInfo?: () => { firstDay: number } }) | undefined
    if (!Locale) {
        return 0
    }

    const weekInfo = new Locale(locale).getWeekInfo?.()
    return weekInfo ? weekInfo.firstDay % 7 : 0
}

export function getCalendarDays(month: CalendarMonth, weekStart: number): CalendarDay[][] {
    const firstDay = new Date(month.year, month.month, 1, 12).getDay()
    const offset = (firstDay - weekStart + 7) % 7
    const days = daysInMonth(month)
    const cells = Array.from({ length: 42 }, (_, index): CalendarDay => {
        const day = index - offset + 1
        if (day < 1 || day > days) {
            return { date: null, day: null, inMonth: false }
        }

        return { date: dateForMonthDay(month, day), day, inMonth: true }
    })

    return Array.from({ length: 6 }, (_, row) => cells.slice(row * 7, row * 7 + 7))
}

export function getMonthDistance(from: CalendarMonth, to: CalendarMonth): number {
    return (to.year - from.year) * 12 + to.month - from.month
}
