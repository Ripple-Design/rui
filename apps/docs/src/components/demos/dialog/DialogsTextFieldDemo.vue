<script setup lang="ts">
import { RButton, RDialogs } from "@ripple-design/rui"
import { ref } from "vue"

const result = ref("")

async function openDialog() {
    const { value, detail } = await RDialogs.textField({
        title: "Add label",
        placeholder: "Enter a label",
        value: "Initial label",
        negative: true,
        positive: true,
    })

    result.value = `${detail.action ?? detail.reason}: ${value}`
}
</script>

<template>
    <div class="dialog-demo">
        <RButton variant="outlined" @click="openDialog">Open text field dialog</RButton>
        <output v-if="result">Result: {{ result }}</output>
    </div>
</template>

<style scoped>
.dialog-demo {
    display: grid;
    gap: 1rem;
}
</style>
