<script setup lang="ts">
import { computed, inject, watchEffect } from "vue"

import { scaffoldContextKey } from "@/components/layout/scaffold/context.ts"

import type { RResponsiveGridProps } from "./types.ts"

import RGrid from "../grid/RGrid.vue"
import RResponsiveContainer from "./RResponsiveContainer.vue"

const props = withDefaults(defineProps<RResponsiveGridProps>(), {
    mode: "centered",
})

const scaffold = inject(scaffoldContextKey, null)
const gridProps = computed(() => ({
    columns: { csm: 4, cmd: 8, clg: 12 },
    gap: props.gap,
    columnGap: props.columnGap,
    rowGap: props.rowGap,
}))

watchEffect(() => {
    scaffold?.setBodyGridMode(props.mode)
})
</script>

<template>
    <RResponsiveContainer :mode="mode" :max-width="maxWidth">
        <RGrid v-bind="gridProps">
            <slot />
        </RGrid>
    </RResponsiveContainer>
</template>
