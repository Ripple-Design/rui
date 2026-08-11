<script setup lang="ts">
import {
    RICalendarTodayFilled,
    RICalendarTodayOutlined,
    RICalendarTodayRounded,
    RICalendarTodaySharp,
    RICalendarTodayTwoTone,
    RICloseFilled,
    RICloseOutlined,
    RICloseRounded,
    RICloseSharp,
    RICloseTwoTone,
    RIEditFilled,
    RIEditOutlined,
    RIEditRounded,
    RIEditSharp,
    RIEditTwoTone,
} from "@ripple-design/icons"
import { createIconFamily, RButton, RDialog, RFullscreenDialog, RIconButton, RTextField } from "@ripple-design/rui"
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

import { getMonth, getToday } from "../../date/dateMath"
import { resolveOpenMonth } from "../../date/constraints"
import { formatHeaderDate, formatInputDate, getDateFormatParts, parseInputDate } from "../../date/formatting"

import type { DateIsoString, DatePickerConstraints, DatePickerInputMode, DateRangeValue } from "../../date/types"
import type { DatePickerCloseDetail, DatePickerDialogLabels, DatePickerSelectionMode } from "./types"
import { useCalendarNavigation } from "./composables/useCalendarNavigation"
import { useDatePickerAccessibility } from "./composables/useDatePickerAccessibility"
import { useDatePickerState } from "./composables/useDatePickerState"
import RCalendar from "./RCalendar.vue"
import RFullscreenCalendar from "./RFullscreenCalendar.vue"

const props = withDefaults(
    defineProps<{
        mode: DatePickerSelectionMode
        modelValue: DateIsoString | null | DateRangeValue
        open: boolean
        locale: string
        constraints: DatePickerConstraints
        inputMode: DatePickerInputMode
        title?: string
        closeOnEscape?: boolean
        closeOnBackdrop?: boolean
        labels: DatePickerDialogLabels
    }>(),
    {
        title: undefined,
        closeOnEscape: true,
        closeOnBackdrop: true,
    },
)

const emit = defineEmits<{
    (event: "update:open", value: boolean): void
    (event: "confirm", value: DateIsoString | DateRangeValue): void
    (event: "cancel"): void
    (event: "close", detail: DatePickerCloseDetail): void
}>()

const model = computed({
    get: () => props.modelValue,
    set: () => undefined,
})
const constraints = computed(() => props.constraints)
const state = useDatePickerState(props.mode, model, constraints)
const initialMonth = computed(() => resolveOpenMonth(state.getAnchorDate(), constraints.value, getToday()))
const navigation = useCalendarNavigation(initialMonth.value, constraints)
const accessibility = useDatePickerAccessibility(state.getAnchorDate() ?? getToday())
const inputMode = ref<DatePickerInputMode>(props.inputMode)
const isCalendarMode = computed(() => inputMode.value === "calendar")
const isTextMode = computed(() => inputMode.value === "text")
const narrowViewport = ref(false)
const viewportReady = ref(false)
const textValue = ref("")
const startTextValue = ref("")
const endTextValue = ref("")
let validationTimer: number | undefined
let confirmed = false
let mediaQuery: MediaQueryList | null = null

const initialFocusSelector = "[data-date-picker-date]:not([tabindex='-1'])"
const dialogComponent = computed(() => (narrowViewport.value ? RFullscreenDialog : RDialog))
const isLandscape = ref(false)
const isShortLandscape = ref(false)
const isFullscreen = computed(() => narrowViewport.value)
const dialogClasses = computed(() => ({
    "rui-date-picker-dialog--fullscreen": viewportReady.value && isFullscreen.value,
    "rui-date-picker-dialog--landscape": viewportReady.value && isLandscape.value && !isFullscreen.value,
    "rui-date-picker-dialog--short-landscape": viewportReady.value && isShortLandscape.value && !isFullscreen.value,
    "rui-date-picker-dialog--range": props.mode === "range",
}))
const displayedMonth = computed(() => navigation.displayedMonth.value)
const yearSelectorOpen = computed(() => navigation.showYearSelector.value)
const isConfirmEnabled = computed(() => state.isComplete.value)
const headerSelection = computed(() => {
    if (props.mode === "single") {
        return state.draftSingle.value ? formatHeaderDate(state.draftSingle.value, props.locale) : "No date selected"
    }

    const { start, end } = state.draftRange.value
    if (!start && !end) return "No range selected"
    if (!end) return `Start date: ${formatHeaderDate(start!, props.locale)}`
    return `${formatHeaderDate(start!, props.locale)} – ${formatHeaderDate(end, props.locale)}`
})
const headerSelectionLabel = computed(() => `Current selection: ${headerSelection.value}`)
const dialogTitle = computed(() => props.title ?? (props.mode === "single" ? "Select date" : "Select range"))
const confirmationLabel = computed(() => (narrowViewport.value ? props.labels.save : props.labels.confirm))
const placeholder = computed(() => getDateFormatParts(props.locale).placeholder)
const editIcon = createIconFamily(RIEditFilled, RIEditOutlined, RIEditRounded, RIEditSharp, RIEditTwoTone)
const calendarIcon = createIconFamily(RICalendarTodayFilled, RICalendarTodayOutlined, RICalendarTodayRounded, RICalendarTodaySharp, RICalendarTodayTwoTone)
const closeIcon = createIconFamily(RICloseFilled, RICloseOutlined, RICloseRounded, RICloseSharp, RICloseTwoTone)

