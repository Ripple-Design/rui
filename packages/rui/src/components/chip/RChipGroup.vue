<script setup lang="ts">
import { computed, provide, ref, useAttrs, watchEffect } from "vue"

import type { RChipGroupModelValue, RChipGroupProps } from "./types"

import { chipGroupKey, type RChipGroupItemState } from "./groupContext"

const props = withDefaults(defineProps<RChipGroupProps>(), {
    wrap: true,
})

const model = defineModel<RChipGroupModelValue>()
const attrs = useAttrs()
const items = ref<Array<{ id: symbol; state: RChipGroupItemState }>>([])

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
    return items.value.filter((item) => item.state.hasValue && !item.state.disabled)
})

const hasInitializedSingleSelection = ref(false)

watchEffect(() => {
    if (props.selection !== "single" || !requiredSelection.value) {
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

function sameItemState(left: RChipGroupItemState, right: RChipGroupItemState) {
    return (
        left.disabled === right.disabled &&
        left.element === right.element &&
        left.hasValue === right.hasValue &&
        Object.is(left.value, right.value)
    )
}

function registerItem(id: symbol, state: RChipGroupItemState) {
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

function activate(id: symbol) {
    const item = getItemById(id)
    if (!item || item.state.disabled || !item.state.hasValue) {
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
        if (isSelected(value)) {
            if (requiredSelection.value && multipleValue.value.length <= 1) {
                return
            }

            model.value = multipleValue.value.filter((entry) => !Object.is(entry, value))
            return
        }

        model.value = [...multipleValue.value, value]
    }
}

provide(chipGroupKey, {
    variant: computed(() => props.variant),
    type: computed(() => props.type),
    selection: computed(() => props.selection),
    required: computed(() => requiredSelection.value),
    registerItem,
    unregisterItem,
    isSelected,
    activate,
})
</script>

<template>
    <div
        v-bind="attrs"
        :aria-required="selection === 'single' && requiredSelection ? 'true' : undefined"
        :class="['rui-chip-group', { 'rui-chip-group--nowrap': !wrap }]"
        :role="role"
    >
        <slot />
    </div>
</template>

<style scoped lang="scss">
.rui-chip-group {
    --rui-comp-chip-group-column-gap: 8px;
    --rui-comp-chip-group-row-gap: 0px;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: var(--rui-comp-chip-group-column-gap);
    row-gap: var(--rui-comp-chip-group-row-gap);

    &--nowrap {
        flex-wrap: nowrap;
    }
}
</style>
