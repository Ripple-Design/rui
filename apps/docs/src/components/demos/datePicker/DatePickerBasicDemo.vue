<script setup lang="ts">
import { ref } from "vue"

import { RDatePicker } from "@ripple-design/rux-date-time-picker"
import "@ripple-design/rux-date-time-picker/styles.css"

const open = ref(false)
const value = ref<string | null>(null)
</script>

<template>
    <RDatePicker v-model="value" v-model:open="open" />
</template>
