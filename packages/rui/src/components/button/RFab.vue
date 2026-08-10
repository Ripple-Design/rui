<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from "vue"

import { RIcon } from "@/components"
import { vRipple } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RButtonType, RFabProps } from "./types"

import {
    consumeDisabledLinkClick,
    resolveButtonHref,
    resolveButtonRippleOptions,
    resolveDisabledLinkTabIndex,
} from "./shared"

const props = withDefaults(defineProps<RFabProps>(), {
    variant: "standard",
    size: "normal",
    visible: true,
    extended: true,
    disabled: false,
    type: "button",
    ripple: true,
})

const emit = defineEmits<{
    expanded: []
    collapsed: []
}>()

const attrs = useAttrs()
const slots = useSlots()
const interactiveRef = ref<HTMLElement | null>(null)

const isLink = computed(() => !!props.href)
const nativeType = computed<RButtonType>(() => props.type ?? "button")
const resolvedHref = computed(() => resolveButtonHref(props.href, props.disabled))
const resolvedTabIndex = computed(() => resolveDisabledLinkTabIndex(isLink.value, props.disabled))
const isExtended = computed(() => props.variant === "extended")
const hasLabel = computed(() => isExtended.value && !!slots.default)
const isCollapsed = computed(() => isExtended.value && !props.extended && !!props.icon)
const resolvedAriaLabel = computed(() => (hasLabel.value && !isCollapsed.value ? undefined : props.label))
const rippleOptions = computed(() => resolveButtonRippleOptions("contained", props.ripple, props.disabled))
const classes = computed(() => [
    "rui-fab",
    `rui-fab--${props.variant}`,
    `rui-fab--${props.size}`,
    {
        "rui-fab--disabled": props.disabled,
        "rui-fab--with-icon": !!props.icon,
        "rui-fab--with-label": hasLabel.value,
        "rui-fab--collapsed": isCollapsed.value,
    },
])
const wrapperClasses = computed(() => [
    "rui-fab__touch-target-wrapper",
    {
        "rui-fab__touch-target-wrapper--mini": !isExtended.value && props.size === "mini",
    },
])
const visibilityClasses = computed(() => [
    "rui-fab__visibility",
    {
        "rui-fab__visibility--extended": isExtended.value,
        "rui-fab__visibility--visible": props.visible,
    },
])

function handleClick(event: MouseEvent) {
    consumeDisabledLinkClick(event, isLink.value, props.disabled)
}

function handleSizeTransitionEnd(event: TransitionEvent) {
    if (event.target !== interactiveRef.value || !["inline-size", "width"].includes(event.propertyName)) {
        return
    }

    if (isCollapsed.value) {
        emit("collapsed")
        return
    }

    emit("expanded")
}
</script>

<template>
    <span :class="visibilityClasses">
        <RTouchTargetWrapper :class="wrapperClasses">
            <a
                v-if="isLink"
                ref="interactiveRef"
                v-bind="attrs"
                v-ripple="rippleOptions"
                data-rui-touch-target-anchor
                :class="classes"
                :href="resolvedHref"
                :target="target"
                :rel="rel"
                :aria-label="resolvedAriaLabel"
                :aria-disabled="disabled ? 'true' : undefined"
                :tabindex="resolvedTabIndex"
                @click="handleClick"
                @transitionend="handleSizeTransitionEnd"
            >
                <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
                <span class="rui-fab__content">
                    <span v-if="icon" class="rui-fab__icon">
                        <RIcon :icon="icon" :size="24" emphasis="inherit" decorative />
                    </span>
                    <span v-if="hasLabel" class="rui-fab__label" :aria-hidden="isCollapsed ? 'true' : undefined">
                        <slot />
                    </span>
                </span>
            </a>

            <button
                v-else
                ref="interactiveRef"
                v-bind="attrs"
                v-ripple="rippleOptions"
                data-rui-touch-target-anchor
                :class="classes"
                :type="nativeType"
                :disabled="disabled"
                :aria-label="resolvedAriaLabel"
                @click="handleClick"
                @transitionend="handleSizeTransitionEnd"
            >
                <span class="rui-touch-target rui-touch-target--interactive" aria-hidden="true" />
                <span class="rui-fab__content">
                    <span v-if="icon" class="rui-fab__icon">
                        <RIcon :icon="icon" :size="24" emphasis="inherit" decorative />
                    </span>
                    <span v-if="hasLabel" class="rui-fab__label" :aria-hidden="isCollapsed ? 'true' : undefined">
                        <slot />
                    </span>
                </span>
            </button>
        </RTouchTargetWrapper>
    </span>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/elevations";
