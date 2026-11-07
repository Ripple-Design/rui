<script setup lang="ts">
import { RCard, RGrid, vColumnSpan, vRowSpan, vSpan } from "@ripple-design/rui"
</script>

<template>
    <RGrid :columns="3">
        <RCard v-span="2">Span 2 columns</RCard>
        <RCard>Two</RCard>
        <RCard>Three</RCard>
        <RCard v-column-span="'full'">Full-width row</RCard>
        <RCard v-row-span="2">Span 2 rows</RCard>
        <RCard>Six</RCard>
        <RCard>Seven</RCard>
    </RGrid>
</template>
