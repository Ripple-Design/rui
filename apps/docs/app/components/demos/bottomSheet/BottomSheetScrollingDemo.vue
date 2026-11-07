<script setup lang="ts">
import { RBottomSheet, RButton } from "@ripple-design/rui"
</script>

<template>
    <div class="bottom-sheet-scroll-demo">
        <RBottomSheet title="Activity" max-height="28rem">
            <div class="bottom-sheet-scroll-demo__content">
                <p v-for="item in 16" :key="item">Activity row {{ item }} keeps the body scrollable while the header and footer stay fixed.</p>
            </div>

            <template #footer>
                <div class="bottom-sheet-scroll-demo__footer">
                    <RButton variant="text">Clear</RButton>
                    <RButton variant="contained">Save</RButton>
                </div>
            </template>
        </RBottomSheet>
    </div>
</template>

<style scoped>
.bottom-sheet-scroll-demo {
    display: grid;
    align-items: end;
    block-size: 32rem;
}

.bottom-sheet-scroll-demo__content {
    display: grid;
    gap: 0.75rem;
}

.bottom-sheet-scroll-demo__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.bottom-sheet-scroll-demo__content p {
    margin: 0;
}
</style>
