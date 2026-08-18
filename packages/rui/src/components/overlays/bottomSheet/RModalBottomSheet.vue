<script setup lang="ts">
import { computed, ref } from "vue"

import type { RModalCloseDetail } from "@/primitives/modal/types.ts"

import RModal from "@/primitives/modal/RModal.vue"

import type { RModalBottomSheetProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"

const props = withDefaults(defineProps<RModalBottomSheetProps>(), {
    modelValue: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
    maxWidth: "640px",
    maxHeight: "100dvh",
    elevation: 16,
})

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: RModalCloseDetail): void
    (e: "close", detail: RModalCloseDetail): void
}>()

const modalRef = ref<InstanceType<typeof RModal> | null>(null)
const resolvedAriaLabel = computed(() => props.ariaLabel)
const resolvedAriaLabelledBy = computed(() => (resolvedAriaLabel.value ? undefined : props.ariaLabelledBy))

defineExpose({
    open() {
        modalRef.value?.open()
    },
    close(detail?: Partial<RModalCloseDetail>) {
        modalRef.value?.close({
            reason: detail?.reason ?? "programmatic",
            action: detail?.action,
        })
    },
})
</script>

<template>
    <RModal
        ref="modalRef"
        :model-value="modelValue"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :return-focus="returnFocus"
        :initial-focus="initialFocus"
        :role="role"
        :aria-label="resolvedAriaLabel"
        :aria-labelledby="resolvedAriaLabelledBy"
        :aria-describedby="ariaDescribedBy"
        class="rui-modal-bottom-sheet-modal"
        @update:model-value="emit('update:modelValue', $event)"
        @before-open="emit('before-open')"
        @open="emit('open')"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
    >
        <RSurface class="rui-modal-bottom-sheet__panel" variant="elevated" :elevation="elevation">
            <slot />
        </RSurface>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

:global(.rui-modal-bottom-sheet-modal) {
    position: fixed;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    overflow: hidden;
    transition:
        display 150ms #{motion.$easing-accelerated} allow-discrete,
        overlay 150ms #{motion.$easing-accelerated} allow-discrete;
}

:global(.rui-modal-bottom-sheet-modal)[open] {
    transition:
        display 150ms #{motion.$easing-standard} allow-discrete,
        overlay 150ms #{motion.$easing-standard} allow-discrete;
}

.rui-modal-bottom-sheet__panel {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    inline-size: 100%;
    max-inline-size: min(v-bind(maxWidth), 100vw);
    max-block-size: min(v-bind(maxHeight), 100dvh);
    margin-inline: auto;
    overflow: auto;
    transform: translateY(20%);
    opacity: 0;
    transition:
        transform 150ms #{motion.$easing-accelerated},
        opacity 150ms #{motion.$easing-accelerated};
    --rui-surface-shape-start-start: 0px;
    --rui-surface-shape-start-end: 0px;
    --rui-surface-shape-end-end: 0px;
    --rui-surface-shape-end-start: 0px;
}

:global(.rui-modal-bottom-sheet-modal[open] .rui-modal-bottom-sheet__panel) {
    transform: translateY(0);
    opacity: 1;
    transition:
        transform 150ms #{motion.$easing-standard},
        opacity 150ms #{motion.$easing-standard};
}

@starting-style {
    :global(.rui-modal-bottom-sheet-modal[open] .rui-modal-bottom-sheet__panel) {
        transform: translateY(20%);
        opacity: 0;
    }
}

:global(.rui-modal-bottom-sheet-modal::backdrop) {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    transition: background-color 150ms #{motion.$easing-accelerated};
}

:global(.rui-modal-bottom-sheet-modal[open]::backdrop) {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0.32);
    transition: background-color 150ms #{motion.$easing-standard};
}

@starting-style {
    :global(.rui-modal-bottom-sheet-modal[open]::backdrop) {
        background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    }
}

@media (prefers-reduced-motion: reduce) {
    :global(.rui-modal-bottom-sheet-modal),
    :global(.rui-modal-bottom-sheet-modal)[open],
    .rui-modal-bottom-sheet__panel,
    :global(.rui-modal-bottom-sheet-modal[open] .rui-modal-bottom-sheet__panel),
    :global(.rui-modal-bottom-sheet-modal::backdrop),
    :global(.rui-modal-bottom-sheet-modal[open]::backdrop) {
        transition: none;
    }
}
</style>
