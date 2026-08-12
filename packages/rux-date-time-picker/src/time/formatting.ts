import type { ResolvedTimeFormat, TimeFormat, TimeIsoString, TimePeriod, TimeValue } from "./types"

const timePattern = /^(?<hour>[01]\d|2[0-3]):(?<minute>[0-5]\d)$/

export function parseTime(value: string | null | undefined): TimeValue | null {
    if (!value) return null
    const match = timePattern.exec(value)
    if (!match?.groups) return null
    return { hour: Number(match.groups.hour), minute: Number(match.groups.minute) }
}

export function formatTime(value: TimeValue): TimeIsoString {
    return `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}` as TimeIsoString
}

export function resolveTimeFormat(locale: string, timeFormat: TimeFormat): ResolvedTimeFormat {
    if (timeFormat !== "locale") return timeFormat
    const hourCycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle
    return hourCycle === "h11" || hourCycle === "h12" ? "12h" : "24h"
}

export function getPeriod(value: TimeValue): TimePeriod {
    return value.hour >= 12 ? "pm" : "am"
}

export function getDisplayHour(value: TimeValue, timeFormat: ResolvedTimeFormat) {
    if (timeFormat === "24h") return value.hour
    return value.hour % 12 || 12
}

export function withDisplayHour(value: TimeValue, displayHour: number, timeFormat: ResolvedTimeFormat): TimeValue {
    if (timeFormat === "24h") return { ...value, hour: displayHour % 24 }
    const periodOffset = getPeriod(value) === "pm" ? 12 : 0
    return { ...value, hour: displayHour % 12 + periodOffset }
}

export function withPeriod(value: TimeValue, period: TimePeriod): TimeValue {
    const hour = value.hour % 12
    return { ...value, hour: period === "pm" ? hour + 12 : hour }
}

export function formatDisplayTime(value: TimeValue | null, locale: string, timeFormat: ResolvedTimeFormat) {
    if (!value) return ""
    const reference = new Date(2000, 0, 1, value.hour, value.minute)
    return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        hour12: timeFormat === "12h",
    }).format(reference)
}

export function formatClockValue(value: number, locale: string, zeroPad = false) {
    return new Intl.NumberFormat(locale, {
        minimumIntegerDigits: zeroPad ? 2 : 1,
        useGrouping: false,
    }).format(value)
}

export function getClockValues(selection: "hour" | "minute", timeFormat: ResolvedTimeFormat) {
    if (selection === "minute") return Array.from({ length: 12 }, (_, index) => index * 5)
    if (timeFormat === "24h") return Array.from({ length: 12 }, (_, index) => index * 2)
    return [12, ...Array.from({ length: 11 }, (_, index) => index + 1)]
}
