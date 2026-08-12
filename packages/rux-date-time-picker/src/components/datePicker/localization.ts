import { computed, inject } from "vue"

import type { DatePickerDialogLabels } from "./types"

type InternationalizationController = {
    locale: { value: string }
}

type DatePickerAction = "cancel" | "confirm"

const internationalizationKey = Symbol.for("@ripple-design/rui/internationalization")
const baseLabels: DatePickerDialogLabels = {
    cancel: "Cancel",
    confirm: "OK",
    switchToCalendar: "Switch to calendar input mode",
    switchToText: "Switch to text input mode",
    previousMonth: "Change to previous month",
    nextMonth: "Change to next month",
}
const localizedActionLabels: Record<string, Partial<Pick<DatePickerDialogLabels, DatePickerAction>>> = {
    "zh-CN": {
        cancel: "取消",
        confirm: "确定",
    },
}

function resolveLocaleCandidates(locale: string) {
    try {
        const normalizedLocale = Intl.getCanonicalLocales(locale)[0]
        if (!normalizedLocale) {
            return []
        }

        const subtags = new Intl.Locale(normalizedLocale).baseName.split("-")
        const candidates: string[] = []

        for (let length = subtags.length; length > 0; length -= 1) {
            candidates.push(subtags.slice(0, length).join("-"))
        }

        return candidates
    } catch {
        return []
    }
}

function resolveDatePickerLabels(locale: string) {
    const labels = { ...baseLabels }

    for (const candidate of resolveLocaleCandidates(locale).reverse()) {
        Object.assign(labels, localizedActionLabels[candidate])
    }

    return labels
}

export function useDatePickerLabels(locale: () => string) {
    const internationalization = inject<InternationalizationController | undefined>(internationalizationKey, undefined)

    return computed(() => resolveDatePickerLabels(internationalization?.locale.value ?? locale()))
}
