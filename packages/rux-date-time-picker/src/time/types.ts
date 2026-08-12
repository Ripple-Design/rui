export type TimeIsoString = `${number}${number}:${number}${number}`

export type TimeValue = {
    hour: number
    minute: number
}

export type TimeFormat = "locale" | "12h" | "24h"
export type ResolvedTimeFormat = "12h" | "24h"
export type TimePickerInputMode = "clock" | "keyboard"
export type TimePickerSelection = "hour" | "minute"
export type TimePeriod = "am" | "pm"

export type TimePickerCloseDetail = {
    reason: "cancel" | "backdrop" | "action" | "programmatic"
    action?: string
}
