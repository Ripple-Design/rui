<script setup lang="ts">
import { computed, inject, useSlots } from "vue"

import { R_ICON_STYLES } from "@/foundations/icon"
import { globalTheme } from "@/foundations/theme"
import { themeKey } from "@/foundations/theme/controller"

import type { RIconProps, RIconSource } from "./types"

import { resolveIconSource } from "./family"

const props = withDefaults(defineProps<RIconProps>(), {
    emphasis: "medium",
})
const slots = useSlots()
const theme = inject(themeKey, null)

const style = computed(() => ({
    "--rui-icon-size": typeof props.size === "number" ? `${props.size}px` : props.size,
}))

const isDecorative = computed(() => props.decorative || !props.label)
const role = computed(() => (isDecorative.value ? undefined : "img"))
const ariaLabel = computed(() => (isDecorative.value ? undefined : props.label))
const hasDefaultSlot = computed(() => !!slots.default)
const resolvedIconStyle = computed(
    () => props.iconStyle ?? theme?.theme.value.iconStyle ?? globalTheme.value.iconStyle ?? R_ICON_STYLES[0],
)
const resolvedIcon = computed<RIconSource | undefined>(() => resolveIconSource(props.icon, resolvedIconStyle.value))
const isComponentSource = computed(() => !!resolvedIcon.value && typeof resolvedIcon.value !== "string")
const isStringSource = computed(() => typeof resolvedIcon.value === "string")
const classes = computed(() => [
    "rui-icon",
    `rui-icon--emphasis-${props.emphasis}`,
])
</script>

<template>
    <span
        v-if="hasDefaultSlot"
        :class="classes"
        v-bind="$attrs"
        :style="style"
        :aria-hidden="isDecorative ? 'true' : undefined"
        :role="role"
        :aria-label="ariaLabel"
    >
        <slot />
    </span>

    <component
        :is="resolvedIcon"
        v-else-if="isComponentSource"
        :class="classes"
        v-bind="$attrs"
        :style="style"
        :aria-hidden="isDecorative ? 'true' : undefined"
        :role="role"
        :aria-label="ariaLabel"
        focusable="false"
    />

    <svg
        v-else-if="isStringSource"
        :class="classes"
        v-bind="$attrs"
        :style="style"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        focusable="false"
        :aria-hidden="isDecorative ? 'true' : undefined"
        :role="role"
        :aria-label="ariaLabel"
        v-html="resolvedIcon"
    />
</template>

<style scoped lang="scss">
.rui-icon {
    --rui-comp-icon-color: var(--rui-icon-color, inherit);
    --rui-comp-icon-color-high: var(
        --rui-icon-color-high,
        var(--rui-comp-surface-content-color-high, var(--rui-sys-color-on-surface-high))
    );
    --rui-comp-icon-color-medium: var(
        --rui-icon-color-medium,
        var(--rui-comp-surface-content-color-medium, var(--rui-sys-color-on-surface-medium))
    );
    --rui-comp-icon-color-low: var(
        --rui-icon-color-low,
        var(--rui-comp-surface-content-color-low, var(--rui-sys-color-on-surface-low))
    );

    display: inline-flex;
    inline-size: var(--rui-icon-size, 1em);
    block-size: var(--rui-icon-size, 1em);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    color: var(--rui-comp-icon-color);
    fill: currentColor;
    shape-rendering: geometricPrecision;

    &--emphasis-high {
        --rui-comp-icon-color: var(--rui-comp-icon-color-high);
    }

    &--emphasis-medium {
        --rui-comp-icon-color: var(--rui-comp-icon-color-medium);
    }

    &--emphasis-low {
        --rui-comp-icon-color: var(--rui-comp-icon-color-low);
    }
}
</style>
