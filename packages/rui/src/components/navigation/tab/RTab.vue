<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { selectionModelKey } from "@/foundations/selection"

import type { RTabProps } from "./types.ts"

import RIcon from "../../base/icon/RIcon.vue"
import { tabBarKey } from "./context.ts"

const props = withDefaults(defineProps<RTabProps>(), {
    ripple: true,
})

const attrs = useAttrs()
const group = inject(selectionModelKey, null)
const tabBar = inject(tabBarKey, null)
const tabId = Symbol("rTab")
const interactiveRef = ref<HTMLElement | null>(null)

const selected = computed(() => (group ? group.isSelected(props.value) : false))
const hasIcon = computed(() => props.icon != null)
const resolvedHref = computed(() => {
    if (typeof props.href === "string") {
        return props.href
    }

    return typeof attrs.href === "string" ? attrs.href : undefined
})
const resolvedTarget = computed(() => {
    if (typeof props.target === "string") {
        return props.target
    }

    return typeof attrs.target === "string" ? attrs.target : undefined
})
const resolvedRel = computed(() => {
    if (typeof props.rel === "string") {
        return props.rel
    }

    return typeof attrs.rel === "string" ? attrs.rel : undefined
})
const isLink = computed(() => resolvedHref.value != null)
const resolvedColor = computed(() => tabBar?.color.value ?? "primary")
const resolvedIconLayout = computed(() => props.iconLayout ?? tabBar?.iconLayout.value ?? "vertical")
const rippleOptions = computed<RippleOptions>(() => {
    const defaultContrast = ["on-primary", "on-secondary"].includes(resolvedColor.value) ? "high" : "low"

    if (props.ripple === false) {
        return { disabled: true, unbounded: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return {
            disabled: false,
            contrast: defaultContrast,
            unbounded: true,
        }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? defaultContrast,
        disabled: !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? true,
    }
})
const classes = computed(() => {
    const iconLayout = resolvedIconLayout.value

    return [
        "rui-tab",
        {
            "rui-tab--selected": selected.value,
            "rui-tab--icon-horizontal": hasIcon.value && iconLayout === "horizontal",
            "rui-tab--icon-vertical": hasIcon.value && iconLayout !== "horizontal",
        },
    ]
})

watch(
    [() => props.value, interactiveRef, () => group],
    ([value, element, nextGroup]) => {
        nextGroup?.registerItem(tabId, { disabled: false, element, value })
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    group?.unregisterItem(tabId)
})

function handleClick() {
    if (isLink.value) {
        return
    }

    group?.activate(tabId)
}
</script>

<template>
    <a
        v-if="isLink"
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        :href="resolvedHref"
        :target="resolvedTarget"
        :rel="resolvedRel"
        @click="handleClick"
    >
        <span class="rui-tab__content">
            <span v-if="icon" class="rui-tab__icon"
                ><RIcon :icon="icon" :size="24" emphasis="inherit" decorative
            /></span>
            <span class="rui-tab__label"><slot /></span>
        </span>
    </a>

    <button
        v-else
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        type="button"
        @click="handleClick"
    >
        <span class="rui-tab__content">
            <span v-if="icon" class="rui-tab__icon"
                ><RIcon :icon="icon" :size="24" emphasis="inherit" decorative
            /></span>
            <span class="rui-tab__label"><slot /></span>
        </span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-tab {
    --rui-comp-tab-bar-tab-color: var(--rui-comp-tab-bar-color, #{color.$on-surface-medium});
    --rui-comp-tab-bar-tab-selected-color: var(--rui-comp-tab-bar-selected-color, #{color.$primary});

    @include normalize.button;
    display: inline-flex;
    flex-shrink: 0;
    overflow: visible;
    align-items: center;
    justify-content: center;
    min-inline-size: 90px;
    max-inline-size: 360px;
    block-size: 48px;
    padding-inline: 16px;
    padding-block: 0;
    color: var(--rui-comp-tab-bar-tab-color);
    text-decoration: none;

    &--selected {
        color: var(--rui-comp-tab-bar-tab-selected-color);
    }

    &--disabled {
        cursor: default;
        color: var(--rui-comp-tab-bar-color, #{color.$on-surface-medium});
        pointer-events: none;
    }

    &--icon-horizontal .rui-tab__content {
        flex-direction: row;
        gap: 8px;
    }

    &--icon-horizontal .rui-tab__label {
        line-height: 24px;
    }

    &--icon-vertical {
        block-size: 72px;
        align-items: flex-start;
        padding-block-start: 12px;
    }

    &--icon-vertical .rui-tab__content {
        flex-direction: column;
        gap: 0;
    }

    &--icon-vertical .rui-tab__label {
        padding-block-start: calc(20px - 1cap);
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
    }
}

.rui-tab__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-inline-size: 0;
    max-inline-size: 100%;
}

.rui-tab__label {
    @include typography.button("--rui-comp-tab-bar-label");
    overflow-x: clip;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
</style>
