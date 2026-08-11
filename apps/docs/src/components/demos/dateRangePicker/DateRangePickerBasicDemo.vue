<script setup lang="ts">
import { ref } from "vue"

import { RDateRangePicker } from "@ripple-design/rux-date-time-picker"
import "@ripple-design/rux-date-time-picker/styles.css"

const open = ref(false)
const value = ref({ start: null, end: null })
</script>

<template>
    <RDateRangePicker v-model="value" v-model:open="open" />
</template>
