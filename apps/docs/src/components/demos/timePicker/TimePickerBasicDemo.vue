<script setup lang="ts">
import { RTimePicker } from "@ripple-design/rux-date-time-picker"
import "@ripple-design/rux-date-time-picker/styles.css"
import { ref } from "vue"

const value = ref<`${number}${number}:${number}${number}` | null>("09:30")
const open = ref(false)
</script>

<template>
    <RTimePicker v-model="value" v-model:open="open" />
</template>
