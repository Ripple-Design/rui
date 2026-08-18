<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useId, watch } from "vue"

import type { RSelectOptionProps } from "./types.ts"

import { selectContextKey } from "./context.ts"

const props = withDefaults(defineProps<RSelectOptionProps>(), {
    disabled: false,
})

const selectContext = inject(selectContextKey)
if (!selectContext) {
    throw new Error("[RSelectOption] Options must be rendered inside RSelectField.")
}

const id = useId()
const element = ref<HTMLElement | null>(null)
const disabled = computed(() => props.disabled)
const label = computed(() => props.label)
const selected = computed(() => selectContext.isSelected(props.value))
const active = computed(() => selectContext.activeOptionId.value === id)

watch(
    [disabled, label, () => props.value],
    () =>
        selectContext.register({
            disabled: disabled.value,
            element: element.value,
            id,
            label: label.value ?? "",
            value: props.value,
        }),
    { immediate: true },
)
onBeforeUnmount(() => selectContext.unregister(id))

function select() {
    if (!props.disabled) {
        selectContext!.commit({
            disabled: props.disabled,
            element: element.value,
            id,
            label: props.label ?? "",
            value: props.value,
        })
    }
}
</script>

<template>
    <div
        ref="element"
        class="rui-select-option"
        :class="{
            'rui-select-option--active': active,
            'rui-select-option--selected': selected,
            'rui-select-option--disabled': disabled,
        }"
        role="option"
        :id="id"
        :aria-selected="selected ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : undefined"
        @click="select"
    >
        <slot>{{ label }}</slot>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-select-option {
    @include typography.body2("--rui-comp-select-field-option-text");

    --rui-comp-select-field-option-padding-inline: 16px;
    --rui-comp-select-field-option-min-block-size: 48px;

    display: flex;
    align-items: center;
    min-block-size: var(--rui-comp-select-field-option-min-block-size);
    padding-inline: var(--rui-comp-select-field-option-padding-inline);
    color: color.$on-surface-high;
    cursor: pointer;

    &:hover,
    &--active {
        background-color: rgb(from #{color.$on-surface} r g b / 0.08);
    }

    &--selected {
        color: color.$primary;
    }

    &--disabled {
        color: color.$on-surface-low;
        cursor: default;
        pointer-events: none;
    }
}
</style>
