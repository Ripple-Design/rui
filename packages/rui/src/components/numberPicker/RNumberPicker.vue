<script setup lang="ts">
/**
 * A vertically scrolling wheel for selecting numeric values.
 */
import { computed, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { useFormField } from "@/components/form/useFormField"

import type { RNumberPickerProps } from "./types"
import {
    formatNumberPickerValue,
    indexForValue,
    resolveIndex,
    resolveNumberPickerRange,
    valueAtIndex,
    visibleValue,
} from "./shared"

defineOptions({ inheritAttrs: false })

const SNAP_SCROLL_DURATION = 300
const SELECTOR_ADJUSTMENT_DURATION = 800
const ITEM_HEIGHT = 48
const ITEM_GAP = 8
const SELECTOR_ELEMENT_HEIGHT = ITEM_HEIGHT + ITEM_GAP
const MAXIMUM_FLING_VELOCITY = 1_000
const MINIMUM_DRAG_DISTANCE = 8
const MINIMUM_FLING_VELOCITY = 200
const FLING_DECELERATION = 6
const VISCOUS_FLUID_SCALE = 8
const VISCOUS_FLUID_START = 0.36787944117

const props = withDefaults(defineProps<RNumberPickerProps>(), {
    disabled: false,
    step: 1,
    wrap: true,
})
const emit = defineEmits<{
    change: [value: number]
}>()
const localModel = defineModel<number>()
const attrs = useAttrs()
const name = computed(() => (typeof attrs.name === "string" ? attrs.name : undefined))
const formField = useFormField<number>({
    defaultValue: () => props.min,
    model: localModel,
    name,
})
const model = formField.model
const rootRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const hovered = ref(false)
const dragging = ref(false)
const interacting = ref(false)
const trackCenterIndex = ref(0)
const logicalCenter = ref(0)
const trackOffset = ref(0)
const range = computed(() => resolveNumberPickerRange(props.min, props.max, props.step))
const displayedValue = computed(() => valueAtIndex(resolveIndex(trackCenterIndex.value, range.value, props.wrap), range.value))
const visibleOffsets = [-2, -1, 0, 1, 2]
const visibleItems = computed(() =>
    visibleOffsets.map((offset) => ({
        key: logicalCenter.value + offset,
        offset,
        value: visibleValue(trackCenterIndex.value, offset, range.value, props.wrap),
    })),
)
const wheelStyle = computed(() => ({ "--rui-comp-number-picker-wheel-offset": `${trackOffset.value}px` }))
const itemStyle = (offset: number) => {
    const selectionProgress = Math.max(0, 1 - Math.abs(offset + trackOffset.value / rowHeight()))
    return {
        "--rui-comp-number-picker-item-opacity": String(Math.max(0.28, 0.56 + selectionProgress * 0.44)),
        "--rui-comp-number-picker-item-selection-progress": `${selectionProgress * 100}%`,
    }
}
const rootClasses = computed(() => [
    "rui-number-picker",
    {
        "rui-number-picker--disabled": props.disabled,
        "rui-number-picker--dragging": dragging.value,
        "rui-number-picker--focused": focused.value,
        "rui-number-picker--hovered": hovered.value && !focused.value,
        "rui-number-picker--interacting": interacting.value,
    },
])
const rootAttrs = computed(() => {
    const { "aria-describedby": _describedby, "aria-label": _label, "aria-labelledby": _labelledby, name: _name, ...rest } = attrs
    return rest
})

let pointer: { id: number; lastTime: number; lastY: number; moved: boolean; startY: number; velocity: number } | null = null
let frame = 0
let animation: { elapsed: number; lastTime: number; previous: number; duration: number; distance: number; easing: (progress: number) => number } | null = null
let flinging = false
let flingVelocity = 0
let interactionTimeout: ReturnType<typeof setTimeout> | undefined
let syncingModel = false

function beginInteraction() {
    interacting.value = true
    if (interactionTimeout) {
        clearTimeout(interactionTimeout)
    }
    interactionTimeout = setTimeout(() => {
        interacting.value = false
        interactionTimeout = undefined
    }, SNAP_SCROLL_DURATION + SELECTOR_ADJUSTMENT_DURATION)
}

function stopInteraction() {
    if (interactionTimeout) {
        clearTimeout(interactionTimeout)
        interactionTimeout = undefined
    }
    interacting.value = false
}

function debugWheel(event: string, detail: Record<string, number | boolean>) {
    if (import.meta.env.DEV) {
        console.debug("[RNumberPicker]", event, detail)
    }
}

function rowHeight() {
    return SELECTOR_ELEMENT_HEIGHT
}

function rawViscousFluid(value: number) {
    if (value === 1) {
        return 1
    }

    let next = value * VISCOUS_FLUID_SCALE
    if (next < 1) {
        next -= 1 - Math.exp(-next)
    } else {
        next = 1 - Math.exp(1 - next)
        next = VISCOUS_FLUID_START + next * (1 - VISCOUS_FLUID_START)
    }
    return next
}

const VISCOUS_FLUID_NORMALIZER = 1 / rawViscousFluid(1)

function viscousFluid(value: number) {
    return value === 1 ? 1 : rawViscousFluid(value) * VISCOUS_FLUID_NORMALIZER
}

function decelerate(progress: number) {
    return 1 - (1 - progress) ** 5
}

function stopMotion(settle = false) {
    if (settle && animation && !flinging) {
        scrollBy(animation.distance - animation.previous)
    }
    if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
    }
    animation = null
    flinging = false
}

