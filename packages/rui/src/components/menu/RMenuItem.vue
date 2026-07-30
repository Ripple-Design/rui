<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { RIcon } from "@/components"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import { menuKey } from "./types"

import type { RMenuItemProps } from "./types"

const props = withDefaults(defineProps<RMenuItemProps>(), {
    disabled: false,
})

const emit = defineEmits<{
    (e: "click", event: MouseEvent | KeyboardEvent): void
}>()

const attrs = useAttrs()
const menu = inject(menuKey)
const itemRef = ref<HTMLElement | null>(null)
const itemId = Symbol("menu-item")
const focused = computed(() => menu?.focusedItemId.value === itemId)
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: props.disabled,
    contrast: "low",
}))

const tabIndex = computed(() => {
    if (props.disabled) {
        return -1
    }

    return focused.value ? 0 : -1
})

watch(
    [itemRef, () => props.disabled],
    ([element, disabled]) => {
        if (!menu) {
            return
        }

        menu.registerItem({
            disabled,
            element,
            id: itemId,
        })
    },
    { immediate: true },
)

function handleFocus() {
    menu?.onItemFocus(itemId)
}

function handleClick(event: MouseEvent) {
    if (props.disabled) {
        event.preventDefault()
        return
    }

    emit("click", event)
    menu?.onItemClick(itemId)
}

function handleKeyDown(event: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        emit("click", event)
        menu?.onItemClick(itemId)
    }
}

onBeforeUnmount(() => {
    menu?.unregisterItem(itemId)
})
</script>

<template>
    <div
        ref="itemRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        class="rui-menu-item"
        :class="{ 'rui-menu-item--disabled': disabled }"
        role="menuitem"
        :tabindex="tabIndex"
        @focus="handleFocus"
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <span v-if="icon" class="rui-menu-item__icon">
            <RIcon :icon="icon" :size="20" decorative />
        </span>
        <span class="rui-menu-item__label">
            <slot />
        </span>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-menu-item {
    @include typography.body1("--rui-comp-menu-item");

    display: flex;
    align-items: center;
    gap: 20px;
    min-block-size: 48px;
    padding: 0 24px;
    color: color.$on-surface-high;
    cursor: pointer;
    outline: none;

    &--disabled {
        color: color.$on-surface-low;
        cursor: default;
        pointer-events: none;
    }
}

.rui-menu-item__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: color.$on-surface-medium;
}

.rui-menu-item__label {
    display: inline-flex;
    align-items: center;
}
</style>
