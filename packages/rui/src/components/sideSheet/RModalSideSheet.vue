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
        <div class="rui-modal-side-sheet" :class="`rui-modal-side-sheet--${side}`">
            <RSideSheet :title="title" :side="side" :width="width" class="rui-modal-side-sheet__panel">
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
        </div>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-modal-side-sheet-modal {
    inline-size: 100vw;
    max-inline-size: 100vw;
    block-size: 100dvh;
    max-block-size: 100dvh;
    margin: 0;
    padding: 0;
    border: 0;
    opacity: 1;
    transform: none;
}

.rui-modal-side-sheet-modal[open] {
    opacity: 1;
    transform: none;
}

.rui-modal-side-sheet {
    inline-size: 100vw;
    block-size: 100dvh;
    display: flex;
    overflow: hidden;
    pointer-events: none;
}

.rui-modal-side-sheet--start {
    justify-content: flex-start;
}

.rui-modal-side-sheet--end {
    justify-content: flex-end;
}

.rui-modal-side-sheet__panel {
    block-size: 100dvh;
    max-block-size: 100dvh;
    inline-size: min(var(--rui-side-sheet-width, 100vw), 100vw);
    pointer-events: auto;
    transition-property: transform;
    transition-duration: #{motion.$duration-medium-out};
    transition-timing-function: #{motion.$easing-accelerated};
}

.rui-modal-side-sheet-modal[open] .rui-modal-side-sheet__panel {
    transition-duration: #{motion.$duration-medium-in};
    transition-timing-function: #{motion.$easing-decelerated};
}
.rui-modal-side-sheet--end .rui-modal-side-sheet__panel {
    transform: translateX(0);
}

.rui-modal-side-sheet--start .rui-modal-side-sheet__panel {
    transform: translateX(0);
}

@starting-style {
    .rui-modal-side-sheet-modal[open] .rui-modal-side-sheet--end .rui-modal-side-sheet__panel {
        transform: translateX(100%);
    }

    .rui-modal-side-sheet-modal[open] .rui-modal-side-sheet--start .rui-modal-side-sheet__panel {
        transform: translateX(-100%);
    }
}

.rui-modal-side-sheet-modal:not([open]) .rui-modal-side-sheet--end .rui-modal-side-sheet__panel {
    transform: translateX(100%);
}

.rui-modal-side-sheet-modal:not([open]) .rui-modal-side-sheet--start .rui-modal-side-sheet__panel {
    transform: translateX(-100%);
}
</style>
