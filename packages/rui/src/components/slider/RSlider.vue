<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, type StyleValue } from "vue"

import RThumb from "@/foundations/thumb/RThumb.vue"

import type { RSliderModelValue, RSliderRangeValue, RSliderProps } from "./types"

import {
    formatSliderValue,
    percentToValue,
    resolveRangeAriaLabel,
    resolveThumbValue,
    resolveTickPercents,
    valueToPercent,
} from "./shared"

type SliderThumb = "single" | "start" | "end"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RSliderProps>(), {
    disabled: false,
    max: 100,
    min: 0,
    showTicks: false,
    step: 0,
})
const emit = defineEmits<{
    change: [value: RSliderModelValue]
}>()
const model = defineModel<RSliderModelValue>({ default: 0 })
const attrs = useAttrs()
const rootRef = ref<HTMLElement | null>(null)
const singleInputRef = ref<HTMLInputElement | null>(null)
const startInputRef = ref<HTMLInputElement | null>(null)
const endInputRef = ref<HTMLInputElement | null>(null)
const activeThumb = ref<SliderThumb | null>(null)
const focusedThumb = ref<SliderThumb | null>(null)
const hoveredThumb = ref<SliderThumb | null>(null)
const dragging = ref(false)
const trackWidth = ref(0)

let observer: ResizeObserver | undefined
let pointer: { id: number; startX: number; thumb: SliderThumb | null } | null = null

const isRange = computed(() => Array.isArray(model.value))
const rangeValue = computed<RSliderRangeValue | null>(() => (Array.isArray(model.value) ? model.value : null))
const singleValue = computed(() => (typeof model.value === "number" ? model.value : props.min))
const startValue = computed(() => rangeValue.value?.[0] ?? props.min)
const endValue = computed(() => rangeValue.value?.[1] ?? props.max)
const tickPercents = computed(() => resolveTickPercents(props.min, props.max, props.step, trackWidth.value))
const rootClasses = computed(() => [
    "rui-slider",
    {
        "rui-slider--disabled": props.disabled,
        "rui-slider--dragging": dragging.value,
        "rui-slider--range": isRange.value,
    },
])
const rootAttrs = computed(() => {
    const {
        "aria-describedby": _ariaDescribedby,
        "aria-label": _ariaLabel,
        "aria-labelledby": _ariaLabelledby,
        ...rest
    } = attrs
    return rest
})
const activeSpan = computed(() => {
    if (isRange.value) {
        const start = valueToPercent(startValue.value, props.min, props.max)
        const end = valueToPercent(endValue.value, props.min, props.max)
        return { start, size: end - start }
    }

    return { start: 0, size: valueToPercent(singleValue.value, props.min, props.max) }
})

function thumbPercent(thumb: SliderThumb) {
    const value = thumb === "single" ? singleValue.value : thumb === "start" ? startValue.value : endValue.value
    return valueToPercent(value, props.min, props.max)
}

function thumbStyle(thumb: SliderThumb): StyleValue {
    return {
        "--rui-comp-slider-thumb-position": thumbPercent(thumb),
        zIndex: activeThumb.value === thumb ? 3 : 2,
    }
}

function isTickActive(percent: number) {
    const { start, size } = activeSpan.value
    return percent >= start && percent <= start + size
}

function isActiveEndpointTick(percent: number) {
    const { start, size } = activeSpan.value
    return percent === start || percent === start + size
}

function activeEndpointTickOffset(percent: number) {
    const { start, size } = activeSpan.value

    if (percent === start) {
        return "1px"
    }

    return percent === start + size ? "-1px" : "0px"
}

function isIndicatorVisible(thumb: SliderThumb) {
    if (props.disabled) {
        return false
    }

    return dragging.value ? isRange.value || activeThumb.value === thumb : focusedThumb.value === thumb
}

function inputForThumb(thumb: SliderThumb) {
    if (thumb === "single") {
        return singleInputRef.value
    }

    return thumb === "start" ? startInputRef.value : endInputRef.value
}

