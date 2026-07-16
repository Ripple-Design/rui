<script setup lang="ts">
import { RGrid } from "@ripple-design/rui"
</script>

<template>
    <RGrid cols="repeat(auto-fit, minmax(12rem, 1fr))" column-gap="24px" row-gap="12px">
        <div class="grid-card">Auto-fit cards</div>
        <div class="grid-card">Cards wrap as space changes</div>
        <div class="grid-card">Minimum width stays readable</div>
        <div class="grid-card">Gaps can be controlled independently</div>
    </RGrid>
</template>

<style scoped>
.grid-card {
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    padding: 16px;
    background: #f7f7f7;
}
</style>
