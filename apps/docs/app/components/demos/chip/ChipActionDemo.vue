<script setup lang="ts">
import { RIAddFilled, RIArrowDropDownFilled } from "@ripple-design/icons"
import { ref } from "vue"

import { RChip, RChipGroup, RColumn } from "@ripple-design/rui"

const actionCount = ref(0)
</script>

<template>
    <RColumn gap="8">
        <RChipGroup>
            <RChip :icon="RIAddFilled" @click="actionCount += 1">Add item</RChip>
            <RChip :end-icon="RIArrowDropDownFilled" @click="actionCount += 1">More actions</RChip>
            <RChip variant="outlined" :icon="RIAddFilled" @click="actionCount += 1">Outlined action</RChip>
            <RChip disabled>Disabled action</RChip>
        </RChipGroup>
        <span>Actions: {{ actionCount }}</span>
    </RColumn>
</template>
