<script setup lang="ts">
import { computed } from "vue"

import type { RResponsiveGridProps } from "./types.ts"

import RGrid from "../grid/RGrid.vue"
import RResponsiveContainer from "./RResponsiveContainer.vue"

const props = withDefaults(defineProps<RResponsiveGridProps>(), {
    mode: "centered",
})
const gridProps = computed(() => ({
    columns: { xs: 4, sm: 8, md: 12 },
    responsive: "container" as const,
    gap: props.gap,
    columnGap: props.columnGap,
    rowGap: props.rowGap,
}))
</script>

<template>
    <RResponsiveContainer
        :mode="props.mode"
        :max-width="props.maxWidth"
        :block-padding="props.blockPadding"
    >
        <RGrid class="rui-responsive-grid" v-bind="gridProps">
            <slot />
        </RGrid>
    </RResponsiveContainer>
</template>

<style scoped lang="scss">
@use "@/styles/breakpoints" as breakpoint;

:deep(.rui-responsive-grid) {
    --rui-comp-grid-gap: 16px;
}

@include breakpoint.c-up(xl) {
    :deep(.rui-responsive-grid) {
        --rui-comp-grid-gap: 24px;
    }
}
</style>
