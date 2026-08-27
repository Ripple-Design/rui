<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId, watchEffect } from "vue"

import { useFormField } from "../form/useFormField.ts"
import type { RRadioButtonGroupModelValue } from "../../input/radioButton/types.ts"
import { radioButtonGroupKey, type RRadioButtonGroupItemState } from "../../input/radioButton/groupContext.ts"
import type { RRadioButtonListGroupProps } from "./types.ts"

const props = withDefaults(defineProps<RRadioButtonListGroupProps>(), {
    required: true,
    orientation: "vertical",
    gap: "0px",
})
const localModel = defineModel<RRadioButtonGroupModelValue>()
const attrs = useAttrs()
const items = ref<Array<{ id: symbol; state: RRadioButtonGroupItemState }>>([])
const generatedName = `rui-radio-button-list-group-${useId()}`
const name = computed(() => props.name ?? generatedName)
const enabledItems = computed(() => items.value.filter((item) => item.state.hasValue && !item.state.disabled))
const formField = useFormField<RRadioButtonGroupModelValue>({
    defaultValue: () =>
        props.required
            ? ((enabledItems.value[0]?.state.value as RRadioButtonGroupModelValue | undefined) ?? null)
            : null,
    ignoreRequired: true,
    model: localModel,
    name: computed(() => props.name),
    replaceNullish: props.required,
})
const model = formField.model
const selectedItem = computed(
    () => enabledItems.value.find((item) => Object.is(item.state.value, model.value ?? null)) ?? null,
)
const activeItem = computed(() => selectedItem.value ?? enabledItems.value[0] ?? null)

watchEffect(() => {
    if (
        !props.required ||
        (formField.bound.value ? model.value != null : localModel.value != null) ||
        (formField.bound.value && !formField.registered.value)
    ) {
        return
    }

    const firstEnabled = enabledItems.value[0]
    if (firstEnabled) {
        model.value = firstEnabled.state.value as RRadioButtonGroupModelValue
    }
})

function sameItemState(left: RRadioButtonGroupItemState, right: RRadioButtonGroupItemState) {
    return (
        left.disabled === right.disabled &&
        left.element === right.element &&
        left.hasValue === right.hasValue &&
        Object.is(left.value, right.value)
    )
}

function registerItem(id: symbol, state: RRadioButtonGroupItemState) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index === -1) {
        items.value.push({ id, state })
        return
    }

    const existing = items.value[index]!
    if (!sameItemState(existing.state, state)) {
        items.value.splice(index, 1, { id, state })
    }
}

function unregisterItem(id: symbol) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) {
        items.value.splice(index, 1)
    }
}

function getItem(id: symbol) {
    return items.value.find((item) => item.id === id) ?? null
}

function isSelected(value: unknown) {
    return Object.is(model.value, value)
}

function getTabIndex(id: symbol) {
    return activeItem.value?.id === id ? 0 : -1
}

function activate(id: symbol) {
    const item = getItem(id)
    if (!item || item.state.disabled || !item.state.hasValue) {
        return
    }

    formField.setValue(item.state.value as RRadioButtonGroupModelValue, "change")
}

function focusItem(item: { id: symbol; state: RRadioButtonGroupItemState }) {
    activate(item.id)
    requestAnimationFrame(() => item.state.element?.focus())
}

function focusByKey(id: symbol, key: string, isRtl: boolean) {
    const currentIndex = enabledItems.value.findIndex((item) => item.id === id)
    if (currentIndex === -1 || enabledItems.value.length === 0) {
        return
    }

    if (key === "Home") {
        focusItem(enabledItems.value[0]!)
        return
    }

    if (key === "End") {
        focusItem(enabledItems.value[enabledItems.value.length - 1]!)
        return
    }

    const isVertical = props.orientation === "vertical"
    const nextKey = isVertical ? "ArrowDown" : isRtl ? "ArrowLeft" : "ArrowRight"
    const previousKey = isVertical ? "ArrowUp" : isRtl ? "ArrowRight" : "ArrowLeft"

    if (key !== nextKey && key !== previousKey) {
        return
    }

    const offset = key === nextKey ? 1 : -1
    const nextIndex = (currentIndex + offset + enabledItems.value.length) % enabledItems.value.length
    focusItem(enabledItems.value[nextIndex]!)
}

provide(radioButtonGroupKey, {
    name,
    orientation: computed(() => props.orientation),
    required: computed(() => props.required),
    registerItem,
    unregisterItem,
    isSelected,
    getTabIndex,
    activate,
    focusByKey,
})
</script>

<template>
    <div
        v-bind="attrs"
        class="rui-radio-button-list-group"
        :class="`rui-radio-button-list-group--${orientation}`"
        :style="{ '--rui-comp-radio-button-list-group-gap': gap }"
        role="radiogroup"
        :aria-required="required ? 'true' : undefined"
        :aria-invalid="formField.errorText.value ? 'true' : undefined"
        @focusout="formField.onFocusout"
    >
        <ul class="rui-radio-button-list-group__list">
            <slot />
        </ul>
    </div>
</template>

<style scoped lang="scss">
.rui-radio-button-list-group {
    box-sizing: border-box;
    width: 100%;

    &--horizontal .rui-radio-button-list-group__list {
        display: flex;
        flex-flow: row wrap;
        gap: var(--rui-comp-radio-button-list-group-gap);
    }
}

.rui-radio-button-list-group__list {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
    flex-direction: column;
    gap: var(--rui-comp-radio-button-list-group-gap);
    list-style: none;
}
</style>