function commitValue(index: number) {
    const value = valueAtIndex(index, range.value)
    if (model.value === value) {
        return
    }

    syncingModel = true
    formField.setValue(value, "change")
    syncingModel = false
    emit("change", value)
}

function setCenterIndex(nextIndex: number, notify = false) {
    const resolved = resolveIndex(nextIndex, range.value, props.wrap)
    logicalCenter.value += nextIndex - trackCenterIndex.value
    trackCenterIndex.value = resolved
    if (notify) {
        commitValue(resolved)
    }
}

function canScroll(delta: number) {
    if (props.wrap) {
        return true
    }
    return !(delta > 0 && trackCenterIndex.value <= 0) && !(delta < 0 && trackCenterIndex.value >= range.value.count - 1)
}

/** Mirrors NumberPicker.scrollBy: move pixels, recycle three slots on each crossed row. */
function scrollBy(delta: number, notify = true) {
    const startingIndex = trackCenterIndex.value
    const startingOffset = trackOffset.value
    if (Math.abs(delta) < 0.001) {
        return
    }
    if (!delta || !canScroll(delta)) {
        trackOffset.value = 0
        debugWheel("scroll-blocked", { delta, index: startingIndex, offset: startingOffset })
        return
    }

    const height = rowHeight()
    trackOffset.value += delta

    while (trackOffset.value >= height) {
        trackOffset.value -= height
        setCenterIndex(trackCenterIndex.value - 1, notify)
        if (!props.wrap && trackCenterIndex.value <= 0) {
            trackOffset.value = 0
            return
        }
    }

    while (trackOffset.value <= -height) {
        trackOffset.value += height
        setCenterIndex(trackCenterIndex.value + 1, notify)
        if (!props.wrap && trackCenterIndex.value >= range.value.count - 1) {
            trackOffset.value = 0
            return
        }
    }

    if (startingIndex !== trackCenterIndex.value) {
        debugWheel("selector-crossed", {
            delta,
            from: startingIndex,
            offset: trackOffset.value,
            to: trackCenterIndex.value,
        })
    }
}

function animateScroll(distance: number, duration: number, easing: (progress: number) => number) {
    stopMotion(true)
    if (!distance) {
        return
    }

    animation = { distance, duration, easing, elapsed: 0, lastTime: 0, previous: 0 }
    frame = requestAnimationFrame(stepAnimation)
}

function stepAnimation(time: number) {
    frame = 0
    if (flinging) {
        stepFling(time)
        return
    }

    if (!animation) {
        return
    }

    if (!animation.lastTime) {
        animation.lastTime = time
        frame = requestAnimationFrame(stepAnimation)
        return
    }

    animation.elapsed += time - animation.lastTime
    animation.lastTime = time
    const progress = Math.min(1, animation.elapsed / animation.duration)
    const travelled = animation.distance * animation.easing(progress)
    scrollBy(travelled - animation.previous)
    animation.previous = travelled

    if (progress < 1) {
        frame = requestAnimationFrame(stepAnimation)
        return
    }

    scrollBy(animation.distance - animation.previous)
    animation = null
    ensureWheelAdjusted()
}

