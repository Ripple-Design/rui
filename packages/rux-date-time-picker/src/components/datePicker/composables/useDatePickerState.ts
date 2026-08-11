import { computed, ref, watch, type Ref } from "vue"

import { compareDates, getToday, parseDate } from "../../../date/dateMath"
import { isDateSelectable, validateConstraints } from "../../../date/constraints"

import type { DateIsoString, DatePickerConstraints, DateRangeValue } from "../../../date/types"
import type { DatePickerSelectionMode } from "../types"

type PickerValue = DateIsoString | null | DateRangeValue

function cloneRange(value: DateRangeValue | null | undefined): DateRangeValue {
    return { start: value?.start ?? null, end: value?.end ?? null }
}

export function useDatePickerState(
    mode: DatePickerSelectionMode,
    model: Ref<PickerValue>,
    constraints: Ref<DatePickerConstraints>,
) {
    const draftSingle = ref<DateIsoString | null>(null)
    const draftRange = ref<DateRangeValue>({ start: null, end: null })
    const validationMessage = ref<string | null>(null)

    watch(
        constraints,
        (value) => validateConstraints(value),
        { immediate: true, deep: true },
    )

    function resetDraft() {
        validationMessage.value = null
        if (mode === "single") {
            draftSingle.value = (model.value as DateIsoString | null) ?? null
            return
        }

        draftRange.value = cloneRange(model.value as DateRangeValue | null)
    }

    function select(date: DateIsoString) {
        if (!isDateSelectable(date, constraints.value)) {
            return
        }

        validationMessage.value = null
        if (mode === "single") {
            draftSingle.value = date
            return
        }

        const range = draftRange.value
        if (!range.start || (range.end == null && compareDates(date, range.start) >= 0)) {
            draftRange.value = range.start ? { start: range.start, end: date } : { start: date, end: null }
            return
        }

        draftRange.value = { start: date, end: null }
    }

    function setTextSingle(date: DateIsoString | null, message: string | null = null) {
        validationMessage.value = message
        if (!date) {
            draftSingle.value = null
            return
        }

        if (isDateSelectable(date, constraints.value)) {
            draftSingle.value = date
            validationMessage.value = null
        } else {
            validationMessage.value = message ?? "Date is out of range."
        }
    }

    function setTextRange(start: DateIsoString | null, end: DateIsoString | null, message: string | null = null) {
        validationMessage.value = message
        if (!start || !end) {
            draftRange.value = { start, end }
            return
        }

        if (!isDateSelectable(start, constraints.value) || !isDateSelectable(end, constraints.value)) {
            validationMessage.value = message ?? "Date is out of range."
            return
        }

        if (compareDates(start, end) > 0) {
            validationMessage.value = "Invalid range."
            return
        }

        draftRange.value = { start, end }
        validationMessage.value = null
    }

    const selection = computed<PickerValue>(() => (mode === "single" ? draftSingle.value : draftRange.value))
    const isComplete = computed(() => {
        if (validationMessage.value) {
            return false
        }

        if (mode === "single") {
            return draftSingle.value != null
        }

        const range = draftRange.value
        return range.start != null && range.end != null && compareDates(range.start, range.end) <= 0
    })

    function commit(): PickerValue {
        if (!isComplete.value) {
            throw new Error("Cannot confirm an incomplete date picker selection.")
        }

        if (mode === "single") {
            return draftSingle.value
        }

        return cloneRange(draftRange.value)
    }

    function getAnchorDate(): DateIsoString | null {
        if (mode === "single") {
            return draftSingle.value
        }

        return draftRange.value.start ?? draftRange.value.end
    }

    function isSelected(date: DateIsoString): boolean {
        if (mode === "single") {
            return draftSingle.value === date
        }

        const { start, end } = draftRange.value
        return date === start || date === end
    }

    function isInRange(date: DateIsoString): boolean {
        if (mode === "single") {
            return false
        }

        const { start, end } = draftRange.value
        return !!start && !!end && compareDates(date, start) > 0 && compareDates(date, end) < 0
    }

    resetDraft()

    return {
        draftSingle,
        draftRange,
        validationMessage,
        selection,
        isComplete,
        resetDraft,
        select,
        setTextSingle,
        setTextRange,
        commit,
        getAnchorDate,
        isSelected,
        isInRange,
        today: getToday,
        validateDate(date: DateIsoString) {
            parseDate(date)
            return isDateSelectable(date, constraints.value)
        },
    }
}
