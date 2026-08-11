<script setup lang="ts" generic="T">
import { ref, useSlots } from "vue"

import RDataTableCore from "./RDataTableCore.vue"

import { useDataTableProxiedModel } from "../../composables/useDataTableProxiedModel"
import type { RDataTableModelState, RDataTableVirtualEmits, RDataTableVirtualProps, RDataTableVirtualSlots } from "./types"

type RDataTableVirtualCoreApi = {
    calculateVisibleItems: () => void
    scrollToIndex: (index: number) => void
}

const props = defineProps<RDataTableVirtualProps<T>>()
const emit = defineEmits<RDataTableVirtualEmits>()
const modelValue = useDataTableProxiedModel(props, "modelValue", value => emit("update:modelValue", value), () => [])
const expanded = useDataTableProxiedModel(props, "expanded", value => emit("update:expanded", value), () => [])
const opened = useDataTableProxiedModel(props, "opened", value => emit("update:opened", value), () => [])
const modelState: RDataTableModelState = { modelValue, expanded, opened }
defineSlots<RDataTableVirtualSlots<T>>()
const slotNames: string[] = Object.keys(useSlots())
const forwardSlotProps = (value: unknown) => value as Record<string, unknown>
const core = ref<RDataTableVirtualCoreApi | null>(null)

defineExpose({
    calculateVisibleItems: () => core.value?.calculateVisibleItems(),
    scrollToIndex: (index: number) => core.value?.scrollToIndex(index),
})
</script>

<template>
    <RDataTableCore ref="core" v-bind="props" :model-state="modelState" virtual-table :hide-default-footer="true" @update:sort-by="emit('update:sortBy', $event)" @update:group-by="emit('update:groupBy', $event)" @update:options="emit('update:options', $event)">
        <template v-for="name in slotNames" :key="name" #[name]="slotProps">
            <!-- @vue-ignore -->
            <slot :name="name" v-bind="forwardSlotProps(slotProps)" />
        </template>
    </RDataTableCore>
</template>
