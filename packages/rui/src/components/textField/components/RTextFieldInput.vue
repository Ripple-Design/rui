<script setup lang="ts">
import type { RTextFieldInputProps } from "../types.ts"

import RTextInput from "../RTextInput.vue"

withDefaults(defineProps<RTextFieldInputProps>(), {
    textArea: false,
})

const model = defineModel<string>()
</script>

<template>
    <RTextInput
        class="rui-text-field-input"
        :class="{ 'rui-text-field-input--show-placeholder': showPlaceholder }"
        v-model="model"
        :placeholder="placeholder"
        :text-area="textArea"
    />
</template>

<style scoped lang="scss">
@use "@/styles/typography";
@use "@/styles/normalize";
@use "@/styles/color";
@use "@/styles/mixin";
@use "@/styles/motion";

.rui-text-field-input {
    /* TODO: declare a global var */
    --rui-comp-text-highlight-color: #{mixin.alpha(color.$primary, 40%)};

    @include normalize.input;
    @include typography.subtitle1("--rui-comp-text-field-input-text");

    padding-inline: var(--rui-text-field-content-padding-inline);
    color: color.$on-surface-high;
    // Baseline: widely available since January 2020.
    caret-color: color.$primary;

    // Limited availability: not supported by Safari on iOS
    &::selection {
        // Color definition from:
        // https://cs.android.com/android/platform/superproject/+/android-latest-release:frameworks/base/core/res/res/color/highlighted_text_material.xml
        background-color: var(--rui-comp-text-highlight-color);
    }

    &::placeholder {
        @include motion.fadeOut(87ms, motion.$easing-linear);
        opacity: 0;
        color: color.$on-surface-medium;
    }

    &--show-placeholder::placeholder {
        @include motion.fadeIn(87ms, motion.$easing-linear, 67ms);
        opacity: 1;
    }
}
</style>
