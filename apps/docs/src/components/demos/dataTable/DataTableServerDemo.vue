<script setup lang="ts">
import { RDataTableServer } from "@ripple-design/rux-data-table"
import { computed, ref } from "vue"

import { dataTableDemoItems, standardHeaders } from "./data"

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([{ key: "name", order: "asc" as const }])
const loading = ref(false)
const options = ref("Waiting for a query")
const pageItems = computed(() => {
    const sorted = [...dataTableDemoItems].sort((a, b) => String(a[sortBy.value[0]?.key as keyof typeof a] ?? "").localeCompare(String(b[sortBy.value[0]?.key as keyof typeof b] ?? "")))
    return sorted.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

function handleOptions(value: unknown) {
    options.value = JSON.stringify(value)
    loading.value = true
    setTimeout(() => { loading.value = false }, 350)
}
</script>

<template>
    <div class="data-table-server-demo">
        <p>Last emitted query: <code>{{ options }}</code></p>
        <RDataTableServer v-model:page="page" v-model:items-per-page="itemsPerPage" v-model:sort-by="sortBy" :items="pageItems" :items-length="dataTableDemoItems.length" :headers="standardHeaders" item-value="id" :loading="loading" @update:options="handleOptions" />
    </div>
</template>

<style scoped>
.data-table-server-demo { display: grid; gap: 12px; }.data-table-server-demo p { overflow-wrap: anywhere; }
</style>
