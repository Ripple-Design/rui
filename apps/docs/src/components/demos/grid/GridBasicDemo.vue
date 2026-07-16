<script setup lang="ts">
import { RGrid, vColumnSpan, vRowSpan, vSpan } from "@ripple-design/rui"
</script>

<template>
    <RGrid :cols="3" gap="16px" class="grid-basic-demo">
        <div v-span="2" class="grid-card">Span 2 columns</div>
        <div class="grid-card">Two</div>
        <div class="grid-card">Three</div>
        <div v-column-span="'full'" class="grid-card">Full-width row</div>
        <div v-row-span="2" class="grid-card">Span 2 rows</div>
        <div class="grid-card">Six</div>
        <div class="grid-card">Seven</div>
    </RGrid>
</template>

<style scoped>
.grid-basic-demo {
    grid-auto-rows: minmax(72px, auto);
}

.grid-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 72px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    padding: 16px;
    text-align: center;
}
</style>
