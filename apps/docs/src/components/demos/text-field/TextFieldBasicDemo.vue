<script setup lang="ts">
import { RTextField } from "@ripple-design/rui/components"
import { ref } from "vue"

const model = ref("")
</script>

<template>
    <RTextField v-model="model" label="Label" placeholder="Placeholder" />
</template>
