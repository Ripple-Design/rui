<script setup lang="ts">
import { RDataTable } from "@ripple-design/rux-data-table"
import { ref } from "vue"

import { dataTableDemoItems } from "./data"

const groupBy = ref([{ key: "region", order: "asc" as const }, { key: "category", order: "asc" as const }])
const opened = ref<string[]>([])
const headers = [
    { key: "name", title: "Dessert", sortable: true },
    { key: "region", title: "Region", sortable: true },
    { key: "category", title: "Category", sortable: true },
    { key: "metrics.revenue", value: "metrics.revenue", title: "Revenue", align: "end" as const, sortable: true },
]
</script>

<template>
    <RDataTable v-model:group-by="groupBy" v-model:opened="opened" :items="dataTableDemoItems.slice(0, 36)" :headers="headers" item-value="id" open-all page-by="auto">
        <template #group-header="{ item }"><strong>{{ item.key }}: {{ item.value }}</strong></template>
        <template #group-summary="{ item, columns }"><td :colspan="columns.length">{{ item.value }} summary: {{ item.items.length }} records</td></template>
        <template #item.metrics.revenue="{ value }">${{ Number(value).toLocaleString() }}</template>
    </RDataTable>
</template>
