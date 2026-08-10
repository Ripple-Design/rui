<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import RIcon from "@/components/icon/RIcon.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import { bottomNavigationKey } from "./context"
import type { RBottomNavigationItemProps } from "./types"

const props = withDefaults(defineProps<RBottomNavigationItemProps>(), {
    ripple: true,
})

const attrs = useAttrs()
const navigation = inject(bottomNavigationKey, null)
const itemId = Symbol("bottomNavigationItem")
const interactiveRef = ref<HTMLButtonElement | null>(null)

const selected = computed(() => navigation?.isSelected(props.value) ?? false)
const selectedIconSource = computed(() => (selected.value && props.selectedIcon ? props.selectedIcon : props.icon))
const rippleOptions = computed<RippleOptions>(() => {
    const disabled = !!attrs.disabled

    if (props.ripple === false) {
        return { disabled: true, unbounded: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return { contrast: "low", disabled, unbounded: true }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? "low",
        disabled: disabled || !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? true,
    }
})
const classes = computed(() => [
    "rui-bottom-navigation-item",
    {
        "rui-bottom-navigation-item--selected": selected.value,
        "rui-bottom-navigation-item--on-primary": navigation?.color.value === "primary",
        "rui-bottom-navigation-item--transitions-enabled": navigation?.transitionsEnabled.value,
        "rui-bottom-navigation-item--labeled": navigation?.labelVisibility.value === "labeled",
        "rui-bottom-navigation-item--selected-label": navigation?.labelVisibility.value === "selected",
        "rui-bottom-navigation-item--shifting": navigation?.labelVisibility.value === "selected" && navigation.horizontalTranslation.value,
        "rui-bottom-navigation-item--unlabeled": navigation?.labelVisibility.value === "unlabeled",
    },
])

watch(
    [() => props.value, () => attrs.disabled, interactiveRef, () => navigation],
    ([value, disabled, element, nextNavigation]) => {
        nextNavigation?.registerItem(itemId, { disabled: !!disabled, element, value })
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    navigation?.unregisterItem(itemId)
})

function handleClick() {
    navigation?.activate(itemId)
}
</script>

<template>
    <button
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        type="button"
        :aria-current="selected ? 'page' : undefined"
        @click="handleClick"
    >
        <span class="rui-bottom-navigation-item__icon">
            <RIcon v-if="selectedIconSource" :icon="selectedIconSource" :size="24" emphasis="inherit" decorative />
        </span>
        <span
            class="rui-bottom-navigation-item__label"
            :class="{ 'rui-bottom-navigation-item__label--hidden': navigation?.labelVisibility.value === 'unlabeled' || (navigation?.labelVisibility.value === 'selected' && !selected) }"
            aria-hidden="true"
        >
            <slot />
        </span>
        <span class="rui-bottom-navigation-item__accessible-label"><slot /></span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/motion";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-bottom-navigation-item {
    --rui-comp-bottom-navigation-item-active-color: var(--rui-sys-color-primary);
    --rui-comp-bottom-navigation-item-inactive-color: var(--rui-sys-color-on-surface-medium);
    --rui-comp-bottom-navigation-item-label-size: var(--rui-sys-typo-caption-size);
    --rui-comp-bottom-navigation-item-label-weight: var(--rui-sys-typo-caption-weight);
    --rui-comp-bottom-navigation-item-label-font-family: var(--rui-sys-typo-caption-font-family);
    --rui-comp-bottom-navigation-item-label-line-height: var(--rui-sys-typo-caption-line-height);
    --rui-comp-bottom-navigation-item-label-letter-spacing: var(--rui-sys-typo-caption-letter-spacing);

    @include normalize.button;

    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    inline-size: var(--rui-comp-bottom-navigation-item-inline-size, 100%);
    min-inline-size: 0;
    block-size: 56px;
    flex: 0 0 var(--rui-comp-bottom-navigation-item-inline-size, 100%);
    padding-block-start: 8px;
    overflow-x: visible;
    overflow-y: clip;
    color: var(--rui-comp-bottom-navigation-item-inactive-color);
    background: transparent;
    text-align: center;
    transition:
        padding-block-start motion.$duration-small-in motion.$easing-standard,
        flex-basis var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        inline-size var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        color motion.$duration-small-in motion.$easing-standard;

    &--on-primary {
        --rui-comp-bottom-navigation-item-active-color: var(--rui-comp-surface-content-color);
        --rui-comp-bottom-navigation-item-inactive-color: var(--rui-comp-surface-content-color-medium);
    }

    &--selected {
        color: var(--rui-comp-bottom-navigation-item-active-color);
    }

    &:disabled {
        color: var(--rui-comp-surface-content-color-low);
        cursor: default;
    }
}

.rui-bottom-navigation-item__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 24px;
    block-size: 24px;
    color: currentColor;
}

.rui-bottom-navigation-item__label {
    @include typography.caption("--rui-comp-bottom-navigation-item-label");
    @include typography.overflowEllipsis;

    display: block;
    max-inline-size: calc(100% - 16px);
    margin-block-start: 4px;
    color: currentColor;
    text-align: center;
    transition:
        opacity motion.$duration-small-in motion.$easing-standard,
        display motion.$duration-small-in allow-discrete;

    &--hidden {
        display: none;
        opacity: 0;
    }
}

.rui-bottom-navigation-item--selected-label:not(.rui-bottom-navigation-item--selected) {
    padding-block-start: 16px;
}

.rui-bottom-navigation-item--unlabeled {
    padding-block-start: 16px;
}

.rui-bottom-navigation-item__accessible-label {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
}
.rui-bottom-navigation-item--shifting {
    transition:
        padding-block-start var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        flex-basis var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        inline-size var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        color motion.$duration-small-in motion.$easing-standard;
}

.rui-bottom-navigation-item--shifting .rui-bottom-navigation-item__label {
    transition:
        opacity var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        transform var(--rui-sys-motion-duration-large-in) var(--rui-sys-motion-easing-standard),
        display var(--rui-sys-motion-duration-large-in) allow-discrete;
}

.rui-bottom-navigation-item--shifting .rui-bottom-navigation-item__label--hidden {
    transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
    .rui-bottom-navigation-item,
    .rui-bottom-navigation-item__label {
        transition-duration: 0ms;
    }
}
</style>
