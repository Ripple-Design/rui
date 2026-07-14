<script setup lang="ts">
import type { RTextFieldInputProps } from "../types"

import RTextInput from "../RTextInput.vue"

withDefaults(defineProps<RTextFieldInputProps>(), {
    textArea: false,
})

const model = defineModel<string>()
</script>

<template>
    <RTextInput
        class="rui-text-field-input"
        :class="{
            'rui-text-field-input--show-placeholder': showPlaceholder,
            'rui-text-field-input--focused': focused,
            'rui-text-field-input--text-area': textArea,
        }"
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
@use "@/styles/density";

.rui-text-field-input {
    /* TODO: declare a global var */
    --rui-comp-text-highlight-color: #{mixin.alpha(color.$primary, 40%)};

    @include normalize.input;
    @include typography.subtitle1("--rui-comp-text-field-input-text");

    //width: 100%;
    //min-width: fit-content;
    //max-width: 100%;
    min-width: 280px;
    width: 100%;
    height: density.withDecrement(56px, --rui-text-field-density);
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

    &--text-area {
        resize: vertical;
        margin-top: var(--rui-text-field-content-padding-vertical);
        height: density.withDecrement(
            calc(56px - var(--rui-text-field-content-padding-vertical)),
            --rui-text-field-density
        );
        min-height: density.withDecrement(
            calc(56px - var(--rui-text-field-content-padding-vertical)),
            --rui-text-field-density
        );

        scrollbar-width: none;
        &::-webkit-scrollbar {
            //display: none;
        }

        /* TODO: redesign this */
        &::-webkit-resizer {
            //border: 2px solid black;
            //background: red;
            //box-shadow: 0 0 5px 5px blue;
            //outline: 2px solid yellow;
            //display: none;
        }
    }

    $block: &;
    &--focused {
        //&#{$block}--text-area {
        &::-webkit-resizer {
            //margin: 20px;
            //display: none;
        }
        //}
    }
}
</style>