@use "@/styles/normalize";
@use "@/styles/shape";
@use "@/styles/typography";

.rui-fab__touch-target-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: var(--rui-comp-fab-touch-target-size, 48px);
    min-block-size: var(--rui-comp-fab-touch-target-size, 48px);
    vertical-align: middle;
}

.rui-fab {
    --rui-comp-fab-container-color: #{color.$secondary};
    --rui-comp-fab-content-color: #{color.$on-secondary};
    --rui-comp-fab-disabled-container-color: #{color.$on-surface-outline};
    --rui-comp-fab-disabled-content-color: #{color.$on-surface-low};
    --rui-comp-fab-icon-size: 24px;
    --rui-comp-fab-standard-size: 56px;
    --rui-comp-fab-mini-size: 40px;
    --rui-comp-fab-touch-target-size: 48px;
    --rui-comp-fab-extended-height: 48px;
    --rui-comp-fab-extended-min-width: 120px;
    --rui-comp-fab-extended-padding-block: 12px;
    --rui-comp-fab-extended-padding-inline: 20px;
    --rui-comp-fab-extended-icon-padding-start: 12px;
    --rui-comp-fab-extended-icon-padding-end: 20px;
    --rui-comp-fab-extended-icon-gap: 12px;
    --rui-comp-fab-shape-family: var(--rui-sys-shape-full-family);
    --rui-comp-fab-shape-start-start: var(--rui-sys-shape-full-start-start);
    --rui-comp-fab-shape-start-end: var(--rui-sys-shape-full-start-end);
    --rui-comp-fab-shape-end-end: var(--rui-sys-shape-full-end-end);
    --rui-comp-fab-shape-end-start: var(--rui-sys-shape-full-end-start);
    --rui-comp-fab-elevation: #{elevations.shadow(6)};
    --rui-comp-fab-hover-focus-elevation: #{elevations.shadow(8)};
    --rui-comp-fab-pressed-elevation: #{elevations.shadow(12)};

    @include normalize.button;
    @include shape.apply(
        var(--rui-comp-fab-shape-family),
        var(--rui-comp-fab-shape-start-start),
        var(--rui-comp-fab-shape-start-end),
        var(--rui-comp-fab-shape-end-end),
        var(--rui-comp-fab-shape-end-start)
    );

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
    overflow: hidden;
    interpolate-size: allow-keywords;
    background-color: var(--rui-comp-fab-container-color);
    box-shadow: var(--rui-comp-fab-elevation);
    color: var(--rui-comp-fab-content-color);
    transition:
        box-shadow 100ms var(--rui-sys-motion-easing-standard) 100ms,
        inline-size 200ms var(--rui-sys-motion-easing-standard),
        block-size 200ms var(--rui-sys-motion-easing-standard),
        padding 200ms var(--rui-sys-motion-easing-standard);

    &:not(&--disabled):hover,
    &:not(&--disabled):focus-visible {
        box-shadow: var(--rui-comp-fab-hover-focus-elevation);
        transition-delay: 0ms;
    }

    &:not(&--disabled):active {
        box-shadow: var(--rui-comp-fab-pressed-elevation);
        transition-delay: 0ms;
    }

    &--disabled {
        cursor: default;
        pointer-events: none;
        background-color: var(--rui-comp-fab-disabled-container-color);
        box-shadow: none;
        color: var(--rui-comp-fab-disabled-content-color);
    }

    &--standard {
        inline-size: var(--rui-comp-fab-standard-size);
        block-size: var(--rui-comp-fab-standard-size);
    }

    &--mini {
        inline-size: var(--rui-comp-fab-mini-size);
        block-size: var(--rui-comp-fab-mini-size);
    }

    &--extended {
        @include typography.button("--rui-comp-fab-label");

        min-inline-size: var(--rui-comp-fab-extended-min-width);
        block-size: var(--rui-comp-fab-extended-height);
        padding-block: var(--rui-comp-fab-extended-padding-block);
        padding-inline: var(--rui-comp-fab-extended-padding-inline);
        inline-size: auto;
        white-space: nowrap;

        &.rui-fab--with-icon {
            justify-content: flex-start;
            padding-inline-start: var(--rui-comp-fab-extended-icon-padding-start);
            padding-inline-end: var(--rui-comp-fab-extended-icon-padding-end);
        }

        &.rui-fab--collapsed {
            inline-size: var(--rui-comp-fab-standard-size);
            min-inline-size: var(--rui-comp-fab-standard-size);
            block-size: var(--rui-comp-fab-standard-size);
            padding-inline: calc((var(--rui-comp-fab-standard-size) - var(--rui-comp-fab-icon-size)) / 2);
        }
    }
}

