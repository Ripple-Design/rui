<script setup lang="ts">
/**
 * Switches let users toggle a setting on or off.
 */

import { computed, nextTick, onMounted, ref, watch } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"
import RThumb from "@/foundations/thumb/RThumb.vue"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RSwitchProps } from "./types"

const props = withDefaults(defineProps<RSwitchProps>(), {
    disabled: false,
    ripple: true,
})

const model = defineModel<boolean>({ default: false })
const root = ref<HTMLElement>()
const rippleHost = ref<HTMLElement>()
const mounted = ref(false)
const progress = ref(model.value ? 1 : 0)
const isDragging = ref(false)
const suppressClick = ref(false)

let pointerId: number | null = null
let startX = 0
let startTime = 0
let startProgress = 0
let hasDragged = false
let velocitySamples: { x: number; time: number }[] = []

const MIN_FLING_VELOCITY = 0.05
const VELOCITY_SAMPLE_WINDOW = 100

const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true, unbounded: true }
    }

    const options = props.ripple === true ? {} : props.ripple
    return {
        ...options,
        color: options?.color ?? "var(--rui-comp-switch-state-layer-color)",
        disabled: props.disabled || !!options?.disabled,
        getSurfaceTarget: () => rippleHost.value ?? null,
        unbounded: {
            radius: 20,
            getCenter() {
                return {
                    x: 20,
                    y: 20,
                }
            },
        },
    }
})

watch(model, (value) => {
    if (!isDragging.value) {
        progress.value = value ? 1 : 0
    }
})

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled && pointerId != null) {
            resetGesture()
        }
    },
)

onMounted(async () => {
    await nextTick()
    mounted.value = true
})

function isRtl() {
    return root.value ? getComputedStyle(root.value).direction === "rtl" : false
}

function clamp(value: number) {
    return Math.min(1, Math.max(0, value))
}

function handleInputChange(event: Event) {
    model.value = (event.currentTarget as HTMLInputElement).checked
}

function handlePointerDown(event: PointerEvent) {
    if (props.disabled || event.button !== 0 || !event.isPrimary) {
        return
    }

    pointerId = event.pointerId
    startX = event.clientX
    startProgress = progress.value
    hasDragged = false
    velocitySamples = [{ x: event.clientX, time: event.timeStamp }]
}

function handlePointerMove(event: PointerEvent) {
    if (pointerId !== event.pointerId || props.disabled) {
        return
    }

    recordVelocitySample(event)

    const direction = isRtl() ? -1 : 1
    const delta = (event.clientX - startX) * direction
    if (!hasDragged && Math.abs(delta) < 4) {
        return
    }

    if (!hasDragged) {
        hasDragged = true
        isDragging.value = true
        root.value?.setPointerCapture(event.pointerId)
    }

    progress.value = clamp(startProgress + delta / 14)
}

function handlePointerUp(event: PointerEvent) {
    if (pointerId !== event.pointerId) {
        return
    }

    if (hasDragged) {
        const direction = isRtl() ? -1 : 1
        const velocity = getReleaseVelocity(event) * direction
        const nextValue = Math.abs(velocity) > MIN_FLING_VELOCITY ? velocity > 0 : progress.value > 0.5

        model.value = nextValue
        progress.value = nextValue ? 1 : 0
        suppressClick.value = true
    }

    resetGesture()
}

function handlePointerCancel(event: PointerEvent) {
    if (pointerId !== event.pointerId) {
        return
    }

    progress.value = model.value ? 1 : 0
    resetGesture()
}

function handleClick(event: MouseEvent) {
    if (!suppressClick.value) {
        return
    }

    event.preventDefault()
    suppressClick.value = false
}

function recordVelocitySample(event: PointerEvent) {
    velocitySamples.push({ x: event.clientX, time: event.timeStamp })
    const oldestTime = event.timeStamp - VELOCITY_SAMPLE_WINDOW
    velocitySamples = velocitySamples.filter((sample) => sample.time >= oldestTime)
}

function getReleaseVelocity(event: PointerEvent) {
    recordVelocitySample(event)
    const firstSample = velocitySamples[0]
    if (!firstSample) {
        return 0
    }

    return (event.clientX - firstSample.x) / Math.max(event.timeStamp - firstSample.time, 1)
}

function resetGesture() {
    pointerId = null
    isDragging.value = false
    hasDragged = false
    velocitySamples = []
}
</script>

<template>
    <label
        v-ripple="rippleOptions"
        ref="root"
        data-rui-touch-target-anchor
        class="rui-switch"
        :class="{
            'rui-switch--checked': model,
            'rui-switch--disabled': disabled,
            'rui-switch--dragging': isDragging,
            'rui-switch--mounted': mounted,
        }"
        :style="{ '--rui-comp-switch-progress': progress }"
        @click.capture="handleClick"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @lostpointercapture="handlePointerCancel"
    >
        <input
            v-bind="$attrs"
            class="rui-switch__native-control"
            type="checkbox"
            role="switch"
            :checked="model"
            :disabled="disabled"
            @change="handleInputChange"
        />
        <span class="rui-switch__visual" aria-hidden="true">
            <span class="rui-switch__track" />
            <span class="rui-switch__thumb-motion">
                <RThumb class="rui-switch__thumb">
                    <template #underlay>
                        <span ref="rippleHost" class="rui-switch__ripple-host" />
                    </template>
                </RThumb>
            </span>
        </span>
    </label>