function resolvePointerPercent(event: PointerEvent) {
    const root = rootRef.value
    if (!root) {
        return 0
    }

    const rect = root.getBoundingClientRect()
    const inset = 16
    const physicalPercent = (event.clientX - rect.left - inset) / Math.max(1, rect.width - inset * 2)
    return getComputedStyle(root).direction === "rtl" ? 1 - physicalPercent : physicalPercent
}

function resolveClosestThumb(percent: number): SliderThumb | null {
    if (!isRange.value) {
        return "single"
    }

    const startPercent = thumbPercent("start")
    const endPercent = thumbPercent("end")

    if (startPercent === endPercent && percent === startPercent) {
        return null
    }

    return Math.abs(percent - startPercent) <= Math.abs(percent - endPercent) ? "start" : "end"
}

function resolveOverlappingThumb(percent: number) {
    const startPercent = thumbPercent("start")
    const endPercent = thumbPercent("end")
    return percent < startPercent ? "start" : percent > endPercent ? "end" : null
}

function updateThumb(thumb: SliderThumb, percent: number) {
    const candidate = percentToValue(percent, props.min, props.max, props.step)
    const value = resolveThumbValue(candidate, rangeValue.value, thumb, props.min, props.max, props.step)

    if (thumb === "single") {
        if (model.value !== value) {
            model.value = value
        }
        return
    }

    const current = rangeValue.value
    if (!current) {
        return
    }

    const next: RSliderRangeValue = thumb === "start" ? [value, current[1]] : [current[0], value]
    if (next[0] !== current[0] || next[1] !== current[1]) {
        model.value = next
    }
}

function commit() {
    emit("change", model.value)
}

function handlePointerDown(event: PointerEvent) {
    if (props.disabled || !event.isPrimary || event.button !== 0) {
        return
    }

    event.preventDefault()
    const percent = resolvePointerPercent(event)
    const thumb = resolveClosestThumb(percent)
    pointer = { id: event.pointerId, startX: event.clientX, thumb }
    activeThumb.value = thumb

    if (thumb) {
        focusedThumb.value = thumb
        inputForThumb(thumb)?.focus()
    }
}

function handlePointerMove(event: PointerEvent) {
    if (pointer?.id !== event.pointerId || props.disabled) {
        return
    }

    if (!dragging.value && Math.abs(event.clientX - pointer.startX) < 4) {
        return
    }

    if (!pointer.thumb) {
        pointer.thumb = resolveOverlappingThumb(resolvePointerPercent(event))
        if (!pointer.thumb) {
            return
        }

        activeThumb.value = pointer.thumb
        focusedThumb.value = pointer.thumb
        inputForThumb(pointer.thumb)?.focus()
    }

    if (!dragging.value) {
        dragging.value = true
        rootRef.value?.setPointerCapture(event.pointerId)
    }

    updateThumb(pointer.thumb, resolvePointerPercent(event))
}

function finishPointer(event: PointerEvent, cancelled = false) {
    if (pointer?.id !== event.pointerId) {
        return
    }

    if (!cancelled && pointer.thumb) {
        updateThumb(pointer.thumb, resolvePointerPercent(event))
        commit()
    }

    pointer = null
    dragging.value = false
    activeThumb.value = null
}

function handlePointerUp(event: PointerEvent) {
    finishPointer(event)
}

function handlePointerCancel(event: PointerEvent) {
    finishPointer(event, true)
}

function handleInput(thumb: SliderThumb, event: Event) {
    const value = Number((event.currentTarget as HTMLInputElement).value)
    updateThumb(thumb, valueToPercent(value, props.min, props.max))
}

function handleInputChange() {
    commit()
}

function handleKeydown(thumb: SliderThumb, event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return
    }

    const root = rootRef.value
    const rtl = root ? getComputedStyle(root).direction === "rtl" : false
    const increment = props.step || 1
    const forward = event.key === "ArrowRight" ? !rtl : rtl
    const current = thumb === "single" ? singleValue.value : thumb === "start" ? startValue.value : endValue.value

    event.preventDefault()
    updateThumb(thumb, valueToPercent(current + (forward ? increment : -increment), props.min, props.max))
}

function handleFocus(thumb: SliderThumb) {
    focusedThumb.value = thumb
}

function handleBlur(thumb: SliderThumb) {
    if (focusedThumb.value === thumb) {
        focusedThumb.value = null
    }
}

