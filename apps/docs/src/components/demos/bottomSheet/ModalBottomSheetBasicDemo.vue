<script setup lang="ts">
import { RButton, RModalBottomSheet } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="modal-bottom-sheet-demo">
        <RButton variant="contained" @click="open = true">Open modal bottom sheet</RButton>

        <RModalBottomSheet v-model="open">
            <p>Modal bottom sheets present choices while blocking interaction with the rest of the screen.</p>
        </RModalBottomSheet>
    </div>
</template>

<style scoped>
.modal-bottom-sheet-demo {
    display: grid;
    gap: 1rem;
}

.modal-bottom-sheet-demo p {
    margin: 0;
}
</style>
