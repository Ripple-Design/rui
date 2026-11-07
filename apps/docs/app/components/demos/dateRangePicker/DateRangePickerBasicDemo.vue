<script setup lang="ts">
import { RDateRangePicker } from "@ripple-design/rux-date-time-picker"
import { ref } from "vue"

const open = ref(false)
const value = ref({ start: null, end: null })
</script>

<template>
    <RDateRangePicker v-model="value" v-model:open="open" />
</template>
