<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue"

import { RIcon } from "@/components"
import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RButtonProps, RButtonType, RButtonVariant } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RButtonProps>(), {
    variant: "contained",
    disabled: false,
    fullWidth: false,
    sentenceCase: false,
    type: "button",
    ripple: true,
})

const attrs = useAttrs()
const slots = useSlots()

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => (props.disabled ? undefined : props.href))
const hasTop = computed(() => !!props.topIcon || !!slots.top)
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

const wrapperClasses = computed(() => [
    "rui-button__touch-target-wrapper",
    {
        "rui-button__touch-target-wrapper--full-width": props.fullWidth,
        "rui-button__touch-target-wrapper--with-top": hasTop.value,
    },
])

const classes = computed(() => {
    const variant = props.variant as RButtonVariant

    return [
        "rui-button",
        `rui-button--${variant}`,
        {
            "rui-button--full-width": props.fullWidth,
            "rui-button--disabled": props.disabled,
            "rui-button--sentence-case": props.sentenceCase,
            "rui-button--with-top": hasTop.value,
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
    <RTouchTargetWrapper :class="wrapperClasses">
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
            <span
                class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                aria-hidden="true"
            />

            <span class="rui-button__content">
                <span v-if="hasTop" class="rui-button__top">
                    <slot v-if="$slots.top" name="top" />
                    <RIcon v-else-if="topIcon" :icon="topIcon" :size="18" decorative />
                </span>

                <span class="rui-button__main">
                    <span v-if="hasLeading" class="rui-button__leading">
                        <slot v-if="$slots.leading" name="leading" />
                        <RIcon v-else-if="icon" :icon="icon" :size="18" decorative />
                    </span>

                    <span class="rui-button__label">
                        <slot />
                    </span>

                    <span v-if="hasTrailing" class="rui-button__trailing">
                        <slot v-if="$slots.trailing" name="trailing" />
                        <RIcon v-else-if="endIcon" :icon="endIcon" :size="18" decorative />
                    </span>
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
            <span
                class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                aria-hidden="true"
            />

            <span class="rui-button__content">
                <span v-if="hasTop" class="rui-button__top">
                    <slot v-if="$slots.top" name="top" />
                    <RIcon v-else-if="topIcon" :icon="topIcon" :size="18" decorative />
                </span>

                <span class="rui-button__main">
                    <span v-if="hasLeading" class="rui-button__leading">
                        <slot v-if="$slots.leading" name="leading" />
                        <RIcon v-else-if="icon" :icon="icon" :size="18" decorative />
                    </span>

                    <span class="rui-button__label">
                        <slot />
                    </span>

                    <span v-if="hasTrailing" class="rui-button__trailing">
                        <slot v-if="$slots.trailing" name="trailing" />
                        <RIcon v-else-if="endIcon" :icon="endIcon" :size="18" decorative />
                    </span>
                </span>
            </span>
        </button>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/elevations";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-button__touch-target-wrapper {
    @include density.touchTargetEnabled();

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-top: calc(6px * var(--rui-touch-target-enabled, 1));
    padding-bottom: calc(6px * var(--rui-touch-target-enabled, 1));
    vertical-align: middle;

    &--full-width {
        display: flex;
        width: 100%;
    }

    &--with-top {
        padding-top: 0;
        padding-bottom: 0;
    }
}

.rui-button {
    --rui-button-density: #{density.$scale};
    --rui-button-height: #{density.withDecrement(36px, --rui-button-density)};
    --rui-button-vertical-gap: 4px;
    --rui-button-padding-inline-start: 16px;
    --rui-button-padding-inline-end: 16px;
    --rui-button-gap: 8px;
    --rui-button-radius: 4px;
    --rui-button-outline-color: rgba(from #{color.$on-surface} r g b / 0.12);
    --rui-button-disabled-container-color: rgba(from #{color.$on-surface} r g b / 0.12);
    --rui-button-contained-elevation: #{elevations.shadow(2)};
    --rui-button-contained-hover-elevation: #{elevations.shadow(4)};
    --rui-button-contained-focus-elevation: #{elevations.shadow(4)};
    --rui-button-contained-pressed-elevation: #{elevations.shadow(8)};

    @include normalize.button;
    @include typography.button("--rui-comp-button-label");

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--rui-button-height);
    min-width: 64px;
    box-sizing: border-box;
    padding-inline-start: var(--rui-button-padding-inline-start);
    padding-inline-end: var(--rui-button-padding-inline-end);
    border-radius: var(--rui-button-radius);
    transition: #{elevations.transitionValue()};

    &--full-width {
        display: flex;
        width: 100%;
    }

    &--with-top {
        --rui-button-height: #{density.withDecrement(56px, --rui-button-density)};
    }

    &--sentence-case {
        --rui-comp-button-label-text-transform: none;
        letter-spacing: var(--rui-sys-typo-body2-letter-spacing);
    }

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

    &--text#{&}--with-top {
        --rui-button-padding-inline-start: 8px;
        --rui-button-padding-inline-end: 8px;
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

    &--outlined#{&}--with-top,
    &--contained#{&}--with-top,
    &--unelevated#{&}--with-top {
        --rui-button-padding-inline-start: 16px;
        --rui-button-padding-inline-end: 16px;
    }

    &--text,
    &--outlined {
        background-color: transparent;
        color: color.$primary;
    }

    &--outlined {
        outline: 1px solid var(--rui-button-outline-color);
        outline-offset: -1px;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--rui-button-vertical-gap);
    min-height: calc(var(--rui-button-height) - 2px);
}

.rui-button__main {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--rui-button-gap);
}

.rui-button__top,
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
