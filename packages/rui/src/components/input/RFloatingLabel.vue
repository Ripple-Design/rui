<script setup lang="ts">
import type { RFloatingLabelProps } from "./types"

defineProps<RFloatingLabelProps>()
</script>

<template>
    <label
        v-if="label"
        class="rui-floating-label"
        :id="labelId"
        :for="inputId"
        :class="{
            'rui-floating-label--floating': floating,
            'rui-floating-label--focused': focused,
            'rui-floating-label--error': error,
            'rui-floating-label--has-value': hasValue,
            'rui-floating-label--text-area': textArea,
        }"
    >
        {{ label }}<span v-if="required" aria-hidden="true">*</span>
    </label>
</template>

<style scoped lang="scss">
@use "@/styles/typography";
@use "@/styles/color";

.rui-floating-label {
    --rui-comp-text-field-label-position-duration: 167ms;
    --rui-comp-text-field-label-color-duration: 167ms;
    --rui-comp-text-field-label-easing: cubic-bezier(0.4, 0, 0.2, 1);

    @include typography.subtitle1("--rui-comp-text-field-input-text");
    display: inline-block;
    position: absolute;
    top: 50%;
    inset-inline-start: var(--rui-comp-text-field-input-label-inset-inline-start);
    transform: translateY(-50%);
    pointer-events: none;
    color: color.$on-surface-medium;
    transition:
        top var(--rui-comp-text-field-label-position-duration) var(--rui-comp-text-field-label-easing),
        inset-inline-start var(--rui-comp-text-field-label-position-duration) var(--rui-comp-text-field-label-easing),
        font-size var(--rui-comp-text-field-label-position-duration) var(--rui-comp-text-field-label-easing),
        font-weight var(--rui-comp-text-field-label-position-duration) var(--rui-comp-text-field-label-easing),
        letter-spacing var(--rui-comp-text-field-label-position-duration) var(--rui-comp-text-field-label-easing),
        color var(--rui-comp-text-field-label-color-duration) var(--rui-comp-text-field-label-easing);

    &--text-area {
        top: calc(var(--rui-comp-text-field-content-padding-vertical) + 12px);
    }

    &--floating {
        @include typography.caption("--rui-comp-text-field-floating-label");
        inset-inline-start: 0;
        top: 0;
    }

    &--focused:not(.rui-floating-label--error) {
        color: color.$primary;
    }

    &--error {
        color: color.$error;
    }

    &--has-value {
        --rui-comp-text-field-label-color-duration: 0ms;
    }
}
</style>
