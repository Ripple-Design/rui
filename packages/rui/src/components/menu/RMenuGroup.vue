<script setup lang="ts">
import { inject, onBeforeUnmount, provide } from "vue"

import { menuGroupKey, menuKey } from "./types"

const modelValue = defineModel<unknown>()
const menu = inject(menuKey)
const groupId = Symbol("menu-group")

provide(menuGroupKey, {
    isSelected(value) {
        return Object.is(modelValue.value, value)
    },
    select(value) {
        modelValue.value = value
    },
})

menu?.registerGroup(groupId)

onBeforeUnmount(() => {
    menu?.unregisterGroup(groupId)
})
</script>

<template>
    <div class="rui-menu-group" role="group">
        <slot />
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";

.rui-menu-group {
    padding-block: 8px;

    & + & {
        border-block-start: 1px solid color.$on-surface-outline;
    }
}
</style>
