<script setup lang="ts">
import { RNumberField } from "@ripple-design/rui"
import { computed, ref } from "vue"

const amount = ref<number | null>(null)
const price = ref<number | null>(null)
const amountError = computed(() => (amount.value == null ? "Amount is required." : ""))
</script>

<template>
    <RNumberField
        v-model="amount"
        label="Amount"
        placeholder="0"
        :min="0"
        helper-text="Enter a whole-number amount."
        :error-text="amountError"
    />
    <RNumberField v-model="price" label="Price" placeholder="0.00" input-type="decimal" :min="0" />
</template>
