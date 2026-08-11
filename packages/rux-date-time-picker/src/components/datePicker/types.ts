import type { DateIsoString, DatePickerConstraints, DatePickerInputMode, DateRangeValue } from "../../date/types"

export type DatePickerSelectionMode = "single" | "range"

export type DatePickerDialogLabels = {
    cancel: string
    confirm: string
    save: string
    switchToCalendar: string
    switchToText: string
    previousMonth: string
    nextMonth: string
}

export type DatePickerSharedProps = DatePickerConstraints & {
    open?: boolean
    locale?: string
    inputMode?: DatePickerInputMode
    title?: string
    disabled?: boolean
    closeOnEscape?: boolean
    closeOnBackdrop?: boolean
    labels?: Partial<DatePickerDialogLabels>
}

export type RDatePickerProps = DatePickerSharedProps & {
    modelValue?: DateIsoString | null
}

export type RDateRangePickerProps = DatePickerSharedProps & {
    modelValue?: DateRangeValue
}

export type DatePickerCloseDetail = {
    reason: "cancel" | "backdrop" | "action" | "programmatic"
    action?: string
}

export type DatePickerDaySlotProps = {
    date: DateIsoString
    label: string
    selected: boolean
    disabled: boolean
    today: boolean
    rangeStart: boolean
    rangeEnd: boolean
    inRange: boolean
}
