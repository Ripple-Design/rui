<script setup lang="ts">
import { RButton, RModalSideSheet } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="modal-side-sheet-demo">
        <RButton variant="contained" @click="open = true">Open modal side sheet</RButton>

        <RModalSideSheet v-model="open" title="Edit filters">
            <p>Modal side sheets reuse the shared native dialog behavior while presenting content from the side.</p>
        </RModalSideSheet>
    </div>
</template>

<style scoped>
.modal-side-sheet-demo {
    display: grid;
    gap: 1rem;
}

.modal-side-sheet-demo p {
    margin: 0;
}
</style>
