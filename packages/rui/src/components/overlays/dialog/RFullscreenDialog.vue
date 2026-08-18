<script setup lang="ts">
import type { RFullscreenDialogProps } from "./types.ts"

import RDialog from "./RDialog.vue"

const props = defineProps<RFullscreenDialogProps>()

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
    (e: "close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
}>()
</script>

<template>
    <RDialog
        :model-value="modelValue"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :return-focus="returnFocus"
        :initial-focus="initialFocus"
        :role="role"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="ariaDescribedBy"
        :width="width"
        :height="height"
        class="rui-fullscreen-dialog"
        @update:model-value="emit('update:modelValue', $event)"
        @before-open="emit('before-open')"
        @open="emit('open')"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
    >
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>
        <template v-if="$slots.actions" #actions="slotProps">
            <slot name="actions" v-bind="slotProps" />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
        <slot />
    </RDialog>
</template>

<style scoped>
:global(.rui-fullscreen-dialog.rui-dialog-modal) {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    margin: 0;
    padding: 0;
    border: 0;
}

:global(.rui-fullscreen-dialog.rui-dialog-modal .rui-dialog.rui-surface) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    min-height: 100vh;
    border: 0;
    --rui-surface-shape-start-start: 0px;
    --rui-surface-shape-start-end: 0px;
    --rui-surface-shape-end-end: 0px;
    --rui-surface-shape-end-start: 0px;
}
</style>
