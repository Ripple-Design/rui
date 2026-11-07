<script setup lang="ts">
import { computed, ref } from "vue"

import { RChip, RChipGroup, RColumn } from "@ripple-design/rui"

const filters = ref(["design"])
const filtersLabel = computed(() => filters.value.join(", ") || "None")
</script>

<template>
    <RColumn gap="8">
        <RChipGroup v-model="filters" selection="multiple" required>
            <RChip type="filter" value="design">Design</RChip>
            <RChip type="filter" value="accessibility">Accessibility</RChip>
            <RChip type="filter" value="performance">Performance</RChip>
            <RChip type="filter" value="disabled" disabled>Disabled</RChip>
        </RChipGroup>

        <RChipGroup v-model="filters" selection="multiple" required :wrap="false">
            <RChip type="filter" variant="outlined" value="design">Outlined filter</RChip>
            <RChip type="filter" variant="outlined" value="accessibility">Accessibility</RChip>
        </RChipGroup>

        <span>Filters: {{ filtersLabel }}</span>
    </RColumn>
</template>
