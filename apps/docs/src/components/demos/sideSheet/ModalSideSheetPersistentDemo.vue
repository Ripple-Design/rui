<script setup lang="ts">
import { RButton, RModalSideSheet } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="modal-side-sheet-demo">
        <RButton variant="outlined" @click="open = true">Open protected sheet</RButton>

        <RModalSideSheet v-model="open" title="Publish settings" :close-on-escape="false" :close-on-backdrop="false" side="start">
            <div class="modal-side-sheet-demo__content">
                <p>Disable Escape and backdrop closing when the task should resolve explicitly.</p>
                <p>Use footer content when the sheet needs persistent controls.</p>
            </div>

            <template #footer>
                <div class="modal-side-sheet-demo__footer">
                    <RButton variant="text">Back</RButton>
                    <RButton variant="contained">Publish</RButton>
                </div>
            </template>
        </RModalSideSheet>
    </div>
</template>

<style scoped>
.modal-side-sheet-demo {
    display: grid;
    gap: 1rem;
}

.modal-side-sheet-demo__content {
    display: grid;
    gap: 0.75rem;
}

.modal-side-sheet-demo__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.modal-side-sheet-demo__content p {
    margin: 0;
}
</style>
