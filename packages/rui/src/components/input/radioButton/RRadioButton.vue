<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RRadioButtonProps } from "./types.ts"

import { radioButtonGroupKey } from "./groupContext.ts"

const props = withDefaults(defineProps<RRadioButtonProps>(), {
    disabled: false,
    ripple: true,
})

const model = defineModel<boolean>({ default: false })
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const group = inject(radioButtonGroupKey, null)
const radioId = Symbol("rRadioButton")
const mounted = ref(false)
const animation = ref<"on" | "off" | null>(null)
let warnedMissingValue = false

const hasValue = computed(() => props.value !== undefined)
const isGrouped = computed(() => group != null)
const checked = computed(() => (group ? (hasValue.value ? group.isSelected(props.value) : false) : model.value))
const resolvedName = computed(() => group?.name.value ?? props.name)
const tabIndex = computed(() => (group ? group.getTabIndex(radioId) : undefined))
const indicatorColor = computed(() => {
    if (props.disabled) {
        return checked.value ? "var(--rui-sys-color-primary-low)" : "var(--rui-sys-color-on-surface-low)"
    }

    return checked.value ? "var(--rui-sys-color-primary)" : "var(--rui-sys-color-on-surface-medium)"
})
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true }
    }

    const options = props.ripple === true ? {} : props.ripple
    return {
        ...options,
        disabled: props.disabled || !!options?.disabled,
    }
})

watch(
    [() => props.disabled, () => props.value, hasValue, input],
    ([disabled, value, nextHasValue, element]) => {
        if (!group) {
            return
        }

        group.registerItem(radioId, {
            disabled,
            element,
            hasValue: nextHasValue,
            value,
        })
    },
    { immediate: true },
)

watch(
    [isGrouped, hasValue],
    ([nextIsGrouped, nextHasValue]) => {
        if (!nextIsGrouped || nextHasValue || warnedMissingValue) {
            return
        }

        warnedMissingValue = true
        if (import.meta.env.DEV) {
            console.warn("[RRadioButtonGroup] Every grouped RRadioButton requires a unique `value`.")
        }
    },
    { immediate: true },
)

watch(checked, (nextValue, previousValue) => {
    if (!mounted.value || nextValue === previousValue) {
        return
    }

    animation.value = nextValue ? "on" : "off"
})

onMounted(async () => {
    await nextTick()
    mounted.value = true
})

onBeforeUnmount(() => group?.unregisterItem(radioId))

function handleChange(event: Event) {
    if (!(event.currentTarget as HTMLInputElement).checked) {
        return
    }

    if (group) {
        group.activate(radioId)
        return
    }

    model.value = true
}

function handleKeydown(event: KeyboardEvent) {
    if (!group) {
        return
    }

    const isRtl = input.value ? getComputedStyle(input.value).direction === "rtl" : false
    const supported = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]
    if (!supported.includes(event.key)) {
        return
    }

    const before =
        group.orientation.value === "vertical"
            ? ["ArrowUp", "ArrowDown", "Home", "End"]
            : ["ArrowLeft", "ArrowRight", "Home", "End"]
    if (!before.includes(event.key)) {
        return
    }

    event.preventDefault()
    group.focusByKey(radioId, event.key, isRtl)
}
</script>

<template>
    <RTouchTargetWrapper class="rui-radio-button__touch-target-wrapper">
        <label
            class="rui-radio-button"
            :class="{
                'rui-radio-button--checked': checked,
                'rui-radio-button--disabled': disabled,
                [`rui-radio-button--animation-${animation}`]: mounted && animation,
            }"
            :style="{ '--rui-comp-radio-button-indicator-color': indicatorColor }"
        >
            <span v-ripple="rippleOptions" class="rui-radio-button__control">
                <input
                    ref="input"
                    v-bind="attrs"
                    class="rui-radio-button__native-control"
                    type="radio"
                    :name="resolvedName"
                    :value="value"
                    :checked="checked"
                    :disabled="disabled"
                    :required="group?.required.value"
                    :tabindex="tabIndex"
                    @change="handleChange"
                    @keydown="handleKeydown"
                />
                <span class="rui-radio-button__content" aria-hidden="true">
                    <svg class="rui-radio-button__indicator-vector" viewBox="0 0 32 32">
                        <g class="rui-radio-button__ring-motion">
                            <path
                                class="rui-radio-button__ring"
                                d="M 16 7 c 4.9705627482 0 9 4.0294372518 9 9 c 0 4.9705627482 -4.0294372518 9 -9 9 c -4.9705627482 0 -9 -4.0294372518 -9 -9 c 0 -4.9705627482 4.0294372518 -9 9 -9 Z"
                            />
                        </g>
                        <path
                            class="rui-radio-button__dot"
                            d="M 16 11 c -2.7619934082 0 -5 2.2380065918 -5 5 c 0 2.7619935918 2.2380065918 5 5 5 c 2.7619935918 0 5 -2.2380065918 5 -5 c 0 -2.7619935918 -2.2380065918 -5 -5 -5 Z"
                        />
                    </svg>
                </span>
            </span>
            <span v-if="$slots.default" class="rui-radio-button__label"><slot /></span>
        </label>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/typography";

.rui-radio-button__touch-target-wrapper {
    display: inline-flex;
    vertical-align: middle;
}

