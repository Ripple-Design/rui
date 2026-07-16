<script setup lang="ts">
import { ref } from "vue"

import { RNumberField, RStack } from "@ripple-design/rui"

const amount = ref<number | null>(null)
const price = ref<number | null>(null)
</script>

<template>
    <RStack gap="16px">
        <RNumberField v-model="amount" label="Amount" placeholder="0" />
        <RNumberField v-model="price" label="Price" placeholder="0.00" input-type="decimal" />
    </RStack>
</template>
