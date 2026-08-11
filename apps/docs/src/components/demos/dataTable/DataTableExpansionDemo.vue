<script setup lang="ts">
import { RDataTable } from "@ripple-design/rux-data-table"
import { ref } from "vue"

import { dataTableDemoItems, standardHeaders } from "./data"

const expanded = ref<unknown[]>([])
const expandStrategy = ref<"multiple" | "single">("multiple")
</script>

<template>
    <div class="data-table-expansion-demo">
        <label>Expand strategy
            <select v-model="expandStrategy"><option value="multiple">multiple</option><option value="single">single</option></select>
        </label>
        <RDataTable v-model:expanded="expanded" :items="dataTableDemoItems.slice(0, 8)" :headers="standardHeaders" item-value="id" show-expand :expand-strategy="expandStrategy" expand-on-click>
            <template #expanded="{ item }">
                <strong>{{ item.name }}</strong> has {{ item.protein }}g protein and was created on {{ item.createdAt }}.
            </template>
        </RDataTable>
    </div>
</template>

<style scoped>
.data-table-expansion-demo { display: grid; gap: 12px; }
</style>
