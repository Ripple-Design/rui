<script setup lang="ts">
import { RDataTable } from "@ripple-design/rux-data-table"
import { computed, ref } from "vue"

import { dataTableDemoItems, standardColumns } from "./data"

const loading = ref<false | "primary" | { side: "both" }>(false)
const hasData = ref(true)
const activeItems = computed(() => hasData.value ? dataTableDemoItems.slice(0, 6) : [])
</script>

<template>
    <div class="data-table-states-demo">
        <div class="data-table-states-demo__controls">
            <button type="button" @click="loading = loading ? false : { side: 'both' }">Toggle loading</button>
            <button type="button" @click="hasData = !hasData">Toggle empty data</button>
        </div>
        <RDataTable :items="activeItems" :columns="standardColumns" item-value="id" :loading="loading" no-data-text="No desserts match the current dataset">
            <template #loader><span class="data-table-states-demo__loader">Loading remote data…</span></template>
            <template #no-data><strong>The table is empty.</strong></template>
            <template #body.prepend><tr><td :colspan="standardColumns.length">Body prepend slot</td></tr></template>
            <template #body.append><tr><td :colspan="standardColumns.length">Body append slot</td></tr></template>
            <template #footer.prepend><span>Footer prepend slot</span></template>
        </RDataTable>
    </div>
</template>

<style scoped>
.data-table-states-demo { display: grid; gap: 12px; }.data-table-states-demo__controls { display: flex; flex-wrap: wrap; gap: 8px; }.data-table-states-demo__loader { color: var(--rui-sys-color-primary); font-weight: 700; }
</style>