function updateViewport() {
    const width = window.innerWidth
    const height = window.innerHeight
    narrowViewport.value = Math.min(width, height) <= 480
    isLandscape.value = width > height
    isShortLandscape.value = isLandscape.value && height < 480
}

function resetInputValues() {
    if (props.mode === "single") {
        textValue.value = state.draftSingle.value ? formatInputDate(state.draftSingle.value, props.locale) : ""
        return
    }

    startTextValue.value = state.draftRange.value.start ? formatInputDate(state.draftRange.value.start, props.locale) : ""
    endTextValue.value = state.draftRange.value.end ? formatInputDate(state.draftRange.value.end, props.locale) : ""
}

function openPicker() {
    confirmed = false
    state.resetDraft()
    navigation.setMonth(resolveOpenMonth(state.getAnchorDate(), constraints.value, getToday()))
    accessibility.focusedDate.value = state.getAnchorDate() ?? getToday()
    inputMode.value = props.inputMode
    resetInputValues()
    emit("update:open", true)
}

function closePicker(detail: DatePickerCloseDetail) {
    window.clearTimeout(validationTimer)
    const wasConfirmed = confirmed
    if (!wasConfirmed) {
        state.resetDraft()
        if (detail.reason !== "programmatic") emit("cancel")
    }
    confirmed = false
    emit("update:open", false)
    emit("close", detail)
}

function handleDialogModelValue(value: boolean) {
    if (!value && props.open) {
        closePicker({ reason: "programmatic" })
    }
}

function confirm() {
    const selection = state.commit()
    confirmed = true
    emit("confirm", selection as DateIsoString | DateRangeValue)
    emit("update:open", false)
}

function select(date: DateIsoString) {
    state.select(date)
    accessibility.focusedDate.value = date
    resetInputValues()
    accessibility.announce(`Current selection: ${headerSelection.value}`)
}

function validateTextInput() {
    window.clearTimeout(validationTimer)
    validationTimer = window.setTimeout(() => {
        if (props.mode === "single") {
            const parsed = textValue.value ? parseInputDate(textValue.value, props.locale) : null
            state.setTextSingle(parsed, textValue.value && !parsed ? `Invalid format. Use ${placeholder.value}.` : null)
            return
        }

        const start = startTextValue.value ? parseInputDate(startTextValue.value, props.locale) : null
        const end = endTextValue.value ? parseInputDate(endTextValue.value, props.locale) : null
        const invalid = (startTextValue.value && !start) || (endTextValue.value && !end)
        state.setTextRange(start, end, invalid ? `Invalid format. Use ${placeholder.value}.` : null)
    }, 1000)
}

function navigateFocus(date: DateIsoString) {
    navigation.focusDate(date)
}

function toggleInputMode() {
    inputMode.value = inputMode.value === "calendar" ? "text" : "calendar"
    resetInputValues()
    void nextTick()
}

function handlePreviousMonth() {
    navigation.moveMonth(-1)
}

function handleNextMonth() {
    navigation.moveMonth(1)
}

function handleCalendarKeydown(event: KeyboardEvent) {
    accessibility.handleGridKeydown(event, select, navigateFocus)
}

function toggleYearSelector() {
    navigation.showYearSelector.value = !navigation.showYearSelector.value
}

watch(
    () => props.open,
    (open) => {
        if (open) openPicker()
    },
    { immediate: true },
)

watch(
    () => props.inputMode,
    (value) => {
        inputMode.value = value
    },
)

if (typeof window !== "undefined") {
    onMounted(() => {
        mediaQuery = window.matchMedia("(max-width: 480px), (max-height: 480px)")
        updateViewport()
        mediaQuery.addEventListener("change", updateViewport)
        viewportReady.value = true
    })
}

onBeforeUnmount(() => {
    window.clearTimeout(validationTimer)
    mediaQuery?.removeEventListener("change", updateViewport)
})

defineExpose({ open: openPicker })
</script>