.rui-radio-button {
    --rui-comp-radio-button-target-size: 48px;
    --rui-comp-radio-button-visual-size: 32px;
    --rui-comp-radio-button-ring-size: 18px;
    --rui-comp-radio-button-ring-stroke: 2px;
    --rui-comp-radio-button-dot-size: 10px;
    --rui-comp-radio-button-label-gap: 4px;
    --rui-comp-radio-button-indicator-color: var(--rui-sys-color-on-surface-medium);
    --rui-comp-radio-button-state-layer-color: var(--rui-sys-color-on-surface);

    position: relative;
    display: inline-flex;
    align-items: center;
    min-block-size: var(--rui-comp-radio-button-target-size);
    cursor: pointer;
    color: var(--rui-sys-color-on-surface-high);

    &--checked {
        --rui-comp-radio-button-state-layer-color: var(--rui-sys-color-primary);
    }

    &--disabled {
        cursor: default;
    }
}

.rui-radio-button__control {
    position: relative;
    display: inline-flex;
    flex: 0 0 40px;
    align-items: center;
    justify-content: center;
    inline-size: 40px;
    block-size: 40px;
    border-radius: 50%;
}

.rui-radio-button__native-control {
    position: absolute;
    z-index: 2;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    appearance: none;
    cursor: inherit;
    opacity: 0;
}

.rui-radio-button__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.rui-radio-button__control:has(.rui-radio-button__native-control:focus-visible) {
    outline: 2px solid var(--rui-sys-color-primary);
    outline-offset: -2px;
    border-radius: 50%;
}

.rui-radio-button__indicator-vector {
    display: block;
    inline-size: var(--rui-comp-radio-button-visual-size);
    block-size: var(--rui-comp-radio-button-visual-size);
}

.rui-radio-button__ring-motion,
.rui-radio-button__dot {
    transform-box: view-box;
    transform-origin: 16px 16px;
}

.rui-radio-button__ring {
    fill: none;
    stroke: var(--rui-comp-radio-button-indicator-color);
    stroke-width: var(--rui-comp-radio-button-ring-stroke);
}

.rui-radio-button__dot {
    fill: var(--rui-comp-radio-button-indicator-color);
    transform: scale(0);
}

.rui-radio-button--checked .rui-radio-button__dot {
    transform: scale(1);
}

.rui-radio-button__label {
    @include typography.body2("--rui-comp-radio-button-label");

    margin-inline-start: var(--rui-comp-radio-button-label-gap);
    color: var(--rui-sys-color-on-surface-high);
}

.rui-radio-button:has(.rui-radio-button__native-control:focus-visible) .rui-radio-button__state-layer {
    outline: 2px solid var(--rui-sys-color-primary);
    outline-offset: -4px;
}

.rui-radio-button--animation-on .rui-radio-button__ring-motion,
.rui-radio-button--animation-on .rui-radio-button__dot,
.rui-radio-button--animation-on .rui-radio-button__ring {
    animation-duration: 498ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: both;
}

.rui-radio-button--animation-on .rui-radio-button__ring-motion {
    animation-name: rui-radio-button-ring-on;
}

.rui-radio-button--animation-on .rui-radio-button__ring {
    animation-name: rui-radio-button-pulse-on;
}

.rui-radio-button--animation-on .rui-radio-button__dot {
    animation-name: rui-radio-button-dot-on;
}

.rui-radio-button--animation-off .rui-radio-button__ring-motion,
.rui-radio-button--animation-off .rui-radio-button__dot,
.rui-radio-button--animation-off .rui-radio-button__ring {
    animation-duration: 499ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: both;
}

.rui-radio-button--animation-off .rui-radio-button__ring-motion {
    animation-name: rui-radio-button-ring-off;
}

.rui-radio-button--animation-off .rui-radio-button__ring {
    animation-name: rui-radio-button-pulse-off;
}

.rui-radio-button--animation-off .rui-radio-button__dot {
    animation-name: rui-radio-button-dot-off;
}

@keyframes rui-radio-button-ring-on {
    0% {
        transform: scale(1);
    }
    33.333% {
        transform: scale(0.5);
    }
    36.546% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes rui-radio-button-pulse-on {
    0% {
        stroke-width: 2px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    }

    33.333% {
        stroke-width: 18px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    36.546% {
        stroke-width: 2px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    100% {
        stroke-width: 2px;
    }
}

@keyframes rui-radio-button-dot-on {
    0%,
    33.333% {
        transform: scale(0);
    }
    36.546% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes rui-radio-button-ring-off {
    0% {
        transform: scale(1);
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    36.673% {
        transform: scale(0.9);
        animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    }

    39.880% {
        transform: scale(0.5);
        animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes rui-radio-button-pulse-off {
    0% {
        stroke-width: 2px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    36.673% {
        stroke-width: 2px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    }

    39.880% {
        stroke-width: 18px;
        animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    }

    100% {
        stroke-width: 2px;
    }
}

@keyframes rui-radio-button-dot-off {
    0% {
        transform: scale(1);
    }
    36.673% {
        transform: scale(1.4);
    }
    39.880%,
    100% {
        transform: scale(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .rui-radio-button__ring-motion,
    .rui-radio-button__ring,
    .rui-radio-button__dot {
        animation-duration: 0ms !important;
    }
}
</style>
