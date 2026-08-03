<script setup lang="ts">
import { RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone } from "@ripple-design/icons"
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { RIcon } from "@/components"
import { createIconFamily } from "@/components/icon/family"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RMenuItemProps } from "./types"

import { menuGroupKey, menuKey } from "./types"

const props = withDefaults(defineProps<RMenuItemProps>(), {
    disabled: false,
})

const emit = defineEmits<{
    (e: "click", event: MouseEvent | KeyboardEvent): void
}>()

const attrs = useAttrs()
const selectedCheckIcon = createIconFamily(RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone)
const menu = inject(menuKey)
const group = inject(menuGroupKey, null)
const itemRef = ref<HTMLElement | null>(null)
const itemId = Symbol("menu-item")
const focused = computed(() => menu?.focusedItemId.value === itemId)
const selectable = computed(() => group != null && props.value !== undefined)
const selected = computed(() => (selectable.value ? (group?.isSelected(props.value) ?? false) : false))
const usesCheckIndicator = computed(() => group?.indicator.value === "check")
const showLeadingIndicator = computed(() => selectable.value && usesCheckIndicator.value)
const showSelectedCheck = computed(() => selectable.value && usesCheckIndicator.value && selected.value)
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: props.disabled,
    contrast: "low",
    selected: selected.value && !usesCheckIndicator.value,
}))
const role = computed(() => (selectable.value ? "menuitemradio" : "menuitem"))
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

function activate(event: MouseEvent | KeyboardEvent) {
    if (props.disabled) {
        event.preventDefault()
        return
    }

    if (selectable.value) {
        group?.select(props.value)
    }

    emit("click", event)
    menu?.onItemClick(itemId)
}

function handleClick(event: MouseEvent) {
    activate(event)
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        activate(event)
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
        :class="{ 'rui-menu-item--disabled': disabled, 'rui-menu-item--selected': selected }"
        :role="role"
        :aria-checked="selectable ? selected : undefined"
        :tabindex="tabIndex"
        @focus="handleFocus"
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <span v-if="showLeadingIndicator || icon" class="rui-menu-item__leading">
            <RIcon v-if="showSelectedCheck" :icon="selectedCheckIcon" :size="20" decorative />
            <RIcon v-else-if="icon" :icon="icon" :size="20" decorative />
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
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &--disabled {
        color: color.$on-surface-low;
        cursor: default;
        pointer-events: none;
    }
}

.rui-menu-item__leading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 24px;
    block-size: 24px;
    flex: 0 0 24px;
    color: color.$on-surface-medium;
}

.rui-menu-item__label {
    display: inline-flex;
    align-items: center;
}
</style>
