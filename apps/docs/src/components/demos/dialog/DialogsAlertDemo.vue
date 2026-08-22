<script setup lang="ts">
import { RButton, RDialogs } from "@ripple-design/rui"
import { ref } from "vue"

const result = ref("")

async function openDialog() {
    const detail = await RDialogs.alert({
        title: "Session expired",
        message: "Sign in again to continue.",
        negative: true,
        positive: true,
    })

    result.value = detail.action ?? detail.reason
}
</script>

<template>
    <div class="dialog-demo">
        <RButton variant="outlined" @click="openDialog">Open dialog</RButton>
        <output v-if="result">Result: {{ result }}</output>
    </div>
</template>

<style scoped>
.dialog-demo {
    display: grid;
    gap: 1rem;
}
</style>
