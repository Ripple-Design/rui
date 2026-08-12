import { computed, ref } from "vue"

import { formatTime, parseTime } from "../../../time/formatting"

import type { TimeIsoString, TimeValue } from "../../../time/types"

function clone(value: TimeValue) {
    return { hour: value.hour, minute: value.minute }
}

export function useTimePickerState(modelValue: () => TimeIsoString | null | undefined) {
    const draft = ref<TimeValue>({ hour: 0, minute: 0 })
    const value = computed(() => formatTime(draft.value))

    function reset() {
        draft.value = clone(parseTime(modelValue()) ?? { hour: 0, minute: 0 })
    }

    function setValue(value: TimeValue) {
        draft.value = clone(value)
    }

    function setHour(hour: number) {
        draft.value = { ...draft.value, hour }
    }

    function setMinute(minute: number) {
        draft.value = { ...draft.value, minute }
    }

    return { draft, reset, setHour, setMinute, setValue, value }
}
