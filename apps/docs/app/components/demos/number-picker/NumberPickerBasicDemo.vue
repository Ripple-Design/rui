<script setup lang="ts">
import { RNumberPicker } from "@ripple-design/rui"
import { ref } from "vue"

const value = ref(3)
</script>

<template>
    <RNumberPicker v-model="value" :min="1" :max="10" aria-label="Quantity" />
</template>
