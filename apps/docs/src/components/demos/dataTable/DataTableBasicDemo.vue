<script setup lang="ts">
import { RIFilterListOutlined, RISearchOutlined } from "@ripple-design/icons"
import { RIconButton } from "@ripple-design/rui"
import { RDataTable } from "@ripple-design/rux-data-table"
import { ref } from "vue"

type Dessert = { id: number; name: string; calories: number; fat: number; category: string }

const items = ref<Dessert[]>([
    { id: 1, name: "Frozen Yogurt", calories: 159, fat: 6, category: "Ice cream" },
    { id: 2, name: "Ice cream sandwich", calories: 237, fat: 9, category: "Ice cream" },
    { id: 3, name: "Eclair", calories: 262, fat: 16, category: "Pastry" },
    { id: 4, name: "Cupcake", calories: 305, fat: 3, category: "Pastry" },
    { id: 5, name: "Gingerbread", calories: 356, fat: 16, category: "Cookie" },
])
const sortBy = ref([{ key: "name", order: "asc" as const }])
const page = ref(1)
const itemsPerPage = ref(10)
const selected = ref<unknown[]>([])
const search = ref("")

const columns = [
    { key: "name", title: "Dessert", sortable: true },
    { key: "category", title: "Category" },
    { key: "calories", title: "Calories", align: "end" as const, sortable: true },
    { key: "fat", title: "Fat (g)", align: "end" as const, sortable: true },
]
</script>

<template>
    <RDataTable
        v-model="selected"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :search="search"
        :items="items"
        :columns="columns"
        item-value="id"
        show-select
        title="Desserts"
    >
        <template #actions>
            <RIconButton :icon="RIFilterListOutlined" label="Filter" />
            <RIconButton :icon="RISearchOutlined" label="Search" />
        </template>
        <template #item.calories="{ value }">{{ value }} kcal</template>
    </RDataTable>
</template>
