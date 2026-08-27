<script setup lang="ts">
import { RDataTable } from "@ripple-design/rux-data-table"

import { dataTableDemoItems } from "./data"

const columns = [
    {
        title: "Dessert",
        children: [
            { key: "name", title: "Name", fixed: "start" as const, width: 200, sortable: true, nowrap: true },
            { key: "category", title: "Category", width: 150 },
        ],
    },
    {
        title: "Nutrition",
        children: [
            { key: "calories", title: "Calories", align: "end" as const, width: 120, sortable: true },
            { key: "fat", title: "Fat", align: "end" as const, width: 120 },
        ],
    },
    {
        title: "Business",
        children: [
            {
                key: "metrics.revenue",
                value: "metrics.revenue",
                title: "Revenue",
                align: "end" as const,
                width: 160,
                sortable: true,
            },
            { key: "status", title: "Status", fixed: "end" as const, width: 140 },
        ],
    },
]
</script>

<template>
    <RDataTable
        :items="dataTableDemoItems"
        :columns="columns"
        item-value="id"
        height="320px"
        fixed-header
        hover
        striped="even"
        :row-props="({ item }) => ({ 'data-status': item.status })"
        :cell-props="({ column }) => (column.key === 'status' ? { class: 'layout-demo__status' } : undefined)"
    >
        <template #caption>Wide nutrition and business data</template>
        <template #item.metrics.revenue="{ value }">${{ Number(value).toLocaleString() }}</template>
    </RDataTable>
</template>

<style scoped>
:deep(.layout-demo__status) {
    font-weight: 700;
}
</style>
