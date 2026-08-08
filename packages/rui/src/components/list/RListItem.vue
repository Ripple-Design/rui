<script setup lang="ts">
import { computed, inject, useAttrs, useSlots } from "vue"

import RIcon from "@/components/icon/RIcon.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import { listKey } from "./context"

import type { RListItemProps, RListItemSlots } from "./types"

const props = withDefaults(defineProps<RListItemProps>(), {
    action: false,
    disabled: false,
    lines: undefined,
    ripple: true,
})
const emit = defineEmits<{
    (e: "click", event: MouseEvent): void
}>()
const attrs = useAttrs()
const slots = useSlots() as RListItemSlots
const list = inject(listKey, null)
const divider = computed(() => list?.divider.value ?? "none")

const lineCount = computed(() => {
    if (props.lines != null) {
        return props.lines
    }

    if (slots.tertiary) {
        return 3
    }

    return slots.supporting ? 2 : 1
})
const hasLeading = computed(() => props.icon != null || slots.leading != null)
const hasTrailing = computed(() => slots.trailing != null)
const isLink = computed(() => props.href != null && !props.disabled)
const isAction = computed(() => (props.action || props.href != null) && !props.disabled)
const surfaceTag = computed(() => {
    if (isLink.value) {
        return "a"
    }

    return isAction.value && !props.disabled ? "button" : "span"
})
const rippleOptions = computed<RippleOptions>(() => {
    if (!isAction.value || props.disabled || props.ripple === false) {
        return { disabled: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return { contrast: "low" }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? "low",
        disabled: !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? false,
    }
})
const classes = computed(() => [
    "rui-list-item",
    `rui-list-item--${lineCount.value}-line`,
    `rui-list-item--divider-${divider.value}`,
    {
        "rui-list-item--action": isAction.value,
        "rui-list-item--disabled": props.disabled,
        "rui-list-item--leading": hasLeading.value,
        "rui-list-item--trailing": hasTrailing.value,
    },
])

function handleClick(event: MouseEvent) {
    if (!isAction.value || props.disabled) {
        event.preventDefault()
        return
    }

    emit("click", event)
}
</script>

<template>
    <li :class="classes">
        <component
            :is="surfaceTag"
            v-bind="attrs"
            v-ripple="rippleOptions"
            class="rui-list-item__surface"
            :aria-disabled="disabled ? 'true' : undefined"
            :href="isLink ? href : undefined"
            :target="isLink ? target : undefined"
            :rel="isLink ? rel : undefined"
            :type="surfaceTag === 'button' ? 'button' : undefined"
            @click="handleClick"
        >
            <span v-if="hasLeading" class="rui-list-item__leading">
                <slot name="leading"><RIcon :icon="icon" :size="24" decorative /></slot>
            </span>
            <span class="rui-list-item__content">
                <span class="rui-list-item__title"><slot /></span>
                <span v-if="$slots.supporting" class="rui-list-item__supporting"><slot name="supporting" /></span>
                <span v-if="$slots.tertiary" class="rui-list-item__tertiary"><slot name="tertiary" /></span>
            </span>
            <span v-if="hasTrailing" class="rui-list-item__trailing"><slot name="trailing" /></span>
        </component>
    </li>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-list-item {
    --rui-comp-list-item-min-height: 48px;
    --rui-comp-list-item-padding-inline: 16px;
    --rui-comp-list-item-icon-size: 24px;
    --rui-comp-list-item-icon-gap: 16px;
    --rui-comp-list-item-title-color: #{color.$on-surface-high};
    --rui-comp-list-item-supporting-color: #{color.$on-surface-medium};

    box-sizing: border-box;
    position: relative;
    min-block-size: var(--rui-comp-list-item-min-height);
    list-style: none;

    &--2-line {
        --rui-comp-list-item-min-height: max(48px, #{density.withDecrement(64px, --rui-comp-list-density-scale)});
    }

    &--3-line {
        --rui-comp-list-item-min-height: max(48px, #{density.withDecrement(88px, --rui-comp-list-density-scale)});
    }

    &:not(:last-child)::after {
        position: absolute;
        z-index: 1;
        inset-block-end: 0;
        display: none;
        block-size: var(--rui-comp-list-divider-thickness, 1px);
        background: var(--rui-comp-list-divider-color, #{color.$on-surface-outline});
        content: "";
        pointer-events: none;
    }

    &--divider-full-bleed:not(:last-child)::after {
        display: block;
        inset-inline: 0;
    }

    &--divider-inset:not(:last-child)::after {
        display: block;
        inset-inline: var(--rui-comp-list-item-padding-inline, 16px) 0;
    }

    &--divider-inset.rui-list-item--leading:not(:last-child)::after {
        inset-inline-start: calc(
            var(--rui-comp-list-item-padding-inline, 16px) + var(--rui-comp-list-item-icon-size, 24px) +
                var(--rui-comp-list-item-icon-gap, 16px)
        );
    }
}

.rui-list-item__surface {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--rui-comp-list-item-icon-gap);
    inline-size: 100%;
    min-block-size: inherit;
    padding-inline: var(--rui-comp-list-item-padding-inline);
    color: var(--rui-comp-list-item-title-color);
    text-align: start;
    text-decoration: none;

    .rui-list-item--action & {
        @include normalize.button;

        padding-inline: var(--rui-comp-list-item-padding-inline);
        outline-offset: -2px;
        touch-action: manipulation;
    }

    .rui-list-item--disabled & {
        cursor: default;
        opacity: 0.38;
    }

    .rui-list-item--2-line &,
    .rui-list-item--3-line & {
        align-items: start;
        padding-block: 8px;
    }

    &:focus-visible {
        outline: 2px solid currentcolor;
        outline-offset: -2px;
    }
}

.rui-list-item__leading,
.rui-list-item__trailing {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: var(--rui-comp-list-item-icon-size);
    min-block-size: var(--rui-comp-list-item-icon-size);
}

.rui-list-item__leading {
    color: color.$on-surface-medium;
}

.rui-list-item__content {
    display: flex;
    min-inline-size: 0;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
}

.rui-list-item__title {
    @include typography.subtitle1("--rui-comp-list-item-title");
    @include typography.overflowEllipsis;

    color: var(--rui-comp-list-item-title-color);
}

.rui-list-item__supporting,
.rui-list-item__tertiary {
    @include typography.body2("--rui-comp-list-item-supporting");
    @include typography.overflowEllipsis;

    color: var(--rui-comp-list-item-supporting-color);
}

.rui-list-item--2-line .rui-list-item__supporting {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
}
</style>