function handleHover(event: PointerEvent) {
    if (props.disabled || pointer) {
        return
    }

    hoveredThumb.value = resolveClosestThumb(resolvePointerPercent(event))
}

onMounted(() => {
    if (!rootRef.value) {
        return
    }

    observer = new ResizeObserver(([entry]) => {
        trackWidth.value = entry?.contentRect.width ? Math.max(0, entry.contentRect.width - 32) : 0
    })
    observer.observe(rootRef.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <div
        ref="rootRef"
        v-bind="rootAttrs"
        :class="rootClasses"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @lostpointercapture="handlePointerCancel"
        @pointerenter="handleHover"
        @pointerleave="hoveredThumb = null"
    >
        <div class="rui-slider__track" aria-hidden="true">
            <span class="rui-slider__inactive-track" />
            <span
                class="rui-slider__active-track"
                :style="{
                    insetInlineStart: `${activeSpan.start * 100}%`,
                    inlineSize: `${activeSpan.size * 100}%`,
                }"
            />
            <span class="rui-slider__ticks">
                <span
                    v-for="percent in tickPercents"
                    :key="percent"
                    class="rui-slider__tick"
                    :class="{
                        'rui-slider__tick--active': isTickActive(percent),
                        'rui-slider__tick--active-endpoint': isActiveEndpointTick(percent),
                    }"
                    :style="{
                        insetInlineStart: `${percent * 100}%`,
                        '--rui-comp-slider-tick-active-endpoint-offset': activeEndpointTickOffset(percent),
                    }"
                />
            </span>
        </div>

        <template v-for="thumb in (isRange ? ['start', 'end'] : ['single']) as SliderThumb[]" :key="thumb">
            <span class="rui-slider__thumb" :style="thumbStyle(thumb)" aria-hidden="true">
                <RThumb>
                    <span
                        class="rui-slider__value-indicator"
                        :class="{ 'rui-slider__value-indicator--visible': isIndicatorVisible(thumb) }"
                    >
                        {{
                            formatSliderValue(
                                thumb === "single" ? singleValue : thumb === "start" ? startValue : endValue,
                                formatValue,
                            )
                        }}
                    </span>
                </RThumb>
            </span>
        </template>

        <input
            v-if="!isRange"
            ref="singleInputRef"
            class="rui-slider__native-control"
            type="range"
            :min="min"
            :max="max"
            :step="step === 0 ? 'any' : step"
            :value="singleValue"
            :disabled="disabled"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
            :aria-valuetext="formatSliderValue(singleValue, formatValue)"
            @input="handleInput('single', $event)"
            @change="handleInputChange"
            @keydown="handleKeydown('single', $event)"
            @focus="handleFocus('single')"
            @blur="handleBlur('single')"
        />
        <template v-else>
            <input
                ref="startInputRef"
                class="rui-slider__native-control"
                type="range"
                :min="min"
                :max="endValue"
                :step="step === 0 ? 'any' : step"
                :value="startValue"
                :disabled="disabled"
                :aria-label="resolveRangeAriaLabel(ariaLabel, 'start', startAriaLabel)"
                :aria-labelledby="ariaLabelledby"
                :aria-describedby="ariaDescribedby"
                :aria-valuetext="formatSliderValue(startValue, formatValue)"
                @input="handleInput('start', $event)"
                @change="handleInputChange"
                @keydown="handleKeydown('start', $event)"
                @focus="handleFocus('start')"
                @blur="handleBlur('start')"
            />
            <input
                ref="endInputRef"
                class="rui-slider__native-control"
                type="range"
                :min="startValue"
                :max="max"
                :step="step === 0 ? 'any' : step"
                :value="endValue"
                :disabled="disabled"
                :aria-label="resolveRangeAriaLabel(ariaLabel, 'end', endAriaLabel)"
                :aria-labelledby="ariaLabelledby"
                :aria-describedby="ariaDescribedby"
                :aria-valuetext="formatSliderValue(endValue, formatValue)"
                @input="handleInput('end', $event)"
                @change="handleInputChange"
                @keydown="handleKeydown('end', $event)"
                @focus="handleFocus('end')"
                @blur="handleBlur('end')"
            />
        </template>
    </div>
