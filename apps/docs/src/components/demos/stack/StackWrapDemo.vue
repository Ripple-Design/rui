<script setup lang="ts">
import { RStack } from "@ripple-design/rui"
</script>

<template>
    <RStack direction="row" wrap gap="12px" align="center">
        <div class="stack-chip">Design</div>
        <div class="stack-chip">Develop</div>
        <div class="stack-chip">Review</div>
        <div class="stack-chip">Ship</div>
        <div class="stack-chip">Measure</div>
    </RStack>
</template>

<style scoped>
.stack-chip {
    border: 1px solid #d0d0d0;
    border-radius: 999px;
    padding: 8px 12px;
    background: #f7f7f7;
}
</style>
