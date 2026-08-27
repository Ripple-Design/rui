<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"

import RRadioButton from "../../input/radioButton/RRadioButton.vue"
import type { RRadioButtonListItemSlots, RRadioButtonListItemProps } from "./types.ts"

const props = withDefaults(defineProps<RRadioButtonListItemProps>(), {
    disabled: false,
    lines: undefined,
    ripple: true,
})
const attrs = useAttrs()
const slots = useSlots() as RRadioButtonListItemSlots
const model = defineModel<boolean>({ default: false })
const lineCount = computed(() => {
    if (props.lines != null) {
        return props.lines
    }

    if (slots.tertiary) {
        return 3
    }

    return slots.supporting ? 2 : 1
})
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false || props.disabled) {
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
    "rui-radio-button-list-item",
    `rui-radio-button-list-item--${lineCount.value}-line`,
    {
        "rui-radio-button-list-item--disabled": props.disabled,
        "rui-radio-button-list-item--trailing": slots.trailing != null,
    },
])
</script>

<template>
    <li v-ripple="rippleOptions" :class="classes">
        <RRadioButton
            v-bind="attrs"
            v-model="model"
            class="rui-radio-button-list-item__radio"
            :value="value"
            :name="name"
            :disabled="disabled"
            :ripple="false"
        >
            <span class="rui-radio-button-list-item__row">
                <span class="rui-radio-button-list-item__content">
                    <span class="rui-radio-button-list-item__title"><slot /></span>
                    <span v-if="$slots.supporting" class="rui-radio-button-list-item__supporting">
                        <slot name="supporting" />
                    </span>
                    <span v-if="$slots.tertiary" class="rui-radio-button-list-item__tertiary">
                        <slot name="tertiary" />
                    </span>
                </span>
                <span v-if="$slots.trailing" class="rui-radio-button-list-item__trailing">
                    <slot name="trailing" />
                </span>
            </span>
        </RRadioButton>
    </li>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/typography";

.rui-radio-button-list-item {
    --rui-comp-list-item-min-height: 48px;
    --rui-comp-list-item-padding-inline: 16px;
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
}

:deep(.rui-radio-button-list-item__radio.rui-radio-button__touch-target-wrapper) {
    display: flex;
    width: 100%;
}

:deep(.rui-radio-button-list-item__radio .rui-radio-button) {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    min-block-size: inherit;
    padding-inline: var(--rui-comp-list-item-padding-inline);
}

:deep(.rui-radio-button-list-item__radio .rui-radio-button__label) {
    display: block;
    flex: 1;
    min-inline-size: 0;
    margin-inline-start: var(--rui-comp-list-item-icon-gap);
}

.rui-radio-button-list-item__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--rui-comp-list-item-icon-gap);
    min-block-size: inherit;
    width: 100%;
}

.rui-radio-button-list-item__content {
    display: flex;
    min-inline-size: 0;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
}

.rui-radio-button-list-item__title {
    @include typography.subtitle1("--rui-comp-list-item-title");
    @include typography.overflowEllipsis;

    color: var(--rui-comp-list-item-title-color);
}

.rui-radio-button-list-item__supporting,
.rui-radio-button-list-item__tertiary {
    @include typography.body2("--rui-comp-list-item-supporting");
    @include typography.overflowEllipsis;

    color: var(--rui-comp-list-item-supporting-color);
}

.rui-radio-button-list-item--2-line .rui-radio-button-list-item__supporting {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
}

.rui-radio-button-list-item__trailing {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 24px;
    min-block-size: 24px;
}

.rui-radio-button-list-item--disabled .rui-radio-button-list-item__title,
.rui-radio-button-list-item--disabled .rui-radio-button-list-item__supporting,
.rui-radio-button-list-item--disabled .rui-radio-button-list-item__tertiary,
.rui-radio-button-list-item--disabled .rui-radio-button-list-item__trailing {
    color: var(--rui-sys-color-on-surface-low);
}
</style>
