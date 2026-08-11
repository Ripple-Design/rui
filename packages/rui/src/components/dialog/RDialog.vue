<script setup lang="ts">
import { computed, onMounted, ref, useId, useSlots } from "vue"

import RModal from "@/components/modal/RModal.vue"
import RSurface from "@/components/surface/RSurface.vue"
import { useResizeObserver } from "@/utils/useResizeObserver"

import type { RDialogProps } from "./types"

const props = withDefaults(defineProps<RDialogProps>(), {
    modelValue: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
})

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
    (e: "close", detail: { reason: "cancel" | "backdrop" | "action" | "programmatic"; action?: string }): void
}>()

const slots = useSlots()
const modalRef = ref<InstanceType<typeof RModal> | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const contentBodyRef = ref<HTMLElement | null>(null)
const titleId = useId()
const descriptionId = useId()
const hasOverflow = ref(false)
const atTop = ref(true)
const atBottom = ref(true)
const hasHeader = computed(() => !!slots.header || !!slots.title || !!props.title)
const hasFooter = computed(() => !!slots.footer || !!slots.actions)
const hasContent = computed(() => !!slots.default)
const labelledby = computed(() => (hasHeader.value ? titleId : props.ariaLabelledBy))
const describedby = computed(() => (hasContent.value ? descriptionId : props.ariaDescribedBy))
const showHeaderDivider = computed(() => hasHeader.value && hasOverflow.value && !atTop.value)
const showFooterDivider = computed(() => hasFooter.value && hasOverflow.value && !atBottom.value)
const classes = computed(() => [
    "rui-dialog",
    {
        "rui-dialog--with-header": hasHeader.value,
        "rui-dialog--with-footer": hasFooter.value,
        "rui-dialog--show-header-divider": showHeaderDivider.value,
        "rui-dialog--show-footer-divider": showFooterDivider.value,
    },
])

function closeWithAction(action: string) {
    modalRef.value?.close({ reason: "action", action })
}

function updateScrollState() {
    const content = contentRef.value
    if (!content || !hasContent.value) {
        hasOverflow.value = false
        atTop.value = true
        atBottom.value = true
        return
    }

    const epsilon = 1
    const overflow = content.scrollHeight - content.clientHeight > epsilon

    hasOverflow.value = overflow

    if (!overflow) {
        atTop.value = true
        atBottom.value = true
        return
    }

    atTop.value = content.scrollTop <= epsilon
    atBottom.value = content.scrollTop + content.clientHeight >= content.scrollHeight - epsilon
}

function scheduleScrollStateUpdate() {
    requestAnimationFrame(() => {
        updateScrollState()
    })
}

function handleOpen() {
    scheduleScrollStateUpdate()
    emit("open")
}

useResizeObserver(contentRef, () => {
    scheduleScrollStateUpdate()
})

useResizeObserver(contentBodyRef, () => {
    scheduleScrollStateUpdate()
})

onMounted(() => {
    scheduleScrollStateUpdate()
})

defineExpose({
    open() {
        modalRef.value?.open()
    },
    close(action?: string) {
        modalRef.value?.close(action ? { reason: "action", action } : { reason: "programmatic" })
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
        :aria-label="ariaLabel"
        :aria-labelledby="labelledby"
        :aria-describedby="describedby"
        class="rui-dialog-modal"
        @update:model-value="emit('update:modelValue', $event)"
        @before-open="emit('before-open')"
        @open="handleOpen"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
    >
        <RSurface :class="classes" :elevation="24">
            <header v-if="hasHeader" class="rui-dialog__header">
                <slot name="header">
                    <h2 :id="titleId" class="rui-dialog__title">
                        <slot name="title">{{ title }}</slot>
                    </h2>
                </slot>
            </header>

            <div
                v-if="hasContent"
                :id="descriptionId"
                ref="contentRef"
                class="rui-dialog__content"
                @scroll="updateScrollState"
            >
                <div ref="contentBodyRef" class="rui-dialog__content-body">
                    <slot />
                </div>
            </div>

            <footer v-if="hasFooter" class="rui-dialog__footer">
                <slot name="footer">
                    <div v-if="$slots.actions" class="rui-dialog__actions">
                        <slot name="actions" :close="closeWithAction" />
                    </div>
                </slot>
            </footer>
        </RSurface>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";
@use "@/styles/motion";

.rui-dialog-modal {
    margin: auto;
    padding: 48px;
    transition:
        overlay 150ms #{motion.$easing-decelerated},
        display 150ms #{motion.$easing-decelerated};
    transition-behavior: allow-discrete;
}

.rui-dialog-modal::backdrop {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    transition:
        background-color 75ms #{motion.$easing-accelerated},
        overlay 75ms #{motion.$easing-accelerated},
        display 75ms #{motion.$easing-accelerated};
    transition-behavior: allow-discrete;
}

.rui-dialog-modal[open]::backdrop {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0.32);
    transition:
        background-color 150ms #{motion.$easing-decelerated},
        overlay 150ms #{motion.$easing-decelerated},
        display 150ms #{motion.$easing-decelerated};
    transition-behavior: allow-discrete;
}

.rui-dialog {
    width: min(560px, calc(100vw - 32px));
    max-height: min(560px, calc(100vh - 96px));
    overflow: hidden;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    transform: scale(1);
    opacity: 1;
    transition:
        opacity 45ms #{motion.$easing-linear},
        transform 150ms #{motion.$easing-decelerated};
}

.rui-dialog-modal[open] .rui-dialog {
    transform: scale(1);
    opacity: 1;
}

@starting-style {
    .rui-dialog-modal[open] .rui-dialog {
        opacity: 0;
        transform: scale(0.8);
    }

    .rui-dialog-modal[open]::backdrop {
        background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    }
}

.rui-dialog__content {
    overflow: auto;
    overscroll-behavior: contain;
}

.rui-dialog__content-body {
    @include typography.body1("--rui-comp-dialog-content");
    margin: 0;
    padding-inline: 24px;
    padding-block-start: calc(36px - 1cap);
    padding-block-end: 28px;
    color: color.$on-surface-medium;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-dialog__footer {
    padding: 0 8px 2px;
}

.rui-dialog__title {
    @include typography.headline6("--rui-comp-dialog-title");
    margin: 0;
    padding-inline: 24px;
    padding-block-start: calc(40px - 1cap);
    color: color.$on-surface;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.rui-dialog--show-header-divider .rui-dialog__header {
    border-bottom: 1px solid color.$on-surface-outline;
}

.rui-dialog--with-footer .rui-dialog__footer {
    padding-top: 2px;
}

.rui-dialog--show-footer-divider .rui-dialog__footer {
    border-top: 1px solid color.$on-surface-outline;
}
</style>
