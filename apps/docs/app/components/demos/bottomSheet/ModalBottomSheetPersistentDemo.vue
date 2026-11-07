<script setup lang="ts">
import { RButton, RModalBottomSheet } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="modal-bottom-sheet-demo">
        <RButton variant="outlined" @click="open = true">Open protected sheet</RButton>

        <RModalBottomSheet v-model="open" :close-on-escape="false" :close-on-backdrop="false">
            <div class="modal-bottom-sheet-demo__content">
                <p>Publish settings</p>
                <p>Disable Escape and backdrop closing when the task should resolve explicitly.</p>
                <p>Use explicit controls when the sheet needs a protected decision.</p>
                <div class="modal-bottom-sheet-demo__footer">
                    <RButton variant="text">Back</RButton>
                    <RButton variant="contained" @click="open = false">Publish</RButton>
                </div>
            </div>
        </RModalBottomSheet>
    </div>
</template>

<style scoped>
.modal-bottom-sheet-demo {
    display: grid;
    gap: 1rem;
}

.modal-bottom-sheet-demo__content {
    display: grid;
    gap: 0.75rem;
}

.modal-bottom-sheet-demo__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.modal-bottom-sheet-demo__content p {
    margin: 0;
}
</style>
