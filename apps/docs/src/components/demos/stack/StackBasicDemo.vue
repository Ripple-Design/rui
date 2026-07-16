<script setup lang="ts">
import { RColumn, RRow, RStack } from "@ripple-design/rui"
</script>

<template>
    <RStack gap="16px">
        <div class="stack-card">Account details</div>
        <div class="stack-card">Billing address</div>
        <div class="stack-card">Notification settings</div>
    </RStack>

    <RRow gap="12px" class="stack-row-example">
        <div class="stack-pill">RRow</div>
        <div class="stack-pill">keeps items</div>
        <div class="stack-pill">in a row</div>
    </RRow>

    <RColumn gap="12px" class="stack-column-example">
        <div class="stack-pill">RColumn</div>
        <div class="stack-pill">keeps items</div>
        <div class="stack-pill">in a column</div>
    </RColumn>
</template>

<style scoped>
.stack-card,
.stack-pill {
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    padding: 16px;
}

.stack-row-example,
.stack-column-example {
    margin-top: 16px;
}

.stack-pill {
    background: #f7f7f7;
}
</style>