function ensureWheelAdjusted() {
    const delta = -trackOffset.value
    if (Math.abs(delta) < 0.001) {
        trackOffset.value = 0
        return
    }
    animateScroll(delta, SELECTOR_ADJUSTMENT_DURATION, decelerate)
}

function startFling(velocity: number) {
    stopMotion()
    flinging = true
    flingVelocity = Math.max(-MAXIMUM_FLING_VELOCITY, Math.min(MAXIMUM_FLING_VELOCITY, velocity))
    animation = { distance: 0, duration: 0, easing: decelerate, elapsed: 0, lastTime: 0, previous: 0 }
    frame = requestAnimationFrame(stepAnimation)
}

function stepFling(time: number) {
    if (!animation) {
        return
    }
    if (!animation.lastTime) {
        animation.lastTime = time
        frame = requestAnimationFrame(stepAnimation)
        return
    }

    const seconds = Math.min(1 / 30, (time - animation.lastTime) / 1000)
    animation.lastTime = time
    const delta = flingVelocity * seconds
    const before = trackCenterIndex.value
    scrollBy(delta)
    flingVelocity *= Math.exp(-FLING_DECELERATION * seconds)

    if ((!props.wrap && before === trackCenterIndex.value && trackOffset.value === 0) || Math.abs(flingVelocity) < MINIMUM_FLING_VELOCITY) {
        flinging = false
        animation = null
        ensureWheelAdjusted()
        return
    }

    frame = requestAnimationFrame(stepAnimation)
}

function changeValueBy(delta: number) {
    const target = resolveIndex(trackCenterIndex.value + delta, range.value, props.wrap)
    if (!props.wrap && target === trackCenterIndex.value) {
        return
    }

    animateScroll(-delta * rowHeight(), SNAP_SCROLL_DURATION, viscousFluid)
}

function changeValueByOne(increment: boolean) {
    changeValueBy(increment ? 1 : -1)
}

