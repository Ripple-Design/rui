<script setup lang="ts">
import { RButton } from "@ripple-design/rui"
import { RDataTableVirtual } from "@ripple-design/rux-data-table"
import { ref } from "vue"

import { dataTableDemoItems, standardHeaders } from "./data"

const table = ref<InstanceType<typeof RDataTableVirtual> | null>(null)
const target = ref(80)
</script>

<template>
    <div class="data-table-virtual-demo">
        <div class="data-table-virtual-demo__controls">
            <label>Index <input v-model.number="target" type="number" min="0" :max="dataTableDemoItems.length - 1"></label>
            <RButton @click="table?.scrollToIndex(target)">Scroll to row</RButton>
        </div>
        <RDataTableVirtual ref="table" :items="dataTableDemoItems" :headers="standardHeaders" item-value="id" item-key="id" height="320px" :item-height="56" hover />
    </div>
</template>

<style scoped>
.data-table-virtual-demo { display: grid; gap: 12px; }.data-table-virtual-demo__controls { display: flex; gap: 12px; align-items: center; }
</style>
