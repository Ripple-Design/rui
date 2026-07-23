<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RButtonProps, RButtonType, RButtonVariant } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RButtonProps>(), {
    variant: "text",
    disabled: false,
    fullWidth: false,
    type: "button",
    ripple: true,
})

const attrs = useAttrs()
const slots = useSlots()

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => (props.disabled ? undefined : props.href))
const hasLeading = computed(() => !!slots.leading)
const hasTrailing = computed(() => !!slots.trailing)

const rippleOptions = computed<RippleOptions>(() => {
    const defaultContrast = props.variant === "contained" ? "high" : "low"

    if (props.ripple === false) {
        return { disabled: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return {
            disabled: props.disabled,
            contrast: defaultContrast,
        }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? defaultContrast,
        disabled: props.disabled || !!props.ripple.disabled,
    }
})

const classes = computed(() => {
    const variant = props.variant as RButtonVariant

    return [
        "rui-button",
        `rui-button--${variant}`,
        {
            "rui-button--full-width": props.fullWidth,
            "rui-button--disabled": props.disabled,
            "rui-button--with-leading": hasLeading.value,
            "rui-button--with-trailing": hasTrailing.value,
        },
    ]
})

function handleClick(event: MouseEvent) {
    if (isLink.value && props.disabled) {
        event.preventDefault()
        event.stopImmediatePropagation()
    }
}
</script>

<template>
    <a
        v-if="isLink"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        :href="resolvedHref"
        :target="target"
        :rel="rel"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled ? -1 : undefined"
        @click="handleClick"
    >
        <span class="rui-touch-target" aria-hidden="true" />

        <span class="rui-button__content">
            <span v-if="$slots.leading" class="rui-button__leading">
                <slot name="leading" />
            </span>

            <span class="rui-button__label">
                <slot />
            </span>

            <span v-if="$slots.trailing" class="rui-button__trailing">
                <slot name="trailing" />
            </span>
        </span>
    </a>

    <button
        v-else
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        :type="nativeType"
        :disabled="disabled"
        @click="handleClick"
    >
        <span class="rui-touch-target" aria-hidden="true" />

        <span class="rui-button__content">
            <span v-if="$slots.leading" class="rui-button__leading">
                <slot name="leading" />
            </span>

            <span class="rui-button__label">
                <slot />
            </span>

            <span v-if="$slots.trailing" class="rui-button__trailing">
                <slot name="trailing" />
            </span>
        </span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/motion";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-button {
    --rui-button-height: 36px;
    --rui-button-padding-inline: 16px;
    --rui-button-gap: 8px;
    --rui-button-radius: 4px;
    --rui-button-outline-color: #{color.$on-surface-low};

    @include normalize.button;
    @include typography.subtitle1("--rui-comp-button-label");
    @include density.touchTargetEnabled();
    @include density.touchTargetMarginY(36px);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--rui-button-height);
    overflow: hidden;
    padding-inline: var(--rui-button-padding-inline);
    border: 1px solid transparent;
    border-radius: var(--rui-button-radius);
    vertical-align: middle;

    &--full-width {
        display: flex;
        width: 100%;
    }

    &--text,
    &--outlined {
        background-color: transparent;
        color: color.$primary;
    }

    &--outlined {
        border-color: var(--rui-button-outline-color);
    }

    &--contained {
        background-color: color.$primary;
        color: color.$on-primary;
    }

    &--disabled {
        cursor: default;
        color: color.$on-surface-low;
        pointer-events: none;
    }

    &--disabled.rui-button--text,
    &--disabled.rui-button--outlined {
        background-color: transparent;
    }

    &--disabled.rui-button--outlined {
        border-color: color.$on-surface-low;
    }

    &--disabled.rui-button--contained {
        border-color: transparent;
        background-color: color.$on-surface-low;
        color: color.$surface;
    }
}

.rui-button__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--rui-button-gap);
    min-height: calc(var(--rui-button-height) - 2px);
}

.rui-button__leading,
.rui-button__trailing {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.rui-button__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
