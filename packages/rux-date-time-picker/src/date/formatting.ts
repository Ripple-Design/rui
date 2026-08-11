import { formatDate, parseDate } from "./dateMath"

import type { DateIsoString, FormattedDateParts } from "./types"

const partTypes = new Set(["day", "month", "year"])

export function getDateFormatParts(locale: string): FormattedDateParts {
    const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "numeric", year: "numeric" })
    const parts = formatter.formatToParts(new Date(2006, 10, 22, 12))
    const order = parts.filter((part) => partTypes.has(part.type)).map((part) => part.type) as Array<"day" | "month" | "year">
    const separator = parts.find((part) => part.type === "literal")?.value ?? "/"
    const placeholders = { day: "DD", month: "MM", year: "YYYY" }

    return {
        order,
        separator,
        placeholder: order.map((part) => placeholders[part]).join(separator),
    }
}

export function formatInputDate(date: DateIsoString, locale: string): string {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "numeric", year: "numeric" }).format(parseDate(date))
}

export function formatHeaderDate(date: DateIsoString, locale: string): string {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(parseDate(date))
}

export function formatMonthLabel(year: number, month: number, locale: string): string {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(year, month, 1, 12))
}

export function formatWeekdayLabels(locale: string, weekStart: number): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
    const sunday = new Date(2023, 0, 1, 12)
    return Array.from({ length: 7 }, (_, offset) => formatter.format(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + ((weekStart + offset) % 7), 12)))
}

export function formatAccessibleDate(date: DateIsoString, locale: string): string {
    return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(parseDate(date))
}

export function parseInputDate(value: string, locale: string): DateIsoString | null {
    const format = getDateFormatParts(locale)
    const expression = new RegExp(`^\\s*(\\d{1,4})\\s*${escapeRegExp(format.separator)}\\s*(\\d{1,4})\\s*${escapeRegExp(format.separator)}\\s*(\\d{1,4})\\s*$`)
    const match = expression.exec(value)
    if (!match) {
        return null
    }

    const values = match.slice(1).map(Number)
    const dateParts = Object.fromEntries(format.order.map((part, index) => [part, values[index]])) as Record<"day" | "month" | "year", number>
    const year = dateParts.year < 100 ? 2000 + dateParts.year : dateParts.year
    const candidate = `${year.toString().padStart(4, "0")}-${dateParts.month.toString().padStart(2, "0")}-${dateParts.day.toString().padStart(2, "0")}` as DateIsoString

    try {
        return formatDate(parseDate(candidate))
    } catch {
        return null
    }
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
