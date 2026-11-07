<script setup lang="ts">
import { RButton, RFullscreenDialog } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
const scrollContent = Array.from(
    { length: 96 },
    (_, index) => `Generated fullscreen dialog content sentence ${index + 1}.`,
).join(" ")
</script>

<template>
    <div class="dialog-demo">
        <RButton variant="outlined" @click="open = true">Open fullscreen dialog</RButton>

        <RFullscreenDialog v-model="open" aria-label="Edit event">
            <section class="dialog-demo__content">
                <h2>Edit event</h2>
                <p>{{ scrollContent }}</p>
            </section>

            <template #actions="{ close }">
                <RButton variant="text" @click="close('cancel')">Cancel</RButton>
                <RButton variant="contained" @click="close('save')">Save</RButton>
            </template>
        </RFullscreenDialog>
    </div>
</template>

<style scoped>
.dialog-demo {
    display: grid;
    gap: 1rem;
}

.dialog-demo__content {
    padding: 24px;
}

.dialog-demo__content h2,
.dialog-demo__content p {
    margin: 0;
}

.dialog-demo__content p {
    margin-block-start: 1rem;
}
</style>
