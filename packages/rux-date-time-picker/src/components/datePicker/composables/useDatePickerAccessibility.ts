import { nextTick, ref } from "vue"

import { formatDate, parseDate } from "../../../date/dateMath"

import type { DateIsoString } from "../../../date/types"

export function useDatePickerAccessibility(initialDate: DateIsoString) {
    const focusedDate = ref(initialDate)
    const liveMessage = ref("")

    function announce(message: string) {
        liveMessage.value = ""
        requestAnimationFrame(() => {
            liveMessage.value = message
        })
    }

    async function focus(date: DateIsoString) {
        focusedDate.value = date
        await nextTick()
        document.querySelector<HTMLElement>(`[data-date-picker-date="${date}"]`)?.focus({ preventScroll: true })
    }

    function move(date: DateIsoString, days: number): DateIsoString {
        const parsed = parseDate(date)
        return formatDate(new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + days, 12))
    }

    function handleGridKeydown(event: KeyboardEvent, onSelect: (date: DateIsoString) => void, onNavigate: (date: DateIsoString) => void) {
        let target: DateIsoString | null = null
        switch (event.key) {
            case "ArrowLeft":
                target = move(focusedDate.value, -1)
                break
            case "ArrowRight":
                target = move(focusedDate.value, 1)
                break
            case "ArrowUp":
                target = move(focusedDate.value, -7)
                break
            case "ArrowDown":
                target = move(focusedDate.value, 7)
                break
            case "Home": {
                const weekday = parseDate(focusedDate.value).getDay()
                target = move(focusedDate.value, -weekday)
                break
            }
            case "End": {
                const weekday = parseDate(focusedDate.value).getDay()
                target = move(focusedDate.value, 6 - weekday)
                break
            }
            case "PageUp":
                target = move(focusedDate.value, event.ctrlKey || event.altKey ? -365 : -31)
                break
            case "PageDown":
                target = move(focusedDate.value, event.ctrlKey || event.altKey ? 365 : 31)
                break
            case "Enter":
            case " ":
                event.preventDefault()
                onSelect(focusedDate.value)
                return
            default:
                return
        }

        event.preventDefault()
        if (target) {
            onNavigate(target)
            void focus(target)
        }
    }

    return {
        focusedDate,
        liveMessage,
        announce,
        focus,
        handleGridKeydown,
    }
}