<template>
    <component
        :is="dialogComponent"
        :model-value="open"
        class="rui-date-picker-dialog"
        :class="dialogClasses"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :initial-focus="initialFocusSelector"
        @update:model-value="handleDialogModelValue"
        @close="closePicker"
    >
        <template #header>
            <header class="rui-date-picker__header" :class="{ 'rui-date-picker__header--fullscreen': isFullscreen }">
                <RIconButton v-if="isFullscreen" class="rui-date-picker__fullscreen-cancel" :icon="closeIcon" :label="labels.cancel" @click="closePicker({ reason: 'action', action: 'cancel' })" />
                <div class="rui-date-picker__header-text">
                    <p class="rui-date-picker__title"><slot name="title">{{ dialogTitle }}</slot></p>
                    <p class="rui-date-picker__selection" aria-live="polite" :aria-label="headerSelectionLabel"><span class="rui-date-picker__selection-text">{{ headerSelection }}</span></p>
                </div>
                <div v-if="isFullscreen" class="rui-date-picker__fullscreen-actions">
                    <RButton variant="text" :disabled="!isConfirmEnabled" @click="confirm">{{ confirmationLabel }}</RButton>
                    <RIconButton
                        class="rui-date-picker__mode-toggle"
                        :icon="inputMode === 'calendar' ? editIcon : calendarIcon"
                        :label="inputMode === 'calendar' ? labels.switchToText : labels.switchToCalendar"
                        @click="toggleInputMode"
                    />
                </div>
                <RIconButton
                    v-else
                    class="rui-date-picker__mode-toggle"
                    :icon="inputMode === 'calendar' ? editIcon : calendarIcon"
                    :label="inputMode === 'calendar' ? labels.switchToText : labels.switchToCalendar"
                    @click="toggleInputMode"
                />
            </header>
        </template>

        <div class="rui-date-picker__content">
            <p v-if="state.validationMessage" class="rui-date-picker__live-message" role="status">{{ state.validationMessage }}</p>
            <p class="rui-date-picker__live-message" aria-live="polite">{{ accessibility.liveMessage }}</p>

            <template v-if="isCalendarMode">
                <div v-if="yearSelectorOpen" class="rui-date-picker__year-selector" role="grid" aria-label="Select year">
                    <button
                        v-for="year in Array.from({ length: (getMonth(constraints.max ?? '2100-12-31').year - getMonth(constraints.min ?? '1900-01-01').year) + 1 }, (_, index) => getMonth(constraints.min ?? '1900-01-01').year + index)"
                        :key="year"
                        type="button"
                        class="rui-date-picker__year"
                        @click="navigation.selectYear(year)"
                    >
                        <span
                            class="rui-date-picker__year-marker"
                            :class="{
                                'rui-date-picker__year-marker--selected': year === displayedMonth.year,
                                'rui-date-picker__year-marker--today': year === getMonth(getToday()).year,
                            }"
                        >
                            {{ year }}
                        </span>
                    </button>
                </div>
                <RFullscreenCalendar
                    v-else-if="isFullscreen"
                    :anchor-month="displayedMonth"
                    :locale="locale"
                    :constraints="constraints"
                    :selected="mode === 'single' ? state.draftSingle.value : undefined"
                    :range-start="mode === 'range' ? state.draftRange.value.start : undefined"
                    :range-end="mode === 'range' ? state.draftRange.value.end : undefined"
                    :focused-date="accessibility.focusedDate.value"
                    @select="select"
                    @keydown="handleCalendarKeydown"
                />
                <RCalendar
                    v-else
                    :month="displayedMonth"
                    :locale="locale"
                    :constraints="constraints"
                    :selected="mode === 'single' ? state.draftSingle.value : undefined"
                    :range-start="mode === 'range' ? state.draftRange.value.start : undefined"
                    :range-end="mode === 'range' ? state.draftRange.value.end : undefined"
                    :focused-date="accessibility.focusedDate.value"
                    :show-navigation="true"
                    :show-year-selector="yearSelectorOpen"
                    @select="select"
                    @previous-month="handlePreviousMonth"
                    @next-month="handleNextMonth"
                    @toggle-year-selector="toggleYearSelector"
                    @keydown="handleCalendarKeydown"
                />
            </template>

            <div v-show="isTextMode" class="rui-date-picker__text-inputs" :class="{ 'rui-date-picker__text-inputs--range': mode === 'range' }">
                <RTextField
                    v-if="mode === 'single'"
                    v-model="textValue"
                    label="Date"
                    :placeholder="placeholder"
                    inputmode="numeric"
                    :error-text="state.validationMessage ?? undefined"
                    @input="validateTextInput"
                />
                <template v-else>
                    <RTextField v-model="startTextValue" label="Start date" :placeholder="placeholder" inputmode="numeric" :error-text="state.validationMessage ?? undefined" @input="validateTextInput" />
                    <RTextField v-model="endTextValue" label="End date" :placeholder="placeholder" inputmode="numeric" :error-text="state.validationMessage ?? undefined" @input="validateTextInput" />
                </template>
            </div>
        </div>

        <template #actions>
            <RButton variant="text" @click="closePicker({ reason: 'action', action: 'cancel' })">{{ labels.cancel }}</RButton>
            <RButton variant="text" :disabled="!isConfirmEnabled" @click="confirm">{{ confirmationLabel }}</RButton>
        </template>
    </component>
</template>
