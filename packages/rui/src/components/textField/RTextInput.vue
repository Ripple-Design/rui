<script setup lang="ts">
import type { RTextFieldBaseProps } from "./types.ts"

withDefaults(defineProps<RTextFieldBaseProps>(), {
    textArea: false,
})
</script>

<template>
    <input v-if="!textArea" class="rui-text-input" />
    <textarea v-else class="rui-text-input" />
</template>

<style scoped lang="scss">
@use "@/styles/typography";
@use "@/styles/normalize";
@use "@/styles/color";
@use "@/styles/mixin";

.rui-text-input {
    --rui-comp-text-highlight-color: mixin.alpha(color.$primary, 40%);

    @include normalize.input;
    @include typography.subtitle1("--rui-comp-text-field-input-text");
    // Baseline: widely available since January 2020.
    caret-color: color.$primary;

    // Limited availability: not supported by Safari on iOS
    &::selection {
        // Color definition from:
        // https://cs.android.com/android/platform/superproject/+/android-latest-release:frameworks/base/core/res/res/color/highlighted_text_material.xml
        background-color: var(--rui-comp-text-highlight-color);
    }
}
</style>