</template>

<style scoped lang="scss">
.rui-slider {
    --rui-comp-slider-height: var(--rui-touch-target-size);
    --rui-comp-slider-track-inset: 16px;
    --rui-comp-slider-track-height: 4px;
    --rui-comp-slider-active-track-height: 6px;
    --rui-comp-slider-track-radius: 999px;
    --rui-comp-slider-thumb-size: 20px;
    --rui-comp-slider-active-track-color: var(--rui-sys-color-primary);
    --rui-comp-slider-inactive-track-color: rgb(from var(--rui-sys-color-primary) r g b / 24%);
    --rui-comp-slider-thumb-color: var(--rui-sys-color-primary);
    --rui-comp-slider-thumb-cutout-color: var(--rui-sys-color-surface);
    --rui-comp-slider-disabled-thumb-color: color-mix(
        in srgb,
        var(--rui-sys-color-surface) 62%,
        var(--rui-sys-color-on-surface) 38%
    );
    --rui-comp-slider-disabled-thumb-shadow: 0 1px 2px rgb(0 0 0 / 30%);
    --rui-comp-slider-thumb-shadow: 0 1px 2px rgb(0 0 0 / 30%);
    --rui-comp-slider-halo-color: rgb(from var(--rui-sys-color-primary) r g b / 24%);
    --rui-comp-slider-active-tick-color: rgb(from var(--rui-sys-color-on-primary) r g b / 54%);
    --rui-comp-slider-inactive-tick-color: rgb(from var(--rui-sys-color-primary) r g b / 54%);
    --rui-comp-slider-value-indicator-color: var(
        --rui-comp-plain-tooltip-background-color,
        color-mix(
            in srgb,
            color-mix(in srgb, var(--rui-sys-color-background) 60%, transparent),
            color-mix(in srgb, var(--rui-sys-color-on-background) 90%, transparent)
        )
    );
    --rui-comp-slider-value-indicator-text-color: var(--rui-sys-color-on-primary);
    --rui-comp-slider-position-duration: var(--rui-sys-motion-duration-small-in);
    --rui-comp-slider-position-easing: var(--rui-sys-motion-easing-standard);
    --rui-comp-slider-value-indicator-enter-duration: 83ms;
    --rui-comp-slider-value-indicator-exit-duration: 117ms;
    --rui-comp-slider-value-indicator-pointer-size: 6px;
    --rui-comp-slider-value-indicator-thumb-gap: 4px;
    --rui-comp-thumb-size: var(--rui-comp-slider-thumb-size);
    --rui-comp-thumb-color: var(--rui-comp-slider-thumb-color);
    --rui-comp-thumb-shadow: var(--rui-comp-slider-thumb-shadow);
    --rui-comp-thumb-halo-color: var(--rui-comp-slider-halo-color);
    --rui-comp-thumb-size: var(--rui-comp-slider-thumb-size);
    --rui-comp-thumb-color: var(--rui-comp-slider-thumb-color);
    --rui-comp-thumb-shadow: var(--rui-comp-slider-thumb-shadow);
    --rui-comp-thumb-halo-color: var(--rui-comp-slider-halo-color);

    position: relative;
    display: block;
    min-inline-size: 128px;
    inline-size: 100%;
    block-size: var(--rui-comp-slider-height);
    cursor: pointer;
    touch-action: none;
    user-select: none;

    &--disabled {
        --rui-comp-slider-active-track-color: rgb(from var(--rui-sys-color-on-surface) r g b / 32%);
        --rui-comp-slider-inactive-track-color: rgb(from var(--rui-sys-color-on-surface) r g b / 12%);
        --rui-comp-slider-thumb-color: var(--rui-comp-slider-disabled-thumb-color);
        --rui-comp-slider-thumb-shadow: var(--rui-comp-slider-disabled-thumb-shadow);
        --rui-comp-slider-halo-color: transparent;
        --rui-comp-slider-active-tick-color: rgb(from var(--rui-sys-color-on-primary) r g b / 38%);
        --rui-comp-slider-inactive-tick-color: rgb(from var(--rui-sys-color-on-surface) r g b / 12%);

        cursor: default;
    }
}

