<script setup lang="ts">
import { ref } from "vue"

import type { RFieldShellProps } from "./types"

import RNotchedOutline from "./RNotchedOutline.vue"

const emit = defineEmits<{
    focusStateChange: [focused: boolean]
    focusRequest: []
}>()

const isHovered = ref(false)

defineProps<RFieldShellProps>()

function handleFocusOut(event: FocusEvent) {
    const shell = event.currentTarget
    const nextFocusedElement = event.relatedTarget
    if (shell instanceof HTMLElement && nextFocusedElement instanceof Node && shell.contains(nextFocusedElement)) {
        return
    }

    emit("focusStateChange", false)
}

function handleClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof Element)) {
        return
    }

    if (target.closest("button, a, input, textarea, select, [tabindex]")) {
        return
    }

    emit("focusRequest")
}
</script>

<template>
    <div
        class="rui-field-shell rui-field-shell--outlined"
        :class="{
            'rui-field-shell--has-start-icon': hasStartIcon,
            'rui-field-shell--has-end-icon': hasEndIcon,
            'rui-field-shell--text-area': textArea,
        }"
        @click="handleClick"
        @focusin="emit('focusStateChange', true)"
        @focusout="handleFocusOut"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <span v-if="hasStartIcon" class="rui-field-shell__icon rui-field-shell__icon--start">
            <slot name="start-icon" />
        </span>
        <slot />
        <span v-if="hasEndIcon" class="rui-field-shell__icon rui-field-shell__icon--end">
            <slot name="end-icon" />
        </span>
        <RNotchedOutline
            :focused="focused"
            :floating="floating"
            :has-value="hasValue"
            :text-area="textArea"
            :hovered="isHovered && !focused"
            :label="label"
            :input-id="inputId"
            :has-start-icon="hasStartIcon"
        />
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/density";
@use "@/styles/shape";
@use "@/styles/color";

.rui-field-shell {
    --rui-comp-text-field-shape-family: var(--rui-sys-shape-small-family);
    --rui-comp-text-field-shape-start-start: var(--rui-sys-shape-small-start-start);
    --rui-comp-text-field-shape-start-end: var(--rui-sys-shape-small-start-end);
    --rui-comp-text-field-shape-end-end: var(--rui-sys-shape-small-end-end);
    --rui-comp-text-field-shape-end-start: var(--rui-sys-shape-small-end-start);
    --rui-comp-text-field-content-padding-inline: 16px;
    --rui-comp-text-field-adornment-inline-size: 48px;
    --rui-comp-text-field-density: #{density.$scale};
    --rui-comp-text-field-content-padding-vertical: calc(16px + var(--rui-comp-text-field-density) * 2px);
    --rui-comp-text-field-input-padding-inline-start: var(--rui-comp-text-field-content-padding-inline);
    --rui-comp-text-field-input-padding-inline-end: var(--rui-comp-text-field-content-padding-inline);
    --rui-comp-text-field-adornment-text-gap: 4px;
    --rui-comp-text-field-input-label-inset-inline-start: 0px;
    --rui-comp-text-field-floating-label-inset-inline-start: var(--rui-comp-text-field-content-padding-inline);
    --rui-comp-text-field-icon-color: #{color.$on-surface-medium};

    position: relative;
    display: flex;
    align-items: center;

    @include shape.apply(
        var(--rui-comp-text-field-shape-family),
        var(--rui-comp-text-field-shape-start-start),
        var(--rui-comp-text-field-shape-start-end),
        var(--rui-comp-text-field-shape-end-end),
        var(--rui-comp-text-field-shape-end-start)
    );

    &--has-start-icon {
        --rui-comp-text-field-input-padding-inline-start: var(--rui-comp-text-field-adornment-text-gap);
        --rui-comp-text-field-input-label-inset-inline-start: calc(
            var(--rui-comp-text-field-adornment-inline-size) + var(--rui-comp-text-field-adornment-text-gap)
        );
    }

    &--has-end-icon {
        --rui-comp-text-field-input-padding-inline-end: var(--rui-comp-text-field-adornment-text-gap);
    }

    &__icon {
        z-index: 1;
        display: inline-flex;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        flex: 0 0 var(--rui-comp-text-field-adornment-inline-size);
        color: var(--rui-comp-text-field-icon-color);

        &--start {
            order: -1;
        }

        &--end {
            order: 1;
        }
    }

    &--text-area &__icon {
        align-self: start;
        block-size: var(--rui-comp-text-field-adornment-inline-size);
        padding-top: var(--rui-comp-text-field-content-padding-vertical);
    }

    :slotted(.rui-field-input) {
        z-index: 1;
        flex: 1 1 auto;
        min-inline-size: 0;
    }
}
</style>
