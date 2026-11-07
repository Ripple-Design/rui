<script setup lang="ts">
import { ref } from "vue"

import { RChip, RChipGroup, RColumn } from "@ripple-design/rui"

const inputSelected = ref(false)
const outlinedInputSelected = ref(true)
const inputChips = ref(["Vue", "Material", "Ripple"])

function removeInputChip(chip: string) {
    inputChips.value = inputChips.value.filter((entry) => entry !== chip)
}
</script>

<template>
    <RColumn gap="8">
        <RChipGroup>
            <RChip v-model="inputSelected" type="input" removable @remove="inputSelected = false">Standalone input</RChip>
            <RChip v-model="outlinedInputSelected" type="input" variant="outlined">Outlined input</RChip>
        </RChipGroup>

        <RChipGroup>
            <RChip
                v-for="chip in inputChips"
                :key="chip"
                type="input"
                removable
                :remove-label="`Remove ${chip}`"
                @remove="removeInputChip(chip)"
            >
                {{ chip }}
            </RChip>
        </RChipGroup>
    </RColumn>
</template>