.rui-slider__track {
    position: absolute;
    inset-block-start: 50%;
    inset-inline: var(--rui-comp-slider-track-inset);
    block-size: var(--rui-comp-slider-track-height);
    transform: translateY(-50%);
}

.rui-slider__inactive-track,
.rui-slider__active-track {
    position: absolute;
    inset-block: 0;
    border-radius: var(--rui-comp-slider-track-radius);
}

.rui-slider__inactive-track {
    inset-inline: 0;
    background: var(--rui-comp-slider-inactive-track-color);
}

.rui-slider__active-track {
    inset-block-start: 50%;
    block-size: var(--rui-comp-slider-active-track-height);
    background: var(--rui-comp-slider-active-track-color);
    transform: translateY(-50%);
    transition:
        inset-inline-start var(--rui-comp-slider-position-duration) var(--rui-comp-slider-position-easing),
        inline-size var(--rui-comp-slider-position-duration) var(--rui-comp-slider-position-easing);

    .rui-slider--dragging & {
        transition: none;
    }
}

.rui-slider__ticks {
    position: absolute;
    inset-block: 0;
    inset-inline: 2px;
}

.rui-slider__tick {
    position: absolute;
    inset-block-start: 50%;
    inline-size: 2px;
    block-size: 2px;
    border-radius: 50%;
    background: var(--rui-comp-slider-inactive-tick-color);
    transform: translate(-50%, -50%);

    &--active {
        background: var(--rui-comp-slider-active-tick-color);
    }

    &--active-endpoint {
        margin-inline-start: var(--rui-comp-slider-tick-active-endpoint-offset);
    }
}

.rui-slider__thumb {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: calc(
        var(--rui-comp-slider-track-inset) + (100% - var(--rui-comp-slider-track-inset) * 2) *
            var(--rui-comp-slider-thumb-position)
    );
    inline-size: var(--rui-comp-slider-thumb-size);
    block-size: var(--rui-comp-slider-thumb-size);
    pointer-events: auto;
    transform: translate(-50%, -50%);
    transition: inset-inline-start var(--rui-comp-slider-position-duration) var(--rui-comp-slider-position-easing);

    .rui-slider--dragging & {
        transition: none;
    }

    :dir(rtl) & {
        transform: translate(50%, -50%);
    }
}

.rui-slider__value-indicator {
    position: absolute;
    inset-block-end: calc(
        100% + var(--rui-comp-slider-value-indicator-pointer-size) + var(--rui-comp-slider-value-indicator-thumb-gap)
    );
    inset-inline-start: 50%;
    z-index: 2;
    //min-inline-size: 32px;
    padding: 8px 12px;
    border-radius: 4px;
    color: var(--rui-comp-slider-value-indicator-text-color);
    background: var(--rui-comp-slider-value-indicator-color);
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    user-select: none;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) scale(0.8);
    transform-origin: center bottom;
    transition:
        opacity var(--rui-comp-slider-value-indicator-exit-duration) var(--rui-sys-motion-easing-accelerated),
        transform var(--rui-comp-slider-value-indicator-exit-duration) var(--rui-sys-motion-easing-accelerated);

    &::after {
        position: absolute;
        inset-block-start: 100%;
        inset-inline-start: 50%;
        border: var(--rui-comp-slider-value-indicator-pointer-size) solid transparent;
        border-block-start-color: var(--rui-comp-slider-value-indicator-color);
        content: "";
        transform: translateX(-50%);
    }

    &--visible {
        opacity: 1;
        transform: translateX(-50%) scale(1);
        transition-duration: var(--rui-comp-slider-value-indicator-enter-duration);
        transition-timing-function: var(--rui-sys-motion-easing-decelerated);
    }
}

.rui-slider__native-control {
    position: absolute;
    z-index: 4;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    appearance: none;
    cursor: inherit;
    opacity: 0;
    pointer-events: none;

    &:focus-visible + * {
        outline: none;
    }
}

:dir(rtl) .rui-slider__tick {
    transform: translate(50%, -50%);
}

@media (prefers-reduced-motion: reduce) {
    .rui-slider__active-track,
    .rui-slider__thumb,
    .rui-slider__value-indicator {
        transition-duration: 0ms !important;
    }
}
</style>
