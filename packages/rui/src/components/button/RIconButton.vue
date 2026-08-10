<script setup lang="ts">
import { computed, useAttrs, watchEffect } from "vue"

import { RIcon } from "@/components"
import { vRipple } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RIconButtonProps } from "./types"
import type { RButtonType } from "./types"

import {
    consumeDisabledLinkClick,
    resolveButtonHref,
    resolveButtonRippleOptions,
    resolveDisabledLinkTabIndex,
} from "./shared"

const props = withDefaults(defineProps<RIconButtonProps>(), {
    disabled: false,
    emphasis: "medium",
    type: "button",
    ripple: true,
})

const active = defineModel<boolean>({ default: false })
const attrs = useAttrs()
const emit = defineEmits<{
    (event: "click", value: MouseEvent): void
}>()
let warnedMissingLabel = false

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => resolveButtonHref(props.href, props.disabled))
const resolvedTabIndex = computed(() => resolveDisabledLinkTabIndex(isLink.value, props.disabled))
const resolvedIcon = computed(() => (active.value ? (props.activeIcon ?? props.icon) : props.icon))
const resolvedLabel = computed(() => (active.value ? (props.activeLabel ?? props.label) : props.label))
const resolvedAriaPressed = computed(() => (active.value ? "true" : "false"))
const effectiveEmphasis = computed(() => (props.disabled ? "low" : props.emphasis))
const classes = computed(() => [
    "rui-icon-button",
    `rui-icon-button--emphasis-${effectiveEmphasis.value}`,
    { "rui-icon-button--disabled": props.disabled },
])
const rippleOptions = computed(() => resolveButtonRippleOptions("text", props.ripple, props.disabled))

watchEffect(() => {
    if (!import.meta.env.DEV || warnedMissingLabel || props.label.trim()) {
        return
    }

    warnedMissingLabel = true
    console.warn("[RIconButton] Icon-only buttons require a non-empty `label` for accessibility.")
})

function handleClick(event: MouseEvent) {
    if (consumeDisabledLinkClick(event, isLink.value, props.disabled)) {
        return
    }

    if (!isLink.value) {
        active.value = !active.value
    }

    emit("click", event)
}
</script>

<template>
    <RTouchTargetWrapper class="rui-icon-button__touch-target-wrapper">
        <a
            v-if="isLink"
            v-bind="attrs"
            v-ripple="rippleOptions"
            data-rui-touch-target-anchor
            :class="classes"
            :href="resolvedHref"
            :target="target"
            :rel="rel"
            :aria-label="resolvedLabel"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-pressed="resolvedAriaPressed"
            :tabindex="resolvedTabIndex"
            @click="handleClick"
        >
            <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
            <span class="rui-icon-button__content">
                <RIcon :key="active ? 'active' : 'inactive'" :icon="resolvedIcon" :size="24" :emphasis="effectiveEmphasis" decorative />
            </span>
        </a>

        <button
            v-else
            v-bind="attrs"
            v-ripple="rippleOptions"
            data-rui-touch-target-anchor
            :class="classes"
            :type="nativeType"
            :disabled="disabled"
            :aria-label="resolvedLabel"
            :aria-pressed="resolvedAriaPressed"
            @click="handleClick"
        >
            <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
            <span class="rui-icon-button__content">
                <RIcon :key="active ? 'active' : 'inactive'" :icon="resolvedIcon" :size="24" :emphasis="effectiveEmphasis" decorative />
            </span>
        </button>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/normalize";
@use "@/styles/shape";

.rui-icon-button__touch-target-wrapper {
    @include density.touchTargetEnabled();
    @include density.touchTargetPaddingXY(40px, 40px);

    align-items: center;
    justify-content: center;
    vertical-align: middle;
}

.rui-icon-button {
    --rui-icon-button-density: #{density.$scale};
    --rui-icon-button-size: #{density.withDecrement(40px, --rui-icon-button-density)};
    --rui-icon-button-shape-family: var(--rui-sys-shape-full-family);
    --rui-icon-button-shape-start-start: var(--rui-sys-shape-full-start-start);
    --rui-icon-button-shape-start-end: var(--rui-sys-shape-full-start-end);
    --rui-icon-button-shape-end-end: var(--rui-sys-shape-full-end-end);
    --rui-icon-button-shape-end-start: var(--rui-sys-shape-full-end-start);
    --rui-comp-icon-button-color: var(
        --rui-icon-button-color,
        var(--rui-comp-surface-content-color-medium, #{color.$on-surface-medium})
    );
    --rui-comp-icon-button-color-high: var(
        --rui-icon-button-color,
        var(--rui-comp-surface-content-color-high, #{color.$on-surface-high})
    );
    --rui-comp-icon-button-color-medium: var(
        --rui-icon-button-color,
        var(--rui-comp-surface-content-color-medium, #{color.$on-surface-medium})
    );
    --rui-comp-icon-button-color-low: var(
        --rui-icon-button-color,
        var(--rui-comp-surface-content-color-low, #{color.$on-surface-low})
    );
    --rui-icon-color-high: var(--rui-comp-icon-button-color-high);
    --rui-icon-color-medium: var(--rui-comp-icon-button-color-medium);
    --rui-icon-color-low: var(--rui-comp-icon-button-color-low);

    @include normalize.button;
    @include shape.apply(
        var(--rui-icon-button-shape-family),
        var(--rui-icon-button-shape-start-start),
        var(--rui-icon-button-shape-start-end),
        var(--rui-icon-button-shape-end-end),
        var(--rui-icon-button-shape-end-start)
    );

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--rui-icon-button-size);
    block-size: var(--rui-icon-button-size);
    flex-shrink: 0;
    color: var(--rui-comp-icon-button-color);

    &--emphasis-high {
        --rui-comp-icon-button-color: var(--rui-comp-icon-button-color-high);
    }

    &--emphasis-medium {
        --rui-comp-icon-button-color: var(--rui-comp-icon-button-color-medium);
    }

    &--emphasis-low {
        --rui-comp-icon-button-color: var(--rui-comp-icon-button-color-low);
    }

    &--disabled {
        cursor: default;
        pointer-events: none;
    }
}

.rui-icon-button__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
