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
    type: "button",
    ripple: true,
    pressed: undefined,
})

const attrs = useAttrs()
let warnedMissingLabel = false

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => resolveButtonHref(props.href, props.disabled))
const resolvedTabIndex = computed(() => resolveDisabledLinkTabIndex(isLink.value, props.disabled))
const resolvedAriaPressed = computed(() => {
    if (props.pressed == null) {
        return undefined
    }

    return props.pressed ? "true" : "false"
})
const rippleOptions = computed(() => resolveButtonRippleOptions("text", props.ripple, props.disabled))

watchEffect(() => {
    if (!import.meta.env.DEV || warnedMissingLabel || props.label.trim()) {
        return
    }

    warnedMissingLabel = true
    console.warn("[RIconButton] Icon-only buttons require a non-empty `label` for accessibility.")
})

function handleClick(event: MouseEvent) {
    consumeDisabledLinkClick(event, isLink.value, props.disabled)
}
</script>

<template>
    <RTouchTargetWrapper class="rui-icon-button__touch-target-wrapper">
        <a
            v-if="isLink"
            v-bind="attrs"
            v-ripple="rippleOptions"
            class="rui-icon-button"
            :class="{ 'rui-icon-button--disabled': disabled }"
            :href="resolvedHref"
            :target="target"
            :rel="rel"
            :aria-label="label"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-pressed="resolvedAriaPressed"
            :tabindex="resolvedTabIndex"
            @click="handleClick"
        >
            <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
            <span class="rui-icon-button__content">
                <RIcon :icon="icon" :size="24" decorative />
            </span>
        </a>

        <button
            v-else
            v-bind="attrs"
            v-ripple="rippleOptions"
            class="rui-icon-button"
            :class="{ 'rui-icon-button--disabled': disabled }"
            :type="nativeType"
            :disabled="disabled"
            :aria-label="label"
            :aria-pressed="resolvedAriaPressed"
            @click="handleClick"
        >
            <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
            <span class="rui-icon-button__content">
                <RIcon :icon="icon" :size="24" decorative />
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
    --rui-icon-button-color: #{color.$on-surface-medium};
    --rui-icon-button-disabled-color: #{color.$on-surface-low};

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
    color: var(--rui-icon-button-color);

    &--disabled {
        cursor: default;
        color: var(--rui-icon-button-disabled-color);
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
