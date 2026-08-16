import { computed, ref, watchEffect, type Ref } from "vue"

import type { RSelectionModelContext, RSelectionModelItemRecord, RSelectionModelItemState } from "./types"

function sameItemState(left: RSelectionModelItemState, right: RSelectionModelItemState) {
    return left.disabled === right.disabled && left.element === right.element && Object.is(left.value, right.value)
}

export function useSelectionModel(
    model: Ref<unknown | undefined>,
    metadata: Record<string, unknown> = {},
): RSelectionModelContext {
    const items = ref<RSelectionModelItemRecord[]>([])
    const metadataRef = ref(metadata)

    const enabledItems = computed(() => {
        return items.value.filter((item) => !item.state.disabled)
    })

    const selectedItem = computed(() => {
        return enabledItems.value.find((item) => Object.is(item.state.value, model.value)) ?? null
    })

    watchEffect(() => {
        if (selectedItem.value) {
            return
        }

        const firstEnabled = enabledItems.value[0]
        if (!firstEnabled) {
            return
        }

        model.value = firstEnabled.state.value
    })

    function registerItem(id: symbol, state: RSelectionModelItemState) {
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
        return Object.is(model.value ?? null, value)
    }

    function activate(id: symbol) {
        const item = getItemById(id)
        if (!item || item.state.disabled || Object.is(model.value ?? null, item.state.value)) {
            return
        }

        model.value = item.state.value
    }

    return {
        items: computed(() => items.value),
        selectedItem,
        registerItem,
        unregisterItem,
        isSelected,
        activate,
        metadata: computed(() => metadataRef.value),
    }
}
