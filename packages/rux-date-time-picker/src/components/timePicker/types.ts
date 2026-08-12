import type { TimeFormat, TimeIsoString, TimePickerCloseDetail, TimePickerInputMode } from "../../time/types"

export type TimePickerDialogLabels = {
    cancel: string
    confirm: string
    switchToClock: string
    switchToKeyboard: string
    hour: string
    minute: string
    am: string
    pm: string
}

export type TimePickerSharedProps = {
    open?: boolean
    locale?: string
    timeFormat?: TimeFormat
    inputMode?: TimePickerInputMode
    title?: string
    disabled?: boolean
    closeOnEscape?: boolean
    closeOnBackdrop?: boolean
    labels?: Partial<TimePickerDialogLabels>
}

export type RTimePickerProps = TimePickerSharedProps & {
    modelValue?: TimeIsoString | null
}

export type { TimePickerCloseDetail }
