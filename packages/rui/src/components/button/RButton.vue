<script setup lang="ts">
import { RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone } from "@ripple-design/icons"
import { computed, inject, onBeforeUnmount, ref, useAttrs, useSlots, watch, watchEffect, type Slots } from "vue"

import { RIcon } from "@/components"
import { createIconFamily } from "@/components/icon/family"
import { vRipple } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RButtonProps, RButtonType, RButtonVariant } from "./types"

import { buttonGroupKey } from "./groupContext"
import {
    consumeDisabledLinkClick,
    resolveButtonHref,
    resolveButtonRippleOptions,
    resolveDisabledLinkTabIndex,
} from "./shared"

const props = withDefaults(defineProps<RButtonProps>(), {
    disabled: false,
    fullWidth: false,
    sentenceCase: false,
    type: "button",
    ripple: true,
})

const attrs = useAttrs()
const slots: Slots = useSlots()
const selectedCheckIcon = createIconFamily(RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone)
const interactiveRef = ref<HTMLElement | null>(null)
const group = inject(buttonGroupKey, null)
const buttonId = Symbol("rButton")
let warnedMissingValue = false
let warnedHref = false

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => resolveButtonHref(props.href, props.disabled))
const selectionMode = computed(() => group?.selection.value)
const isIconGroup = computed(() => group?.icon.value ?? false)
const hasSelectionValue = computed(() => props.value !== undefined)
const isSelectableInGroup = computed(() => selectionMode.value != null && !isLink.value && hasSelectionValue.value)
const selected = computed(() => (isSelectableInGroup.value ? (group?.isSelected(props.value) ?? false) : false))
const resolvedVariant = computed<RButtonVariant>(() => props.variant ?? group?.variant.value ?? "contained")
const iconSize = computed(() => (isIconGroup.value ? 24 : 18))
const rippleOptions = computed(() => resolveButtonRippleOptions(resolvedVariant.value, props.ripple, props.disabled))
const resolvedFullWidth = computed(() => props.fullWidth || group?.fullWidth.value || false)
const hasLabel = computed<boolean>(() => !isIconGroup.value && !!slots.default)
const hasTop = computed<boolean>(() => !isIconGroup.value && (!!props.topIcon || !!slots.top))
const hasOwnLeading = computed<boolean>(() => !!props.icon || !!slots.leading)
const supportsSelectedCheck = computed<boolean>(() => isSelectableInGroup.value && !hasTop.value && hasLabel.value)
const showSelectedCheck = computed<boolean>(() => selected.value && supportsSelectedCheck.value)
const animateSelectedCheckSpacing = computed<boolean>(() => supportsSelectedCheck.value && !hasOwnLeading.value)
const shouldRenderLeading = computed<boolean>(() => hasOwnLeading.value || supportsSelectedCheck.value)
const hasLeading = computed<boolean>(() => hasOwnLeading.value || showSelectedCheck.value)
const hasTrailing = computed<boolean>(() => !isIconGroup.value && (!!props.endIcon || !!slots.trailing))

const wrapperClasses = computed(() => [
    "rui-button__touch-target-wrapper",
    {
        "rui-button__touch-target-wrapper--full-width": resolvedFullWidth.value,
        "rui-button__touch-target-wrapper--with-top": hasTop.value,
    },
])

const classes = computed(() => {
    const variant = resolvedVariant.value

    return [
        "rui-button",
        `rui-button--${variant}`,
        {
            "rui-button--full-width": resolvedFullWidth.value,
            "rui-button--disabled": props.disabled,
            "rui-button--selectable": isSelectableInGroup.value,
            "rui-button--icon-group": isIconGroup.value,
            "rui-button--sentence-case": props.sentenceCase,
            "rui-button--selected": selected.value,
            "rui-button--with-top": hasTop.value,
            "rui-button--with-leading": hasLeading.value,
            "rui-button--with-trailing": hasTrailing.value,
        },
    ]
})

const leadingClasses = computed(() => [
    "rui-button__leading",
    {
        "rui-button__leading--animated-selected-check": animateSelectedCheckSpacing.value,
        "rui-button__leading--animated-selected-check-visible":
            showSelectedCheck.value && animateSelectedCheckSpacing.value,
    },
])

const selectedCheckClasses = computed(() => [
    "rui-button__selected-check",
    {
        "rui-button__selected-check--visible": showSelectedCheck.value,
    },
])

const resolvedRole = computed(() => {
    if (selectionMode.value === "single" && isSelectableInGroup.value) {
        return "radio"
    }

    return undefined
})

