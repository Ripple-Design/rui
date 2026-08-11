<script setup lang="ts">
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

const headers = [
    { key: "name", title: "Dessert", sortable: true },
    { key: "category", title: "Category", sortable: true },
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
        :headers="headers"
        item-value="id"
        show-select
        label="Desserts"
    >
        <template #top>
            <div class="data-table-demo__toolbar">
                <label>Search <input v-model="search" type="search" /></label>
            </div>
        </template>
        <template #item.calories="{ value }">{{ value }} kcal</template>
    </RDataTable>
</template>

<style scoped>
.data-table-demo__toolbar {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
}
</style>
