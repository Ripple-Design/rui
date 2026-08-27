<script setup lang="ts">
import { RDataTable } from "@ripple-design/rux-data-table"
import { computed, ref } from "vue"

import { dataTableDemoItems, standardColumns } from "./data"

const selected = ref<unknown[]>([])
const selectStrategy = ref<"single" | "page" | "all">("page")
const page = ref(1)
const itemsPerPage = ref(5)
const items = computed(() => dataTableDemoItems.slice(0, 20))
</script>

<template>
    <div class="data-table-selection-demo">
        <label>Selection strategy
            <select v-model="selectStrategy"><option value="single">single</option><option value="page">page</option><option value="all">all</option></select>
        </label>
        <p>Selected row IDs: {{ selected.join(", ") || "none" }}</p>
        <RDataTable v-model="selected" v-model:page="page" v-model:items-per-page="itemsPerPage" :items="items" :columns="standardColumns" item-value="id" item-selectable="selectable" show-select :select-strategy="selectStrategy" hover />
    </div>
</template>

<style scoped>
.data-table-selection-demo { display: grid; gap: 12px; }
.data-table-selection-demo p { margin: 0; }
</style>
