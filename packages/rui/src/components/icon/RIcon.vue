<script setup lang="ts">
import { computed, inject, useSlots } from "vue"

import { R_ICON_STYLES } from "@/foundations/icon"
import { themeKey } from "@/foundations/theme/controller"

import type { RIconProps, RIconSource } from "./types"

import { resolveIconSource } from "./family"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<RIconProps>()
const slots = useSlots()
const theme = inject(themeKey, null)

const style = computed(() => ({
    "--rui-icon-size": typeof props.size === "number" ? `${props.size}px` : props.size,
}))

const isDecorative = computed(() => props.decorative || !props.label)
const role = computed(() => (isDecorative.value ? undefined : "img"))
const ariaLabel = computed(() => (isDecorative.value ? undefined : props.label))
const hasDefaultSlot = computed(() => !!slots.default)
const resolvedIconStyle = computed(() => props.iconStyle ?? theme?.theme.value.iconStyle ?? R_ICON_STYLES[0])
const resolvedIcon = computed<RIconSource | undefined>(() => resolveIconSource(props.icon, resolvedIconStyle.value))
const isComponentSource = computed(() => !!resolvedIcon.value && typeof resolvedIcon.value !== "string")
const isStringSource = computed(() => typeof resolvedIcon.value === "string")
</script>

<template>
    <span
        v-if="hasDefaultSlot"
        class="rui-icon"
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
        class="rui-icon"
        v-bind="$attrs"
        :style="style"
        :aria-hidden="isDecorative ? 'true' : undefined"
        :role="role"
        :aria-label="ariaLabel"
        focusable="false"
    />

    <svg
        v-else-if="isStringSource"
        class="rui-icon"
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
    display: inline-flex;
    inline-size: var(--rui-icon-size, 1em);
    block-size: var(--rui-icon-size, 1em);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    fill: currentColor;
}
</style>
