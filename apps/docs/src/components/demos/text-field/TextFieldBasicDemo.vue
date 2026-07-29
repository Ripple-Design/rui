<script setup lang="ts">
import { RTextField } from "@ripple-design/rui"
</script>

<template>
    <div class="text-field-demo">
        <RTextField label="Label" />
        <RTextField placeholder="No label" />
        <RTextField label="Label" text-area />
        <RTextField placeholder="No label textarea" text-area />
    </div>
</template>

<style scoped lang="scss">
.text-field-demo {
    display: grid;
    gap: 16px;
    width: 100%;
}
</style>
