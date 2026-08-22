<script setup lang="ts">
import { RButton, RDialog } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="dialog-demo">
        <RButton variant="outlined" @click="open = true">Open alert dialog</RButton>

        <RDialog
            v-model="open"
            role="alertdialog"
            title="Discard draft?"
            message="Your unsaved changes will be lost."
            :close-on-escape="false"
            :close-on-backdrop="false"
            negative="Keep editing"
            positive="Discard"
        />
    </div>
</template>

<style scoped>
.dialog-demo {
    display: grid;
    gap: 1rem;
}
</style>
