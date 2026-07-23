<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue"

import { RIcon } from "@/components"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RButtonProps, RButtonType, RButtonVariant } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RButtonProps>(), {
    variant: "contained",
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
const hasLeading = computed(() => !!props.icon || !!slots.leading)
const hasTrailing = computed(() => !!props.endIcon || !!slots.trailing)

const rippleOptions = computed<RippleOptions>(() => {
    const defaultContrast = ["contained", "unelevated"].includes(props.variant) ? "high" : "low"

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
            <span v-if="hasLeading" class="rui-button__leading">
                <RIcon v-if="icon" :icon="icon" :size="18" decorative />
                <slot v-else name="leading" />
            </span>

            <span class="rui-button__label">
                <slot />
            </span>

            <span v-if="hasTrailing" class="rui-button__trailing">
                <RIcon v-if="endIcon" :icon="endIcon" :size="18" decorative />
                <slot v-else name="trailing" />
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
            <span v-if="hasLeading" class="rui-button__leading">
                <RIcon v-if="icon" :icon="icon" :size="18" decorative />
                <slot v-else name="leading" />
            </span>

            <span class="rui-button__label">
                <slot />
            </span>

            <span v-if="hasTrailing" class="rui-button__trailing">
                <RIcon v-if="endIcon" :icon="endIcon" :size="18" decorative />
                <slot v-else name="trailing" />
            </span>
        </span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/elevations";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-button {
    --rui-button-height: 36px;
    --rui-button-padding-inline-start: 16px;
    --rui-button-padding-inline-end: 16px;
    --rui-button-gap: 8px;
    --rui-button-radius: 4px;
    --rui-button-outline-color: rgb(from #{color.$on-surface} r g b / 0.12);
    --rui-button-disabled-container-color: rgb(from #{color.$on-surface} r g b / 0.12);
    --rui-button-contained-elevation: #{elevations.shadow(2)};
    --rui-button-contained-hover-elevation: #{elevations.shadow(4)};
    --rui-button-contained-focus-elevation: #{elevations.shadow(4)};
    --rui-button-contained-pressed-elevation: #{elevations.shadow(8)};

    @include normalize.button;
    @include typography.button("--rui-comp-button-label");
    @include density.touchTargetEnabled();
    @include density.touchTargetMarginY(36px);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--rui-button-height);
    min-width: 64px;
    box-sizing: border-box;
    overflow: hidden;
    padding-inline-start: var(--rui-button-padding-inline-start);
    padding-inline-end: var(--rui-button-padding-inline-end);
    border-radius: var(--rui-button-radius);
    transition: #{elevations.transitionValue()};

    &--text {
        --rui-button-padding-inline-start: 8px;
        --rui-button-padding-inline-end: 8px;
    }

    &--text#{&}--with-leading {
        --rui-button-padding-inline-start: 4px;
    }

    &--text#{&}--with-trailing {
        --rui-button-padding-inline-end: 4px;
    }

    &--outlined#{&}--with-leading,
    &--contained#{&}--with-leading,
    &--unelevated#{&}--with-leading {
        --rui-button-padding-inline-start: 12px;
    }

    &--outlined#{&}--with-trailing,
    &--contained#{&}--with-trailing,
    &--unelevated#{&}--with-trailing {
        --rui-button-padding-inline-end: 12px;
    }

    &--text,
    &--outlined {
        background-color: transparent;
        color: color.$primary;
    }

    &--outlined {
        border: 1px solid var(--rui-button-outline-color);
    }

    &--contained,
    &--unelevated {
        background-color: color.$primary;
        color: color.$on-primary;
    }

    &--contained {
        box-shadow: var(--rui-button-contained-elevation);

        &:hover {
            box-shadow: var(--rui-button-contained-hover-elevation);
        }

        &:focus-visible {
            box-shadow: var(--rui-button-contained-focus-elevation);
        }

        &:active {
            box-shadow: var(--rui-button-contained-pressed-elevation);
        }
    }

    &--unelevated {
        box-shadow: none;
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
        border-color: var(--rui-button-disabled-container-color);
    }

    &--disabled.rui-button--contained,
    &--disabled.rui-button--unelevated {
        box-shadow: none;
        background-color: var(--rui-button-disabled-container-color);
        color: color.$on-surface-low;
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
