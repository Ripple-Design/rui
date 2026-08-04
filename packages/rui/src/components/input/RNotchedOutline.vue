<script setup lang="ts">
import { computed } from "vue"

import type { RNotchedOutlineProps } from "./types"

import RFloatingLabel from "./RFloatingLabel.vue"

const props = defineProps<RNotchedOutlineProps>()

const hasLabel = computed(() => !!props.label?.trim())
const notchWidthPx = computed(() => (props.floating ? "100%" : "0px"))
</script>

<template>
    <span
        class="rui-notched-outline"
        :class="{
            'rui-notched-outline--hovered': hovered,
            'rui-notched-outline--floating': floating,
            'rui-notched-outline--focused': focused,
            'rui-notched-outline--has-start-icon': hasStartIcon,
            'has-label': hasLabel,
        }"
    >
        <span class="rui-notched-outline__leading" />
        <span v-if="hasLabel" class="rui-notched-outline__label-space">
            <span class="rui-notched-outline__label-space__sizer">{{ label }}</span>
            <span class="rui-notched-outline__label-space__track">
                <span class="rui-notched-outline__label-space__leading" />
                <span class="rui-notched-outline__label-space__notch" :style="{ width: notchWidthPx }" />
                <span class="rui-notched-outline__label-space__trailing" />
            </span>
        </span>
        <span class="rui-notched-outline__trailing" />
        <RFloatingLabel
            class="rui-notched-outline__label"
            :focused="focused"
            :floating="floating"
            :text-area="textArea"
            :has-value="hasValue"
            :label="label"
            :input-id="inputId"
        />
    </span>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/shape";
@use "@/styles/typography";
@use "@/styles/mixin";

.rui-notched-outline {
    --rui-comp-notched-outline-color: #{mixin.alpha(color.$on-surface, 38%)};

    $block: &;

    display: flex;
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
    inset: 0;

    &__leading,
    &__trailing {
        border-width: 1px;
        border-color: var(--rui-comp-notched-outline-color);
        box-sizing: border-box;
    }

    &__leading {
        width: 12px;
        @include shape.apply(
            var(--rui-comp-text-field-shape-family),
            var(--rui-comp-text-field-shape-start-start),
            0,
            0,
            var(--rui-comp-text-field-shape-end-start)
        );
        border-inline-start-style: solid;
        border-top-style: solid;
        border-bottom-style: solid;
    }

    &__label-space {
        position: relative;
        display: inline-grid;
        align-self: stretch;

        &__sizer {
            @include typography.caption("--rui-comp-text-field-floating-label");
            display: block;
            height: 0;
            overflow: hidden;
            visibility: hidden;
            padding: 0 4px;
            white-space: nowrap;
        }

        &__track {
            position: absolute;
            inset: 0;
            display: flex;
        }

        &__leading,
        &__trailing {
            flex: 1;
            border-width: 1px;
            border-top-style: solid;
            border-bottom-style: solid;
            border-color: var(--rui-comp-notched-outline-color);
        }

        &__notch {
            transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1);
            border-width: 1px;
            border-bottom-style: solid;
            border-color: var(--rui-comp-notched-outline-color);
        }
    }

    &__label {
        position: absolute;
        inset-inline-start: var(--rui-comp-text-field-floating-label-inset-inline-start);
    }

    &--has-start-icon:not(#{$block}--floating) #{$block}__label {
        inset-inline-start: calc(
            var(--rui-comp-text-field-adornment-inline-size) + var(--rui-comp-text-field-adornment-text-gap)
        );
    }

    &--hovered {
        #{$block}__leading,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__leading,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__notch,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__trailing,
        #{$block}__trailing {
            border-color: color.$on-surface-high;
        }
    }

    &--floating {
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__notch {
            border-top-style: none;
        }
    }

    &--focused {
        #{$block}__leading,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__leading,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__notch,
        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__trailing,
        #{$block}__trailing {
            border-width: 2px;
            border-color: color.$primary;
        }

        #{$block}__label-space > #{$block}__label-space__track > #{$block}__label-space__notch {
            transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1);
        }
    }

    &.has-label {
        #{$block}__trailing {
            flex-grow: 1;
            @include shape.apply(
                var(--rui-comp-text-field-shape-family),
                0,
                var(--rui-comp-text-field-shape-start-end),
                var(--rui-comp-text-field-shape-end-end),
                0
            );
            border-inline-end-style: solid;
            border-top-style: solid;
            border-bottom-style: solid;
        }
    }

    &:not(.has-label) {
        #{$block}__leading {
            flex: 0 0 0;
            width: 0;
            border: none;
        }

        #{$block}__label-space {
            display: none;
        }

        #{$block}__trailing {
            flex-grow: 1;
            @include shape.apply(
                var(--rui-comp-text-field-shape-family),
                0,
                var(--rui-comp-text-field-shape-start-end),
                var(--rui-comp-text-field-shape-end-end),
                0
            );
            border-inline-start-style: solid;
            border-inline-end-style: solid;
            border-top-style: solid;
            border-bottom-style: solid;
            border-radius: 4px;
        }
    }
}
</style>
