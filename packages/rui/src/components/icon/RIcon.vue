<script setup lang="ts">
import { computed, useSlots } from "vue"

import type { RIconProps } from "./types"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<RIconProps>()
const slots = useSlots()

const style = computed(() => ({
    "--rui-icon-size": typeof props.size === "number" ? `${props.size}px` : props.size,
}))

const isDecorative = computed(() => props.decorative || !props.label)
const role = computed(() => (isDecorative.value ? undefined : "img"))
const ariaLabel = computed(() => (isDecorative.value ? undefined : props.label))
const hasDefaultSlot = computed(() => !!slots.default)
const isComponentSource = computed(() => !!props.icon && typeof props.icon !== "string")
const isStringSource = computed(() => typeof props.icon === "string")
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
        :is="icon"
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
        v-html="icon"
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
