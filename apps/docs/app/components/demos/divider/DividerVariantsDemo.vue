<script setup lang="ts">
import { RDivider, RStack } from "@ripple-design/rui"
</script>

<template>
    <RStack class="divider-demo">
        <div class="divider-demo__section">
            <span>Order summary</span>
            <strong>$42.00</strong>
        </div>
        <RDivider variant="middle" />
        <div class="divider-demo__section">
            <span>Tax</span>
            <strong>$3.36</strong>
        </div>
        <RDivider variant="inset" />
        <div class="divider-demo__section">
            <span>Shipping</span>
            <strong>$5.00</strong>
        </div>
        <RDivider variant="full-bleed" />
        <div class="divider-demo__section">
            <span>Total</span>
            <strong>$50.36</strong>
        </div>
    </RStack>
</template>

<style scoped>
.divider-demo {
    overflow: hidden;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
}

.divider-demo__section {
    display: flex;
    justify-content: space-between;
    padding: 16px;
}
</style>
