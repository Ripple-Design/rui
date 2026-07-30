<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, useSlots, watch } from "vue"

import RIcon from "@/components/icon/RIcon.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import { navigationRailKey } from "./context"
import type { RNavigationRailItemProps } from "./types"

const props = withDefaults(defineProps<RNavigationRailItemProps>(), {
    ripple: true,
})

const attrs = useAttrs()
const slots = useSlots()
const rail = inject(navigationRailKey, null)
const itemId = Symbol("navigationRailItem")
const interactiveRef = ref<HTMLElement | null>(null)

const selected = computed(() => (rail ? rail.isSelected(props.value) : false))
const hasLabel = computed(() => !!slots.default?.().length)
const showLabel = computed(() => hasLabel.value && (rail?.labelVisibility !== "selected" || selected.value))
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true, unbounded: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return {
            disabled: false,
            contrast: "low",
            unbounded: true,
        }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? "low",
        disabled: !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? true,
    }
})
const classes = computed(() => [
    "rui-navigation-rail-item",
    {
        "rui-navigation-rail-item--selected": selected.value,
        "rui-navigation-rail-item--icon-only": !showLabel.value,
    },
])

watch(
    [() => props.value, interactiveRef, () => rail],
    ([value, element, nextRail]) => {
        nextRail?.registerItem(itemId, { disabled: false, element, value })
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    rail?.unregisterItem(itemId)
})

function handleClick() {
    rail?.activate(itemId)
}
</script>

<template>
    <button
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        type="button"
        @click="handleClick"
    >
        <span class="rui-navigation-rail-item__icon">
            <RIcon v-if="icon" :icon="icon" :size="24" decorative />
        </span>
        <span v-if="showLabel" class="rui-navigation-rail-item__label"><slot /></span>
    </button>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-navigation-rail-item {
    @include normalize.button;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 72px;
    height: 72px;
    padding-block-start: 14px;
    padding-block-end: 16px;
    color: color.$on-surface-medium;

    &--selected {
        color: color.$primary;
    }

    &--icon-only {
        justify-content: flex-start;
        padding-block-start: 24px;
        padding-block-end: 0;
    }
}

.rui-navigation-rail-item__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
}

.rui-navigation-rail-item__label {
    @include typography.caption("--rui-comp-navigation-rail-item-label");
    color: currentColor;
    text-align: center;
}
</style>