function handlePointerDown(event: PointerEvent) {
    if (props.disabled || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
        return
    }

    event.preventDefault()
    beginInteraction()
    stopMotion()
    pointer = {
        id: event.pointerId,
        lastTime: event.timeStamp,
        lastY: event.clientY,
        moved: false,
        startY: event.clientY,
        velocity: 0,
    }
    rootRef.value?.setPointerCapture?.(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
    if (pointer?.id !== event.pointerId || props.disabled) {
        return
    }

    const distance = event.clientY - pointer.startY
    if (!pointer.moved && Math.abs(distance) < MINIMUM_DRAG_DISTANCE) {
        return
    }

    if (!pointer.moved) {
        pointer.moved = true
        dragging.value = true
        const direction = Math.sign(distance)
        pointer.lastTime = event.timeStamp
        pointer.lastY = event.clientY
        if (direction) {
            scrollBy(direction * (Math.abs(distance) - MINIMUM_DRAG_DISTANCE))
        }
        return
    }

    const delta = event.clientY - pointer.lastY
    const elapsed = Math.max(1, event.timeStamp - pointer.lastTime)
    const instantaneousVelocity = (delta * 1000) / elapsed
    pointer.velocity = pointer.velocity * 0.7 + instantaneousVelocity * 0.3
    pointer.lastY = event.clientY
    pointer.lastTime = event.timeStamp
    scrollBy(delta)
}

function finishPointer(event: PointerEvent, cancelled = false) {
    if (pointer?.id !== event.pointerId) {
        return
    }

    const active = pointer
    pointer = null
    dragging.value = false
    beginInteraction()

    if (cancelled) {
        ensureWheelAdjusted()
        return
    }

    if (!active.moved) {
        const rect = rootRef.value?.getBoundingClientRect()
        if (!rect) {
            return
        }
        const row = Math.round((event.clientY - (rect.top + rect.height / 2)) / rowHeight())
        if (row < 0) {
            changeValueByOne(false)
        } else if (row > 0) {
            changeValueByOne(true)
        }
        return
    }

    if (Math.abs(active.velocity) > MINIMUM_FLING_VELOCITY) {
        startFling(active.velocity)
    } else {
        ensureWheelAdjusted()
    }
}

function handlePointerUp(event: PointerEvent) {
    finishPointer(event)
}

function handlePointerCancel(event: PointerEvent) {
    finishPointer(event, true)
}

function handleWheel(event: WheelEvent) {
    if (props.disabled || !event.deltaY) {
        return
    }
    event.preventDefault()
    beginInteraction()
    const increment = event.deltaY > 0
    debugWheel("wheel", {
        deltaY: event.deltaY,
        increment,
        index: trackCenterIndex.value,
        offset: trackOffset.value,
    })
    changeValueByOne(increment)
}

function handleKeydown(event: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    switch (event.key) {
        case "ArrowUp":
            event.preventDefault()
            changeValueByOne(true)
            break
        case "ArrowDown":
            event.preventDefault()
            changeValueByOne(false)
            break
        case "PageUp":
            event.preventDefault()
            changeValueBy(10)
            break
        case "PageDown":
            event.preventDefault()
            changeValueBy(-10)
            break
        case "Home":
            event.preventDefault()
            changeValueBy(-trackCenterIndex.value)
            break
        case "End":
            event.preventDefault()
            changeValueBy(range.value.count - 1 - trackCenterIndex.value)
            break
    }
}

watch(
    [() => model.value, range],
    () => {
        if (pointer || frame || syncingModel) {
            return
        }
        const next = indexForValue(model.value, range.value, false)
        const normalized = valueAtIndex(next, range.value)
        if (model.value !== normalized) {
            model.value = normalized
        }
        trackCenterIndex.value = next
        trackOffset.value = 0
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    stopMotion()
    stopInteraction()
})

defineExpose({ focus: () => rootRef.value?.focus() })
</script>

<template>
    <div
        ref="rootRef"
        v-bind="rootAttrs"
        :class="rootClasses"
        :style="wheelStyle"
        :tabindex="disabled ? -1 : 0"
        role="spinbutton"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="displayedValue"
        :aria-valuetext="formatNumberPickerValue(displayedValue, formatValue)"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        :aria-disabled="disabled ? 'true' : undefined"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @pointerenter="hovered = true"
        @pointerleave="hovered = false"
        @wheel="handleWheel"
        @focus="focused = true"
        @blur="focused = false"
        @keydown="handleKeydown"
        @focusout="formField.onFocusout"
    >
        <span
            class="rui-number-picker__viewport"
            aria-hidden="true"
        >
            <span
                v-for="item in visibleItems"
                :key="item.key"
                class="rui-number-picker__item"
                :class="{
                    'rui-number-picker__item--selected': item.offset === 0,
                    'rui-number-picker__item--adjacent': Math.abs(item.offset) === 1,
                }"
                :style="{
                    '--rui-comp-number-picker-item-offset': item.offset,
                    ...itemStyle(item.offset),
                }"
            >
                {{ item.value == null ? "" : formatNumberPickerValue(item.value, formatValue) }}
            </span>
        </span>
        <span class="rui-number-picker__selection" aria-hidden="true" />
    </div>
</template>

