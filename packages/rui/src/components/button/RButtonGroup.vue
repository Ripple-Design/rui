<script setup lang="ts">
import { computed, provide, ref, useAttrs, watchEffect } from "vue"

import type { RButtonGroupModelValue, RButtonGroupProps, RButtonVariant } from "./types"

import { buttonGroupKey, type RButtonGroupItemState } from "./groupContext"

const props = withDefaults(defineProps<RButtonGroupProps>(), {
    variant: "outlined",
    fullWidth: false,
})

const isIconGroup = computed(() => props.variant === "icon")
const inheritedVariant = computed<RButtonVariant>(() => {
    if (props.variant == null || props.variant === "icon") {
        return "outlined"
    }

    return props.variant
})

const model = defineModel<RButtonGroupModelValue>()
const attrs = useAttrs()
const items = ref<Array<{ id: symbol; state: RButtonGroupItemState }>>([])

const requiredSelection = computed(() => {
    if (props.selection === "single") {
        return props.required ?? true
    }

    return props.required ?? false
})

const role = computed(() => {
    if (typeof attrs.role === "string") {
        return attrs.role
    }

    return props.selection === "single" ? "radiogroup" : "group"
})

const multipleValue = computed(() => {
    if (props.selection !== "multiple" || !Array.isArray(model.value)) {
        return []
    }

    return model.value
})

const enabledSelectableItems = computed(() => {
    return items.value.filter((item) => item.state.hasValue && item.state.href == null && !item.state.disabled)
})

const selectedSingleItem = computed(() => {
    if (props.selection !== "single") {
        return null
    }

    return enabledSelectableItems.value.find((item) => Object.is(item.state.value, model.value)) ?? null
})

const activeSingleItemId = computed(() => {
    if (props.selection !== "single") {
        return null
    }

    return selectedSingleItem.value?.id ?? enabledSelectableItems.value[0]?.id ?? null
})

const hasInitializedSingleSelection = ref(false)

watchEffect(() => {
    if (props.selection !== "single") {
        return
    }

    if (model.value != null) {
        hasInitializedSingleSelection.value = true
        return
    }

    if (hasInitializedSingleSelection.value) {
        return
    }

    const firstEnabled = enabledSelectableItems.value[0]
    if (!firstEnabled) {
        return
    }

    model.value = firstEnabled.state.value
    hasInitializedSingleSelection.value = true
})

function sameItemState(left: RButtonGroupItemState, right: RButtonGroupItemState) {
    return (
        left.disabled === right.disabled &&
        left.element === right.element &&
        left.hasValue === right.hasValue &&
        left.href === right.href &&
        Object.is(left.value, right.value)
    )
}

function registerItem(id: symbol, state: RButtonGroupItemState) {
    const existingIndex = items.value.findIndex((item) => item.id === id)

    if (existingIndex === -1) {
        items.value.push({ id, state })
        return
    }

    const existing = items.value[existingIndex]!
    if (sameItemState(existing.state, state)) {
        return
    }

    items.value.splice(existingIndex, 1, { id, state })
}

function unregisterItem(id: symbol) {
    const existingIndex = items.value.findIndex((item) => item.id === id)
    if (existingIndex === -1) {
        return
    }

    items.value.splice(existingIndex, 1)
}

function getItemById(id: symbol) {
    return items.value.find((item) => item.id === id) ?? null
}

function isSelected(value: unknown) {
    if (props.selection === "single") {
        return Object.is(model.value ?? null, value)
    }

    if (props.selection === "multiple") {
        return multipleValue.value.some((entry) => Object.is(entry, value))
    }

    return false
}

function getTabIndex(id: symbol) {
    if (props.selection !== "single") {
        return undefined
    }

    const item = getItemById(id)
    if (!item || !item.state.hasValue || item.state.href != null || item.state.disabled) {
        return -1
    }

    return undefined
}

function activate(id: symbol) {
    const item = getItemById(id)
    if (!item || item.state.disabled || !item.state.hasValue || item.state.href != null) {
        return
    }

    const value = item.state.value

    if (props.selection === "single") {
        if (Object.is(model.value ?? null, value)) {
            return
        }

        model.value = value
        return
    }

    if (props.selection === "multiple") {
        const selected = isSelected(value)

        if (selected) {
            if (requiredSelection.value && multipleValue.value.length <= 1) {
                return
            }

            model.value = multipleValue.value.filter((entry) => !Object.is(entry, value))
            return
        }

        model.value = [...multipleValue.value, value]
    }
}

provide(buttonGroupKey, {
    variant: computed(() => inheritedVariant.value),
    icon: computed(() => isIconGroup.value),
    fullWidth: computed(() => props.fullWidth),
    selection: computed(() => props.selection),
    required: computed(() => requiredSelection.value),
    registerItem,
    unregisterItem,
    isSelected,
    getTabIndex,
    activate,
})
</script>

<template>
    <div
        v-bind="attrs"
        :aria-required="selection === 'single' && requiredSelection ? 'true' : undefined"
        :class="['rui-button-group', { 'rui-button-group--full-width': fullWidth }]"
        :role="role"
    >
        <slot />
    </div>
</template>

<style scoped lang="scss">
.rui-button-group {
    display: inline-flex;
    align-items: stretch;
    isolation: isolate;

    &--full-width {
        display: flex;
        width: 100%;

        > :deep(.rui-button__touch-target-wrapper) {
            flex: 1 1 0;
            min-width: 0;
        }
    }

    > :deep(.rui-button__touch-target-wrapper) {
        position: relative;
        flex-shrink: 0;
    }

    > :deep(.rui-button__touch-target-wrapper:has(> .rui-button:hover)),
    > :deep(.rui-button__touch-target-wrapper:has(> .rui-button:focus-visible)),
    > :deep(.rui-button__touch-target-wrapper:has(> .rui-button:active)) {
        z-index: 1;
    }

    > :deep(.rui-button__touch-target-wrapper:first-child:not(:last-child) > .rui-button) {
        --rui-button-shape-start-end: 0px;
        --rui-button-shape-end-end: 0px;
    }

    > :deep(.rui-button__touch-target-wrapper:not(:first-child):not(:last-child) > .rui-button) {
        --rui-button-shape-start-start: 0px;
        --rui-button-shape-start-end: 0px;
        --rui-button-shape-end-end: 0px;
        --rui-button-shape-end-start: 0px;
    }

    > :deep(.rui-button__touch-target-wrapper:last-child:not(:first-child) > .rui-button) {
        --rui-button-shape-start-start: 0px;
        --rui-button-shape-end-start: 0px;
    }

    > :deep(.rui-button__touch-target-wrapper + .rui-button__touch-target-wrapper:has(> .rui-button--outlined)) {
        margin-inline-start: -1px;
    }
}
</style>
