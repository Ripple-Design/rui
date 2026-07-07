<script setup lang="ts">
import type { RTextFieldShellProps } from "../types.ts"

import RNotchedOutline from "./RNotchedOutline.vue"

const emit = defineEmits<{
    focusStateChange: [focused: boolean]
}>()

defineProps<RTextFieldShellProps>()
</script>

<template>
    <label
        class="rui-text-field-shell rui-text-field-shell--outlined"
        @focusin="emit('focusStateChange', true)"
        @focusout="emit('focusStateChange', false)"
    >
        <slot />
        <RNotchedOutline :should-float-label="shouldFloatLabel" :label="label" />
    </label>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";

.rui-text-field-shell {
    --rui-text-field-outlined-top-left-radius: 4px;
    --rui-text-field-outlined-top-right-radius: 4px;
    --rui-text-field-outlined-bottom-left-radius: 4px;
    --rui-text-field-outlined-bottom-right-radius: 4px;
    --rui-text-field-density: -2;

    position: relative;
    display: inline-flex;
    min-height: density.withDecrement(56px, --rui-text-field-density);
    border-radius: var(--rui-text-field-outlined-top-left-radius) var(--rui-text-field-outlined-top-right-radius)
        var(--rui-text-field-outlined-bottom-right-radius) var(--rui-text-field-outlined-bottom-left-radius);

    &:hover {
        :deep(.rui-notched-outline) {
            .rui-notched-outline__leading,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__leading,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__notch,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__trailing,
            .rui-notched-outline__trailing {
                border-color: color.$on-surface-high;
            }
        }
    }

    &:focus-within {
        :deep(.rui-notched-outline) {
            .rui-notched-outline__leading,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__leading,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__notch,
            .rui-notched-outline__label-space > .rui-notched-outline__label-space__trailing,
            .rui-notched-outline__trailing {
                border-width: 2px;
                border-color: color.$primary;
            }

            .rui-notched-outline__label-space > .rui-notched-outline__label-space__notch {
                border-top-style: none;
                transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            .rui-notched-outline__label {
                inset-inline-start: 16px;
            }
        }

        :deep(.rui-floating-label) {
            &.rui-floating-label--float-above {
                color: color.$primary;
            }
        }
    }
}
</style>
