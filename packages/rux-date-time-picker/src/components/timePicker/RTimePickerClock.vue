<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

import { formatClockValue, getClockValues, getDisplayHour, withDisplayHour } from "../../time/formatting"

import type { ResolvedTimeFormat, TimePickerSelection, TimeValue } from "../../time/types"
import { getClockAngle, getHourFromAngle, getMinuteFromAngle } from "./composables/useTimePickerClock"

const props = defineProps<{
    value: TimeValue
    locale: string
    timeFormat: ResolvedTimeFormat
    selection: TimePickerSelection
    hourLabel: string
    minuteLabel: string
}>()

const emit = defineEmits<{
    (event: "update:value", value: TimeValue): void
    (event: "update:selection", value: TimePickerSelection): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const clockRadius = ref(100)
const pointerMoved = ref(false)
const pointerStart = ref({ x: 0, y: 0 })
const pointerId = ref<number | null>(null)
const isDragging = ref(false)
const suppressClick = ref(false)
const clockValues = computed(() => getClockValues(props.selection, props.timeFormat))
const selectedClockValue = computed(() => props.selection === "hour" ? getDisplayHour(props.value, props.timeFormat) : Math.round(props.value.minute / 5) * 5 % 60)
const handAngle = computed(() => props.selection === "hour"
    ? (props.timeFormat === "12h" ? getDisplayHour(props.value, props.timeFormat) % 12 * 30 : props.value.hour * 15)
    : props.value.minute * 6)
const clockLabel = computed(() => props.selection === "hour" ? props.hourLabel : props.minuteLabel)
let resizeObserver: ResizeObserver | undefined

function updateClockRadius() {
    const diameter = rootRef.value?.clientWidth ?? 0
    if (diameter) clockRadius.value = diameter / 2 - 24 - 4
}

onMounted(() => {
    updateClockRadius()
    resizeObserver = new ResizeObserver(updateClockRadius)
    if (rootRef.value) resizeObserver.observe(rootRef.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

function clockValueStyle(index: number) {
    const angle = index * 30 * Math.PI / 180
    return {
        "--rui-comp-time-picker-clock-value-x": `${Math.sin(angle) * clockRadius.value}px`,
        "--rui-comp-time-picker-clock-value-y": `${-Math.cos(angle) * clockRadius.value}px`,
    }
}

function select(value: number, moveToMinute = false) {
    if (props.selection === "hour") {
        emit("update:value", withDisplayHour(props.value, value, props.timeFormat))
        if (moveToMinute) emit("update:selection", "minute")
        return
    }
    emit("update:value", { ...props.value, minute: value })
}

function updateFromPointer(event: PointerEvent, snapToFiveMinutes: boolean) {
    const rect = rootRef.value?.getBoundingClientRect()
    if (!rect) return
    const angle = getClockAngle(event.clientX, event.clientY, rect)
    if (props.selection === "hour") {
        select(getHourFromAngle(angle, props.timeFormat))
        return
    }
    select(getMinuteFromAngle(angle, snapToFiveMinutes))
}

function releasePointer(event: PointerEvent) {
    if (pointerId.value !== event.pointerId) return
    if (rootRef.value?.hasPointerCapture(event.pointerId)) rootRef.value.releasePointerCapture(event.pointerId)
    pointerId.value = null
    isDragging.value = false
}

function handlePointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.pointerType === "mouse" && event.button !== 0) return
    pointerMoved.value = false
    pointerId.value = event.pointerId
    pointerStart.value = { x: event.clientX, y: event.clientY }
    rootRef.value?.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
    if (pointerId.value !== event.pointerId) return
    const distance = Math.hypot(event.clientX - pointerStart.value.x, event.clientY - pointerStart.value.y)
    if (!pointerMoved.value && distance <= 8) return
    pointerMoved.value = true
    isDragging.value = true
    event.preventDefault()
    updateFromPointer(event, false)
}

function handlePointerUp(event: PointerEvent) {
    if (pointerId.value !== event.pointerId) return
    if (pointerMoved.value) {
        suppressClick.value = true
        updateFromPointer(event, false)
        if (props.selection === "hour") emit("update:selection", "minute")
    }
    releasePointer(event)
}

function handlePointerCancel(event: PointerEvent) {
    releasePointer(event)
}

function handleClockValueClick(value: number) {
    if (suppressClick.value) {
        suppressClick.value = false
        return
    }
    select(value, props.selection === "hour")
}

function handleKeydown(event: KeyboardEvent, index: number) {
    const amount = clockValues.value.length
    let target: number | undefined
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % amount
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + amount) % amount
    if (event.key === "Home") target = 0
    if (event.key === "End") target = amount - 1
    if (target === undefined) return
    event.preventDefault()
    const button = rootRef.value?.querySelector<HTMLButtonElement>(`[data-time-picker-clock-value='${clockValues.value[target]}']`)
    button?.focus()
}
</script>

<template>
    <div
        ref="rootRef"
        :class="[
            'rui-time-picker__clock',
            { 'rui-time-picker__clock--dragging': isDragging },
        ]"
        :style="{
            '--rui-comp-time-picker-hand-angle': `${handAngle}deg`,
            '--rui-comp-time-picker-clock-radius': `${clockRadius}px`,
        }"
        role="group"
        :aria-label="clockLabel"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
    >
        <span class="rui-time-picker__clock-hand" aria-hidden="true"><span class="rui-time-picker__clock-selector" /></span>
        <button
            v-for="(clockValue, index) in clockValues"
            :key="clockValue"
            type="button"
            class="rui-time-picker__clock-value"
            :class="{ 'rui-time-picker__clock-value--selected': clockValue === selectedClockValue }"
            :style="clockValueStyle(index)"
            :data-time-picker-clock-value="clockValue"
            :tabindex="clockValue === selectedClockValue ? 0 : -1"
            :aria-label="`${clockLabel}: ${formatClockValue(clockValue, locale, selection !== 'hour' || timeFormat === '24h')}`"
            :aria-pressed="clockValue === selectedClockValue"
            @click.stop="handleClockValueClick(clockValue)"
            @keydown="handleKeydown($event, index)"
        >
            {{ formatClockValue(clockValue, locale, selection !== 'hour' || timeFormat === '24h') }}
        </button>
    </div>
</template>
