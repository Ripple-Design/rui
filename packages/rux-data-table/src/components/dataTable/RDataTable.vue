<script setup lang="ts" generic="T">
import { useSlots } from "vue"

import RDataTableCore from "./RDataTableCore.vue"

import { useDataTableProxiedModel } from "../../composables/useDataTableProxiedModel"
import type { RDataTableEmits, RDataTableModelState, RDataTableProps, RDataTableSlots } from "./types"

const props = defineProps<RDataTableProps<T>>()
const emit = defineEmits<RDataTableEmits<T>>()
const modelValue = useDataTableProxiedModel(props, "modelValue", value => emit("update:modelValue", value), () => [])
const expanded = useDataTableProxiedModel(props, "expanded", value => emit("update:expanded", value), () => [])
const opened = useDataTableProxiedModel(props, "opened", value => emit("update:opened", value), () => [])
const modelState: RDataTableModelState = { modelValue, expanded, opened }
defineSlots<RDataTableSlots<T>>()
const slotNames: string[] = Object.keys(useSlots())
const forwardSlotProps = (value: unknown) => value as Record<string, unknown>
</script>

<template>
    <RDataTableCore v-bind="props" :model-state="modelState" @update:page="emit('update:page', $event)" @update:items-per-page="emit('update:itemsPerPage', $event)" @update:sort-by="emit('update:sortBy', $event)" @update:group-by="emit('update:groupBy', $event)" @update:options="emit('update:options', $event)" @update:current-items="emit('update:currentItems', $event)">
        <template v-for="name in slotNames" :key="name" #[name]="slotProps">
            <!-- @vue-ignore -->
            <slot :name="name" v-bind="forwardSlotProps(slotProps)" />
        </template>
    </RDataTableCore>
</template>
