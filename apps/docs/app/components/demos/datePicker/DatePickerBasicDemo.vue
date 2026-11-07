<script setup lang="ts">
import { RDatePicker } from "@ripple-design/rux-date-time-picker"
import { ref } from "vue"

const open = ref(false)
const value = ref<string | null>(null)
</script>

<template>
    <RDatePicker v-model="value" v-model:open="open" />
</template>
