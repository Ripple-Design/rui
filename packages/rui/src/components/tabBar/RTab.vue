<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import RIcon from "@/components/icon/RIcon.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { selectionModelKey } from "@/foundations/selectionModel"

import type { RTabProps } from "./types"

const props = withDefaults(defineProps<RTabProps>(), {
    disabled: false,
    stacked: false,
    ripple: true,
})

const attrs = useAttrs()
const group = inject(selectionModelKey, null)
const tabId = Symbol("rTab")
const interactiveRef = ref<HTMLElement | null>(null)

const selected = computed(() => (group ? group.isSelected(props.value) : false))
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true, unbounded: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return {
            disabled: props.disabled,
            contrast: "low",
            unbounded: true,
        }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? "low",
        disabled: props.disabled || !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? true,
    }
})
const classes = computed(() => [
    "rui-tab",
    {
        "rui-tab--selected": selected.value,
        "rui-tab--disabled": props.disabled,
        "rui-tab--stacked": props.stacked,
    },
])

watch(
    [() => props.disabled, () => props.value, interactiveRef, () => group],
    ([disabled, value, element, nextGroup]) => {
        nextGroup?.registerItem(tabId, { disabled, element, value })
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    group?.unregisterItem(tabId)
})

function handleClick() {
    if (props.disabled) {
        return
    }

    group?.activate(tabId)
}
</script>

<template>
    <button
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        :disabled="disabled"
        type="button"
        @click="handleClick"
    >
        <span class="rui-tab__content">
            <span v-if="icon" class="rui-tab__icon"><RIcon :icon="icon" :size="24" decorative /></span>
            <span class="rui-tab__label"><slot /></span>
        </span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-tab {
    --rui-comp-tab-bar-tab-color: #{color.$on-surface-medium};
    --rui-comp-tab-bar-tab-selected-color: #{color.$primary};

    @include normalize.button;
    display: inline-flex;
    overflow: visible;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
    padding-inline: 16px;
    padding-block: 12px;
    color: var(--rui-comp-tab-bar-tab-color);
    gap: 8px;

    &--selected {
        color: var(--rui-comp-tab-bar-tab-selected-color);
    }

    &--disabled {
        cursor: default;
        color: var(--rui-sys-color-on-surface-low);
        pointer-events: none;
    }

    &--stacked {
        flex-direction: column;
        gap: 4px;
    }
}

.rui-tab__content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
}

.rui-tab__label {
    @include typography.button("--rui-comp-tab-bar-label");
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
