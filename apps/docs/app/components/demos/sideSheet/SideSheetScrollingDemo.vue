<script setup lang="ts">
import { RSideSheet } from "@ripple-design/rui"
</script>

<template>
    <div class="side-sheet-scroll-demo">
        <RSideSheet title="Activity" width="320px">
            <div class="side-sheet-scroll-demo__content">
                <p v-for="item in 16" :key="item">Activity row {{ item }} keeps the body scrollable while the header stays fixed.</p>
            </div>
        </RSideSheet>
    </div>
</template>

<style scoped>
.side-sheet-scroll-demo {
    block-size: 28rem;
}

.side-sheet-scroll-demo__content {
    display: grid;
    gap: 0.75rem;
}

.side-sheet-scroll-demo__content p {
    margin: 0;
}
</style>
