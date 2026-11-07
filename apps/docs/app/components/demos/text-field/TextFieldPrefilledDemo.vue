<script setup lang="ts">
import { RColumn, RTextField } from "@ripple-design/rui"
import { ref } from "vue"

const prefilled = ref("Prefilled value")
const prefilledTextarea = ref("Prefilled textarea")
</script>

<template>
    <RColumn gap="16px" class="text-field-prefilled-demo">
        <RTextField v-model="prefilled" label="Prefilled label" />
        <RTextField v-model="prefilledTextarea" label="Prefilled textarea" text-area />
    </RColumn>
</template>

<style scoped lang="scss">
.text-field-prefilled-demo {
    width: 100%;
}
</style>