</template>

<style scoped lang="scss">
.rui-switch {
    --rui-comp-switch-track-width: 34px;
    --rui-comp-switch-track-height: 14px;
    --rui-comp-switch-thumb-size: 20px;
    --rui-comp-switch-thumb-travel: 14px;
    --rui-comp-switch-progress: 0;
    --rui-comp-switch-direction: 1;
    --rui-comp-switch-motion-duration: var(--rui-sys-motion-duration-medium-in);
    --rui-comp-switch-motion-easing: var(--rui-sys-motion-easing-accelerate-decelerate);
    --rui-comp-switch-thumb-off-color: var(--rui-sys-color-surface);
    --rui-comp-switch-thumb-on-color: color-mix(
        in srgb,
        var(--rui-sys-color-surface),
        var(--rui-sys-color-primary) 100%
    );
    --rui-comp-switch-track-off-color: color-mix(
        in srgb,
        var(--rui-sys-color-surface),
        var(--rui-sys-color-on-surface) 32%
    );
    --rui-comp-switch-track-on-color: color-mix(
        in srgb,
        var(--rui-sys-color-surface),
        var(--rui-sys-color-primary) 54%
    );
    --rui-comp-switch-state-layer-color: var(--rui-sys-color-on-surface);
    --rui-comp-switch-disabled-thumb-color: color-mix(
        in srgb,
        var(--rui-sys-color-surface) 62%,
        var(--rui-sys-color-on-surface) 38%
    );
    --rui-comp-thumb-size: var(--rui-comp-switch-thumb-size);
    --rui-comp-thumb-color: var(--rui-comp-switch-thumb-off-color);
    --rui-comp-thumb-shadow: 0 2px 4px rgb(0 0 0 / 30%);

    position: relative;
    display: inline-grid;
    place-items: center;
    inline-size: 48px;
    block-size: 48px;
    overflow: visible;
    cursor: pointer;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;

    &:dir(rtl) {
        --rui-comp-switch-direction: -1;
    }

    &--checked {
        --rui-comp-switch-state-layer-color: var(--rui-sys-color-primary);
        --rui-comp-thumb-color: var(--rui-comp-switch-thumb-on-color);
    }

    &--disabled {
        --rui-comp-switch-thumb-off-color: var(--rui-comp-switch-disabled-thumb-color);
        --rui-comp-switch-thumb-on-color: color-mix(
            in srgb,
            var(--rui-sys-color-surface),
            var(--rui-sys-color-primary) 38%
        );
        --rui-comp-switch-track-off-color: color-mix(
            in srgb,
            var(--rui-sys-color-surface),
            var(--rui-sys-color-on-surface) 12%
        );
        --rui-comp-switch-track-on-color: color-mix(
            in srgb,
            var(--rui-sys-color-surface),
            var(--rui-sys-color-primary) 12%
        );
        --rui-comp-thumb-color: var(--rui-comp-switch-disabled-thumb-color);
        cursor: default;

        &.rui-switch--checked {
            --rui-comp-thumb-color: var(--rui-comp-switch-thumb-on-color);
        }
    }
}

.rui-switch__native-control {
    position: absolute;
    z-index: 3;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    appearance: none;
    cursor: inherit;
    opacity: 0;
}

.rui-switch__visual {
    position: absolute;
    z-index: 2;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    inline-size: var(--rui-comp-switch-track-width);
    block-size: var(--rui-comp-switch-thumb-size);
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.rui-switch__track {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 0;
    inline-size: var(--rui-comp-switch-track-width);
    block-size: var(--rui-comp-switch-track-height);
    border-radius: 999px;
    transform: translateY(-50%);
    background-color: color-mix(
        in srgb,
        var(--rui-comp-switch-track-off-color) calc((1 - var(--rui-comp-switch-progress)) * 100%),
        var(--rui-comp-switch-track-on-color)
    );
    transition: background-color var(--rui-comp-switch-motion-duration) var(--rui-comp-switch-motion-easing);
}

.rui-switch__thumb-motion {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    z-index: 1;
    inline-size: var(--rui-comp-switch-thumb-size);
    block-size: var(--rui-comp-switch-thumb-size);
    transform: translateX(
        calc(var(--rui-comp-switch-progress) * var(--rui-comp-switch-thumb-travel) * var(--rui-comp-switch-direction))
    );

    .rui-switch--mounted & {
        transition: transform var(--rui-comp-switch-motion-duration) var(--rui-comp-switch-motion-easing);
    }

    .rui-switch--dragging & {
        transition: none;
    }
}

.rui-switch__ripple-host {
    position: absolute;
    inset: -10px;
    z-index: 0;
    pointer-events: none;
}

.rui-switch__thumb {
    position: relative;
    z-index: 1;
    display: block;
    inline-size: var(--rui-comp-switch-thumb-size);
    block-size: var(--rui-comp-switch-thumb-size);

    .rui-switch--dragging & {
        transition: none;
    }
}

.rui-switch:has(.rui-switch__native-control:focus-visible)::after {
    position: absolute;
    inset: -4px;
    border: 2px solid var(--rui-sys-color-primary);
    border-radius: 999px;
    content: "";
    pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
    .rui-switch__track,
    .rui-switch__thumb-motion {
        transition-duration: 0ms !important;
    }
}
</style>
