<script setup lang="ts">
import { computed, ref } from "vue"

import { vRipple } from "@/foundations/ripple"

import type { RFieldShellProps } from "./types.ts"

import RNotchedOutline from "./RNotchedOutline.vue"

const emit = defineEmits<{
    focusStateChange: [focused: boolean]
    focusRequest: []
}>()

const props = withDefaults(defineProps<RFieldShellProps>(), {
    ripple: () => ({ disabled: true }),
})
const isHovered = ref(false)
const shellRef = ref<HTMLElement | null>(null)
const hasError = computed(() => !!props.errorText?.trim())
const generatedHelperText = computed(() => {
    if (!props.helperIndicator) {
        return props.helperText
    }

    return props.helperText ? `${props.helperText} ${props.helperIndicator}` : props.helperIndicator
})
const captionText = computed(() => (hasError.value ? props.errorText : generatedHelperText.value))
const captionKind = computed(() => (hasError.value ? "error" : "helper"))
const resolvedLabelSuffix = computed(() => props.labelSuffix ?? (props.required ? "*" : undefined))
const helperId = computed(() => props.helperId ?? `${props.inputId ?? "field"}-helper`)

defineExpose({
    element: shellRef,
})

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
        ref="shellRef"
        class="rui-field-shell rui-field-shell--outlined"
        :class="{
            'rui-field-shell--has-start-icon': hasStartIcon,
            'rui-field-shell--has-end-icon': hasEndIcon,
            'rui-field-shell--text-area': textArea,
        }"
    >
        <div
            v-ripple="ripple"
            class="rui-field-shell__control"
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
                :error="hasError"
                :floating="floating"
                :has-value="hasValue"
                :text-area="textArea"
                :hovered="isHovered && !focused"
                :label="label"
                :label-suffix="resolvedLabelSuffix"
                :required="required"
                :input-id="inputId"
                :label-id="labelId"
                :has-start-icon="hasStartIcon"
            />
        </div>

        <div class="rui-field-shell__caption-area">
            <Transition name="rui-field-helper">
                <div
                    v-if="captionText"
                    :id="helperId"
                    :key="captionKind"
                    class="rui-field-helper"
                    :class="{ 'rui-field-helper--error': hasError }"
                >
                    {{ captionText }}
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/motion";
@use "@/styles/shape";
@use "@/styles/typography";

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
    --rui-comp-field-helper-padding-top: 4px;
    --rui-comp-field-helper-padding-inline: 16px;
    --rui-comp-field-helper-color: #{color.$on-surface-medium};
    --rui-comp-field-helper-error-color: #{color.$error};
    --rui-comp-field-helper-caption-translate-y: -5px;
    --rui-comp-field-helper-opacity-duration: 167ms;
    --rui-comp-field-helper-translate-duration: 217ms;

    display: flex;
    flex-direction: column;
    min-inline-size: 0;

    &--has-start-icon {
        --rui-comp-text-field-input-padding-inline-start: var(--rui-comp-text-field-adornment-text-gap);
        --rui-comp-text-field-input-label-inset-inline-start: calc(
            var(--rui-comp-text-field-adornment-inline-size) + var(--rui-comp-text-field-adornment-text-gap)
        );
    }

    &--has-end-icon {
        --rui-comp-text-field-input-padding-inline-end: var(--rui-comp-text-field-adornment-text-gap);
    }

    &__control {
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

    &__caption-area {
        display: grid;
    }

    :slotted(.rui-field-input) {
        z-index: 1;
        flex: 1 1 auto;
        min-inline-size: 0;
    }
}

.rui-field-helper {
    @include typography.caption("--rui-comp-field-helper-text");

    grid-area: 1 / 1;
    box-sizing: border-box;
    inline-size: 100%;
    padding: var(--rui-comp-field-helper-padding-top) var(--rui-comp-field-helper-padding-inline) 0;
    color: var(--rui-comp-field-helper-color);
}

.rui-field-helper--error {
    color: var(--rui-comp-field-helper-error-color);
}

.rui-field-helper-enter-active,
.rui-field-helper-leave-active {
    transition:
        opacity var(--rui-comp-field-helper-opacity-duration) #{motion.$easing-linear},
        transform var(--rui-comp-field-helper-translate-duration) #{motion.$easing-decelerated};
}

.rui-field-helper-enter-from {
    opacity: 0;
    transform: translateY(var(--rui-comp-field-helper-caption-translate-y));
}

.rui-field-helper-leave-to {
    opacity: 0;
    transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
    .rui-field-helper-enter-active,
    .rui-field-helper-leave-active {
        transition-duration: 0ms;
    }
}
</style>
