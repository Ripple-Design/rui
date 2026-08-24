<script setup lang="ts">
import { RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone } from "@ripple-design/icons"
import { computed, inject, onBeforeUnmount, ref, useAttrs, useId, watch } from "vue"

import { RIcon } from "@/components"
import { createIconFamily } from "@/components/base/icon/family.ts"
import { listBoxContextKey } from "@/components/internal/listBox/types.ts"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RMenuItemProps } from "./types.ts"

import { menuGroupKey, menuKey } from "./types.ts"

const props = withDefaults(defineProps<RMenuItemProps>(), {
    disabled: false,
})

const emit = defineEmits<{
    (e: "click", event: MouseEvent | KeyboardEvent): void
}>()

const attrs = useAttrs()
const selectedCheckIcon = createIconFamily(RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone)
const menu = inject(menuKey, null)
const selectContext = inject(listBoxContextKey, null)
const group = inject(menuGroupKey, null)
const itemRef = ref<HTMLElement | null>(null)
const itemId = Symbol("menu-item")
const itemDomId = useId()
const focused = computed(() => menu?.focusedItemId.value === itemId)
const active = computed(() => selectContext?.activeOptionId.value === itemDomId)
const selectable = computed(() => (selectContext != null || group != null) && props.value !== undefined)
const selected = computed(() => {
    if (selectContext && props.value !== undefined) {
        return selectContext.isSelected(props.value)
    }

    return selectable.value ? (group?.isSelected(props.value) ?? false) : false
})
const visible = computed(() => selectContext?.isOptionVisible(props.label ?? "") ?? true)
const displayLabel = computed(() => props.label ?? "")
const usesCheckIndicator = computed(() => group?.indicator.value === "check")
const showLeadingIndicator = computed(() => selectable.value && usesCheckIndicator.value)
const showSelectedCheck = computed(() => selectable.value && usesCheckIndicator.value && selected.value)
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: props.disabled,
    contrast: "low",
    selected: selected.value && (selectContext == null || !usesCheckIndicator.value),
}))
const role = computed(() => {
    if (selectContext && props.value !== undefined) {
        return "option"
    }

    return selectable.value ? "menuitemradio" : "menuitem"
})
const tabIndex = computed(() => {
    if (props.disabled) {
        return -1
    }

    return focused.value ? 0 : -1
})

watch(
    [itemRef, () => props.disabled, () => props.label, () => props.value],
    ([element, disabled, label, value]) => {
        if (menu) {
            menu.registerItem({
                disabled,
                element,
                id: itemId,
            })
        }

        if (selectContext) {
            selectContext.register({
                disabled,
                element,
                id: itemDomId,
                label: label ?? "",
                value,
            })
        }
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

    if (selectContext && props.value !== undefined) {
        selectContext.commit({
            disabled: props.disabled,
            element: itemRef.value,
            id: itemDomId,
            label: props.label ?? "",
            value: props.value,
        })
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
    selectContext?.unregister(itemDomId)
})
</script>

<template>
    <div
        v-if="visible"
        ref="itemRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        class="rui-menu-item"
        :class="{
            'rui-menu-item--active': active,
            'rui-menu-item--disabled': disabled,
            'rui-menu-item--selected': selected,
        }"
        :role="role"
        :aria-selected="role === 'option' ? selected : undefined"
        :aria-checked="role === 'menuitemradio' ? selected : undefined"
        :id="role === 'option' ? itemDomId : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="tabIndex"
        @focus="handleFocus"
        @click="handleClick"
        @keydown="handleKeyDown"
    >
        <span v-if="showLeadingIndicator || icon" class="rui-menu-item__leading">
            <RIcon v-if="showSelectedCheck" :icon="selectedCheckIcon" :size="24" emphasis="inherit" decorative />
            <RIcon v-else-if="icon" :icon="icon" :size="24" emphasis="inherit" decorative />
        </span>
        <span class="rui-menu-item__label">
            <slot>{{ displayLabel }}</slot>
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
