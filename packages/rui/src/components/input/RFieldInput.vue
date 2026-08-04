<script setup lang="ts">
import { ref } from "vue"

import type { RFieldInputProps } from "./types"

import RInput from "./RInput.vue"

defineOptions({
    inheritAttrs: false,
})

withDefaults(defineProps<RFieldInputProps>(), {
    textArea: false,
    hasStartIcon: false,
    hasEndIcon: false,
})

const model = defineModel<string>()
const inputRef = ref<InstanceType<typeof RInput> | null>(null)

function focus() {
    inputRef.value?.focus()
}

defineExpose({
    focus,
})
</script>

<template>
    <RInput
        ref="inputRef"
        v-bind="$attrs"
        class="rui-field-input"
        :class="{
            'rui-field-input--focused': focused,
            'rui-field-input--text-area': textArea,
            'rui-field-input--has-start-icon': hasStartIcon,
            'rui-field-input--has-end-icon': hasEndIcon,
        }"
        v-model="model"
        :input-type="inputType"
        :allow-negative="allowNegative"
        :placeholder="placeholder"
        :show-placeholder="showPlaceholder"
        :text-area="textArea"
    />
</template>

<style scoped lang="scss">
@use "@/styles/density";

.rui-field-input {
    width: 100%;
    min-width: 0;
    height: density.withDecrement(56px, --rui-comp-text-field-density);
    padding-inline: var(--rui-comp-text-field-input-padding-inline-start)
        var(--rui-comp-text-field-input-padding-inline-end);

    &--text-area {
        margin-top: var(--rui-comp-text-field-content-padding-vertical);
        height: density.withDecrement(
            calc(56px - var(--rui-comp-text-field-content-padding-vertical)),
            --rui-comp-text-field-density
        );
        min-height: density.withDecrement(
            calc(56px - var(--rui-comp-text-field-content-padding-vertical)),
            --rui-comp-text-field-density
        );
    }
}
</style>