<style scoped lang="scss">
.rui-number-picker {
    --rui-comp-number-picker-row-height: 48px;
    --rui-comp-number-picker-item-gap: 8px;
    --rui-comp-number-picker-element-height: calc(
        var(--rui-comp-number-picker-row-height) + var(--rui-comp-number-picker-item-gap)
    );
    --rui-comp-number-picker-width: 64px;
    --rui-comp-number-picker-selected-text-color: var(--rui-sys-color-on-surface-high);
    --rui-comp-number-picker-adjacent-text-color: var(--rui-sys-color-on-surface-medium);
    --rui-comp-number-picker-text-size: var(--rui-sys-typo-body1-size);
    --rui-comp-number-picker-text-weight: var(--rui-sys-typo-body1-weight);
    --rui-comp-number-picker-text-font-family: var(--rui-sys-typo-body1-font-family);
    --rui-comp-number-picker-text-line-height: var(--rui-sys-typo-body1-line-height);
    --rui-comp-number-picker-text-letter-spacing: var(--rui-sys-typo-body1-letter-spacing);
    --rui-comp-number-picker-divider-thickness: 2px;
    --rui-comp-number-picker-divider-color: var(--rui-sys-color-on-surface-low);
    --rui-comp-number-picker-fade-edge: 12%;
    --rui-comp-number-picker-fade-soft: 25%;

    position: relative;
    display: block;
    inline-size: var(--rui-comp-number-picker-width);
    block-size: calc(var(--rui-comp-number-picker-element-height) * 3);
    overflow: hidden;
    cursor: grab;
    outline: none;
    overscroll-behavior: contain;
    touch-action: none;
    user-select: none;

    &:focus-visible {
        outline: 2px solid var(--rui-sys-color-primary);
        outline-offset: 2px;
    }

    &:focus:not(:focus-visible) {
        outline: none;
    }

    &--hovered {
        --rui-comp-number-picker-divider-color: var(--rui-sys-color-on-surface-high);
    }

    &--focused {
        --rui-comp-number-picker-divider-color: var(--rui-sys-color-primary);
    }

    &--interacting {
        --rui-comp-number-picker-divider-color: var(--rui-sys-color-primary);
    }

    &--dragging {
        cursor: grabbing;
    }

    &--disabled {
        --rui-comp-number-picker-selected-text-color: rgb(from var(--rui-sys-color-on-surface) r g b / 38%);
        --rui-comp-number-picker-adjacent-text-color: rgb(from var(--rui-sys-color-on-surface) r g b / 24%);
        cursor: default;
    }
}

.rui-number-picker__viewport {
    mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        rgb(0 0 0 / 35%) var(--rui-comp-number-picker-fade-edge),
        #000 var(--rui-comp-number-picker-fade-soft),
        #000 calc(100% - var(--rui-comp-number-picker-fade-soft)),
        rgb(0 0 0 / 35%) calc(100% - var(--rui-comp-number-picker-fade-edge)),
        transparent 100%
    );
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        rgb(0 0 0 / 35%) var(--rui-comp-number-picker-fade-edge),
        #000 var(--rui-comp-number-picker-fade-soft),
        #000 calc(100% - var(--rui-comp-number-picker-fade-soft)),
        rgb(0 0 0 / 35%) calc(100% - var(--rui-comp-number-picker-fade-edge)),
        transparent 100%
    );
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    pointer-events: none;
    position: absolute;
    inset: 0;
}

.rui-number-picker__item {
    position: absolute;
    inset-inline: 0;
    inset-block-start: calc(
        var(--rui-comp-number-picker-element-height) + var(--rui-comp-number-picker-item-gap) / 2
    );
    display: grid;
    place-items: center;
    block-size: var(--rui-comp-number-picker-row-height);
    color: color-mix(
        in srgb,
        var(--rui-comp-number-picker-adjacent-text-color),
        var(--rui-comp-number-picker-selected-text-color) var(--rui-comp-number-picker-item-selection-progress, 0%)
    );
    font-family: var(--rui-comp-number-picker-text-font-family), system-ui;
    font-size: var(--rui-comp-number-picker-text-size);
    font-weight: var(--rui-comp-number-picker-text-weight);
    letter-spacing: var(--rui-comp-number-picker-text-letter-spacing);
    line-height: var(--rui-comp-number-picker-text-line-height);
    opacity: var(--rui-comp-number-picker-item-opacity, 0.56);
    pointer-events: none;
    transform: translateY(calc(var(--rui-comp-number-picker-item-offset) * var(--rui-comp-number-picker-element-height) + var(--rui-comp-number-picker-wheel-offset)));

    &--selected {
        opacity: var(--rui-comp-number-picker-item-opacity, 1);
    }

    &--adjacent {
        opacity: var(--rui-comp-number-picker-item-opacity, 0.56);
    }
}

.rui-number-picker__selection {
    position: absolute;
    inset-inline: 0;
    inset-block-start: calc(
        var(--rui-comp-number-picker-element-height) + var(--rui-comp-number-picker-item-gap) / 2 -
            var(--rui-comp-number-picker-divider-thickness)
    );
    block-size: calc(var(--rui-comp-number-picker-row-height) + 2 * var(--rui-comp-number-picker-divider-thickness));
    box-sizing: border-box;
    border-block: var(--rui-comp-number-picker-divider-thickness) solid var(--rui-comp-number-picker-divider-color);
    pointer-events: none;
}
</style>
