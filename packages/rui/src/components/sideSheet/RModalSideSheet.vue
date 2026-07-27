<script setup lang="ts">
import { computed, ref } from "vue"

import type { RModalCloseDetail } from "@/components/modal/types"

import RModal from "@/components/modal/RModal.vue"

import type { RModalSideSheetProps } from "./types"

import RSideSheet from "./RSideSheet.vue"

const props = withDefaults(defineProps<RModalSideSheetProps>(), {
    modelValue: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
    side: "end",
    width: "320px",
})

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: RModalCloseDetail): void
    (e: "close", detail: RModalCloseDetail): void
}>()

const modalRef = ref<InstanceType<typeof RModal> | null>(null)
const resolvedAriaLabel = computed(() => props.ariaLabel ?? props.title)
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
        class="rui-modal-side-sheet-modal"
        @update:model-value="emit('update:modelValue', $event)"
        @before-open="emit('before-open')"
        @open="emit('open')"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
    >
        <RSideSheet
            :title="title"
            :side="side"
            :width="width"
            :class="['rui-modal-side-sheet__panel', `rui-modal-side-sheet__panel--${side}`]"
        >
            <template v-if="$slots.title" #title>
                <slot name="title" />
            </template>
            <template v-if="$slots.header" #header>
                <slot name="header" />
            </template>
            <template v-if="$slots.footer" #footer>
                <slot name="footer" />
            </template>
            <slot />
        </RSideSheet>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-modal-side-sheet-modal {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    overflow: hidden;

    transition:
        display #{motion.$duration-medium-out} #{motion.$easing-accelerated} allow-discrete,
        overlay #{motion.$duration-medium-out} #{motion.$easing-accelerated} allow-discrete;
}

.rui-modal-side-sheet-modal[open] {
    transition:
        display #{motion.$duration-medium-in} #{motion.$easing-decelerated} allow-discrete,
        overlay #{motion.$duration-medium-in} #{motion.$easing-decelerated} allow-discrete;
}

.rui-modal-side-sheet__panel {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    pointer-events: auto;
    will-change: transform;
    transition: transform #{motion.$duration-medium-out} #{motion.$easing-accelerated};
}

.rui-modal-side-sheet__panel--start {
    left: 0;
    transform: translateX(-100%);
}
.rui-modal-side-sheet__panel--end {
    right: 0;
    transform: translateX(100%);
}

.rui-modal-side-sheet-modal[open] .rui-modal-side-sheet__panel--start,
.rui-modal-side-sheet-modal[open] .rui-modal-side-sheet__panel--end {
    transform: translateX(0);
    transition: transform #{motion.$duration-medium-in} #{motion.$easing-decelerated};
}

@starting-style {
    .rui-modal-side-sheet-modal[open] .rui-modal-side-sheet__panel--start {
        transform: translateX(-100%);
    }
    .rui-modal-side-sheet-modal[open] .rui-modal-side-sheet__panel--end {
        transform: translateX(100%);
    }
}

.rui-modal-side-sheet-modal::backdrop {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    transition: background-color #{motion.$duration-medium-out} #{motion.$easing-accelerated};
}

.rui-modal-side-sheet-modal[open]::backdrop {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0.32);
    transition: background-color #{motion.$duration-medium-in} #{motion.$easing-decelerated};
}
@starting-style {
    .rui-modal-side-sheet-modal[open]::backdrop {
        background-color: rgba(0, 0, 0, 0);
    }
}
</style>