.rui-fab__content,
.rui-fab__icon,
.rui-fab__label {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.rui-fab__content {
    min-inline-size: var(--rui-comp-fab-icon-size);
    gap: var(--rui-comp-fab-extended-icon-gap);
}

.rui-fab__icon {
    inline-size: var(--rui-comp-fab-icon-size);
    block-size: var(--rui-comp-fab-icon-size);
    flex: 0 0 var(--rui-comp-fab-icon-size);
}

.rui-fab__label {
    overflow: hidden;
    display: inline-flex;
    opacity: 1;
    transition: opacity 33ms var(--rui-sys-motion-easing-standard) 16ms;

    .rui-fab--collapsed & {
        opacity: 0;
        transition-delay: 117ms;
        transition-duration: 83ms;
    }
}

.rui-fab__visibility {
    display: none;
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
    transition:
        display 0s linear 180ms,
        opacity 15ms var(--rui-sys-motion-easing-linear) 150ms,
        transform 135ms var(--rui-sys-motion-easing-accelerated);
    transition-behavior: allow-discrete;

    &--extended {
        transform: scale(0.8);
        transition:
            display 0s linear 75ms,
            opacity 75ms var(--rui-sys-motion-easing-linear),
            transform 0s linear 75ms;
    }

    &--visible {
        display: inline-flex;
        transform: scale(1);
        opacity: 1;
        pointer-events: auto;
        transition:
            display 0s linear 0ms,
            opacity 15ms var(--rui-sys-motion-easing-linear) 30ms,
            transform 330ms var(--rui-sys-motion-easing-decelerated);

        @starting-style {
            transform: scale(0.4);
        }

        &.rui-fab__visibility--extended {
            transition:
                display 0s linear 0ms,
                opacity 150ms var(--rui-sys-motion-easing-standard),
                transform 150ms var(--rui-sys-motion-easing-decelerated);
        }
    }
}

.rui-fab__visibility:not(.rui-fab__visibility--extended) .rui-fab__icon {
    transform: scale(0);
    transition: transform 180ms var(--rui-sys-motion-easing-accelerated);
}

.rui-fab__visibility--visible:not(.rui-fab__visibility--extended) .rui-fab__icon {
    transform: scale(1);
    transition: transform 240ms var(--rui-sys-motion-easing-decelerated) 90ms;

    @starting-style {
        transform: scale(0.4);
    }
}

@media (max-width: 469.98px) and (max-height: 469.98px) {
    .rui-fab--standard.rui-fab--auto {
        inline-size: var(--rui-comp-fab-mini-size);
        block-size: var(--rui-comp-fab-mini-size);
    }
}

@media (prefers-reduced-motion: reduce) {
    .rui-fab,
    .rui-fab__label,
    .rui-fab__visibility,
    .rui-fab__icon {
        transition-duration: 0ms !important;
    }
}
</style>