const resolvedAriaChecked = computed(() => {
    if (selectionMode.value === "single" && isSelectableInGroup.value) {
        return selected.value ? "true" : "false"
    }

    return undefined
})

const resolvedAriaPressed = computed(() => {
    if (selectionMode.value === "multiple" && isSelectableInGroup.value) {
        return selected.value ? "true" : "false"
    }

    return undefined
})

const resolvedTabIndex = computed(() => {
    const disabledLinkTabIndex = resolveDisabledLinkTabIndex(isLink.value, props.disabled)
    if (disabledLinkTabIndex !== undefined) {
        return disabledLinkTabIndex
    }

    if (selectionMode.value === "single" && isSelectableInGroup.value) {
        return group?.getTabIndex(buttonId)
    }

    return undefined
})

watchEffect(() => {
    if (selectionMode.value != null && props.href != null && !warnedHref) {
        warnedHref = true
        if (import.meta.env.DEV) {
            console.warn("[RButtonGroup] Link buttons are not supported in selectable groups.")
        }
    }

    if (selectionMode.value != null && props.value === undefined && !warnedMissingValue) {
        warnedMissingValue = true
        if (import.meta.env.DEV) {
            console.warn("[RButtonGroup] Selectable groups require every RButton child to provide a unique `value`.")
        }
    }
})

watch(
    [() => props.disabled, () => props.href, () => props.value, hasSelectionValue, interactiveRef, () => group],
    ([disabled, href, value, hasValue, element, nextGroup]) => {
        if (!nextGroup) {
            return
        }

        nextGroup.registerItem(buttonId, {
            disabled,
            element,
            hasValue,
            href,
            value,
        })
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    group?.unregisterItem(buttonId)
})

function handleClick(event: MouseEvent) {
    if (consumeDisabledLinkClick(event, isLink.value, props.disabled)) {
        return
    }

    if (selectionMode.value === "single" && selected.value && group?.required.value) {
        event.preventDefault()
        return
    }

    if (isSelectableInGroup.value) {
        group?.activate(buttonId)
    }
}
</script>

