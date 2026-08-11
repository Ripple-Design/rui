export type DateIsoString = `${number}-${number}-${number}`

export type DateRangeValue = {
    start: DateIsoString | null
    end: DateIsoString | null
}

export type DatePickerInputMode = "calendar" | "text"

export type DatePickerDateValidator = (date: DateIsoString) => boolean

export type DatePickerConstraints = {
    min?: DateIsoString
    max?: DateIsoString
    openAt?: DateIsoString
    isDateDisabled?: DatePickerDateValidator
}

export type CalendarMonth = {
    year: number
    month: number
}

export type CalendarDay = {
    date: DateIsoString | null
    day: number | null
    inMonth: boolean
}

export type FormattedDateParts = {
    order: Array<"day" | "month" | "year">
    separator: string
    placeholder: string
}
