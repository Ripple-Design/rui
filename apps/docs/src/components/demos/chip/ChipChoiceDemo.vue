<script setup lang="ts">
import { ref } from "vue"

import { RChip, RChipGroup, RColumn } from "@ripple-design/rui"

const plainChoice = ref("design")
const outlinedChoice = ref("design")
</script>

<template>
    <RColumn gap="8">
        <RChipGroup v-model="plainChoice" selection="single">
            <RChip type="choice" value="design">Design</RChip>
            <RChip type="choice" value="develop">Develop</RChip>
            <RChip type="choice" value="test">Test</RChip>
        </RChipGroup>

        <RChipGroup v-model="outlinedChoice" selection="single">
            <RChip type="choice" variant="outlined" value="design">Outlined choice</RChip>
            <RChip type="choice" variant="outlined" value="develop">Develop</RChip>
        </RChipGroup>

        <span>Choice: {{ plainChoice }}</span>
    </RColumn>
</template>