<template>
    <RTouchTargetWrapper :class="wrapperClasses">
        <a
            v-if="isLink"
            ref="interactiveRef"
            v-bind="attrs"
            v-ripple="rippleOptions"
            :class="classes"
            :href="resolvedHref"
            :target="target"
            :rel="rel"
            :role="resolvedRole"
            :aria-checked="resolvedAriaChecked"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-pressed="resolvedAriaPressed"
            :tabindex="resolvedTabIndex"
            @click="handleClick"
        >
            <span
                class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                aria-hidden="true"
            />

            <span class="rui-button__content">
                <span v-if="hasTop" class="rui-button__top">
                    <slot v-if="$slots.top" name="top" />
                    <RIcon v-else-if="topIcon" :icon="topIcon" :size="iconSize" decorative />
                </span>

                <span class="rui-button__main">
                    <span v-if="shouldRenderLeading" :class="leadingClasses">
                        <RIcon
                            v-if="showSelectedCheck || animateSelectedCheckSpacing"
                            :icon="selectedCheckIcon"
                            :size="iconSize"
                            decorative
                            :class="selectedCheckClasses"
                        />
                        <slot v-else-if="$slots.leading" name="leading" />
                        <RIcon v-else-if="icon" :icon="icon" :size="iconSize" decorative />
                    </span>

                    <span class="rui-button__label" v-if="hasLabel">
                        <slot />
                    </span>

                    <span v-if="hasTrailing" class="rui-button__trailing">
                        <slot v-if="$slots.trailing" name="trailing" />
                        <RIcon v-else-if="endIcon" :icon="endIcon" :size="iconSize" decorative />
                    </span>
                </span>
            </span>
        </a>

        <button
            v-else
            ref="interactiveRef"
            v-bind="attrs"
            v-ripple="rippleOptions"
            :class="classes"
            :type="nativeType"
            :disabled="disabled"
            :role="resolvedRole"
            :aria-checked="resolvedAriaChecked"
            :aria-pressed="resolvedAriaPressed"
            :tabindex="resolvedTabIndex"
            @click="handleClick"
        >
            <span
                class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                aria-hidden="true"
            />

            <span class="rui-button__content">
                <span v-if="hasTop" class="rui-button__top">
                    <slot v-if="$slots.top" name="top" />
                    <RIcon v-else-if="topIcon" :icon="topIcon" :size="iconSize" decorative />
                </span>

                <span class="rui-button__main">
                    <span v-if="shouldRenderLeading" :class="leadingClasses">
                        <RIcon
                            v-if="showSelectedCheck || animateSelectedCheckSpacing"
                            :icon="selectedCheckIcon"
                            :size="iconSize"
                            decorative
                            :class="selectedCheckClasses"
                        />
                        <slot v-else-if="$slots.leading" name="leading" />
                        <RIcon v-else-if="icon" :icon="icon" :size="iconSize" decorative />
                    </span>

                    <span class="rui-button__label" v-if="hasLabel">
                        <slot />
                    </span>

                    <span v-if="hasTrailing" class="rui-button__trailing">
                        <slot v-if="$slots.trailing" name="trailing" />
                        <RIcon v-else-if="endIcon" :icon="endIcon" :size="iconSize" decorative />
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
@use "@/styles/motion";
@use "@/styles/normalize";
@use "@/styles/shape";
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
    --rui-button-shape-family: var(--rui-sys-shape-small-family);
    --rui-button-shape-start-start: var(--rui-sys-shape-small-start-start);
    --rui-button-shape-start-end: var(--rui-sys-shape-small-start-end);
    --rui-button-shape-end-end: var(--rui-sys-shape-small-end-end);
    --rui-button-shape-end-start: var(--rui-sys-shape-small-end-start);
    --rui-button-color: #{color.$primary};
    --rui-button-outline-color: #{color.$on-surface-outline};
    --rui-button-disabled-container-color: #{color.$on-surface-outline};
    --rui-button-contained-elevation: #{elevations.shadow(2)};
    --rui-button-contained-hover-elevation: #{elevations.shadow(4)};
    --rui-button-contained-focus-elevation: #{elevations.shadow(4)};
    --rui-button-contained-pressed-elevation: #{elevations.shadow(8)};

    @include normalize.button;
    @include typography.button("--rui-comp-button-label");
    @include shape.apply(
        var(--rui-button-shape-family),
        var(--rui-button-shape-start-start),
        var(--rui-button-shape-start-end),
        var(--rui-button-shape-end-end),
        var(--rui-button-shape-end-start)
    );

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--rui-button-height);
    min-width: 64px;
    box-sizing: border-box;
    padding-inline-start: var(--rui-button-padding-inline-start);
    padding-inline-end: var(--rui-button-padding-inline-end);
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
        color: var(--rui-button-color);
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

    &--icon-group {
        --rui-button-padding-inline-start: 0;
        --rui-button-padding-inline-end: 0;
        --rui-button-gap: 0;
        --rui-button-vertical-gap: 0;

        min-width: 48px;
        width: 48px;
    }

    &--icon-group#{&}--with-leading,
    &--icon-group#{&}--with-trailing,
    &--icon-group#{&}--with-top {
        --rui-button-padding-inline-start: 0;
        --rui-button-padding-inline-end: 0;
    }

    &--icon-group#{&}--text,
    &--icon-group#{&}--outlined,
    &--icon-group#{&}--contained,
    &--icon-group#{&}--unelevated {
        gap: 0;
    }

    &--icon-group .rui-button__content,
    &--icon-group .rui-button__main {
        gap: 0;
    }

    &--selectable#{&}--text:not(#{&}--selected),
    &--selectable#{&}--outlined:not(#{&}--selected) {
        color: color.$on-surface-medium;
    }

    &--outlined {
        color: var(--rui-button-color);
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

    &--selected#{&}--text,
    &--selected#{&}--outlined {
        background-color: rgba(from #{color.$primary} r g b / 0.12);
        color: color.$primary;
    }

    &--selected#{&}--outlined {
        --rui-button-outline-color: #{color.$primary};
    }

    &--selected#{&}--contained {
        box-shadow: #{elevations.shadow(8)};
    }

    &--selected#{&}--unelevated {
        box-shadow: inset 0 0 0 9999px rgb(from #{color.$on-primary} r g b / 0.08);
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

.rui-button__leading--animated-selected-check {
    inline-size: 0;
    margin-inline-end: calc(var(--rui-button-gap) * -1);
    overflow: hidden;
    //transition:
    //    inline-size #{motion.$duration-small-in} #{motion.$easing-standard},
    //    margin-inline-end #{motion.$duration-small-in} #{motion.$easing-standard};

    &.rui-button__leading--animated-selected-check-visible {
        inline-size: 18px;
        margin-inline-end: 0;
    }
}

.rui-button__selected-check {
    opacity: 0;
    transform: scale(0.8);
    //transition:
    //    opacity #{motion.$duration-small-in} #{motion.$easing-standard},
    //    transform #{motion.$duration-small-in} #{motion.$easing-standard}; // TODO: even shorter

    &--visible {
        opacity: 1;
        transform: scale(1);
    }
}

.rui-button__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
