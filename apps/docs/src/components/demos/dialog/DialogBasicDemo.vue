<script setup lang="ts">
import { RButton, RDialog } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
const width = ref<number | "auto">("auto")
const height = ref<number | "auto">("auto")
const message = ref<string | undefined>()
const scrollMessage = Array.from(
    { length: 48 },
    (_, index) => `Generated scroll message sentence ${index + 1}.`,
).join(" ")

function openMessageDialog(nextWidth: number | "auto", nextHeight: number | "auto", nextMessage: string) {
    width.value = nextWidth
    height.value = nextHeight
    message.value = nextMessage
    open.value = true
}
</script>

<template>
    <div class="dialog-demo">
        <div class="dialog-demo__controls">
            <RButton
                variant="contained"
                @click="openMessageDialog('auto', 'auto', 'The message prop renders a concise dialog description.')"
            >
                Open auto message
            </RButton>
            <RButton variant="outlined" @click="openMessageDialog(5, 5, scrollMessage)">Open 5 × 5 message (scroll)</RButton>
            <RButton variant="outlined" @click="openMessageDialog(12, 7, scrollMessage)">Open 12 × 7 message</RButton>
        </div>

        <RDialog
            v-model="open"
            :width="width"
            :height="height"
            :message="message"
            title="Dialog examples"
        >
            <template #actions="{ close }">
                <RButton variant="text" @click="close('cancel')">Cancel</RButton>
                <RButton variant="text" @click="close('confirm')">Confirm</RButton>
            </template>
        </RDialog>
    </div>
</template>

<style scoped>
.dialog-demo {
    display: grid;
    gap: 1rem;
}

.dialog-demo__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
</style>
