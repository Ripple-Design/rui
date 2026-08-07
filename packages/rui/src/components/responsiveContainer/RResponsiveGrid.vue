<script setup lang="ts">
import { computed, inject, onMounted } from "vue"

import RGrid from "@/components/grid/RGrid.vue"
import { scaffoldContextKey } from "@/components/scaffold/context"

import RResponsiveContainer from "./RResponsiveContainer.vue"
import type { RResponsiveGridProps } from "./types"

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

onMounted(() => {
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
