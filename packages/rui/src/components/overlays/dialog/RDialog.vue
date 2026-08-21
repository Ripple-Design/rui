<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, useId, useSlots, watch } from "vue"

import RButtonRow from "@/components/actions/button/RButtonRow.vue"
import RModal from "@/primitives/modal/RModal.vue"
import { useResizeObserver } from "@/utils/useResizeObserver.ts"

import type { RDialogProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"

const props = withDefaults(defineProps<RDialogProps>(), {
    modelValue: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
    width: "auto",
    height: "auto",
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
const surfaceRef = ref<InstanceType<typeof RSurface> | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const autoWidth = ref<number | null>(null)
const titleId = useId()
const descriptionId = useId()
const hasOverflow = ref(false)
const atTop = ref(true)
const atBottom = ref(true)
const hasHeader = computed(() => !!slots.header || !!slots.title || !!props.title)
const hasFooter = computed(() => !!slots.footer || !!slots.actions)
const hasMessage = computed(() => !!slots.message || props.message !== undefined)
const hasContent = computed(() => !hasMessage.value && !!slots.default)
const hasDescription = computed(() => hasContent.value || hasMessage.value)
const labelledby = computed(() => (hasHeader.value ? titleId : props.ariaLabelledBy))
const describedby = computed(() => (hasDescription.value ? descriptionId : props.ariaDescribedBy))
const showHeaderDivider = computed(() => hasHeader.value && hasOverflow.value && !atTop.value)
const showFooterDivider = computed(() => hasFooter.value && hasOverflow.value && !atBottom.value)
const style = computed(() => ({
    ...(props.width === "auto"
        ? autoWidth.value === null
            ? {}
            : { "--rui-comp-dialog-width": `${autoWidth.value}px` }
        : { "--rui-comp-dialog-width": `${props.width * 56}px` }),
    ...(props.height === "auto" ? {} : { "--rui-comp-dialog-height": `${props.height * 56}px` }),
}))
const classes = computed(() => [
    "rui-dialog",
    {
        "rui-dialog--with-header": hasHeader.value,
        "rui-dialog--with-footer": hasFooter.value,
        "rui-dialog--measuring-auto-width": props.width === "auto" && autoWidth.value === null,
        "rui-dialog--has-content-overflow": hasOverflow.value,
        "rui-dialog--show-header-divider": showHeaderDivider.value,
        "rui-dialog--show-footer-divider": showFooterDivider.value,
    },
])

function closeWithAction(action: string) {
    modalRef.value?.close({ reason: "action", action })
}

function updateScrollState() {
    const content = contentRef.value
    if (!content || !hasDescription.value) {
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

function updateAutoWidth() {
    if (props.width !== "auto") return

    const surface = surfaceRef.value?.$el
    if (!(surface instanceof HTMLElement) || !surface.offsetWidth) return

    autoWidth.value = Math.min(560, Math.max(280, Math.ceil(surface.offsetWidth / 56) * 56))
}

function scheduleAutoWidthUpdate() {
    requestAnimationFrame(updateAutoWidth)
}

function handleOpen() {
    scheduleAutoWidthUpdate()
    scheduleScrollStateUpdate()
    emit("open")
}

useResizeObserver(contentRef, () => {
    scheduleScrollStateUpdate()
})

watch(
    () => props.width,
    () => {
        autoWidth.value = null
        scheduleAutoWidthUpdate()
    },
)

watch(
    () => props.message,
    () => {
        if (props.width !== "auto") return

        autoWidth.value = null
        scheduleAutoWidthUpdate()
    },
)

onUpdated(() => {
    scheduleScrollStateUpdate()
})

onMounted(() => {
    scheduleAutoWidthUpdate()
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
        <RSurface ref="surfaceRef" :class="classes" :style="style" :elevation="24">
            <header v-if="hasHeader" class="rui-dialog__header">
                <slot name="header">
                    <h2 :id="titleId" class="rui-dialog__title">
                        <slot name="title">{{ title }}</slot>
                    </h2>
                </slot>
            </header>

            <div
                v-if="hasDescription"
                :id="descriptionId"
                ref="contentRef"
                class="rui-dialog__content"
                @scroll="updateScrollState"
            >
                <p v-if="hasMessage" class="rui-dialog__message">
                    <slot name="message">{{ message }}</slot>
                </p>
                <slot v-else />
            </div>

            <footer v-if="hasFooter" class="rui-dialog__footer">
                <slot name="footer">
                    <RButtonRow v-if="$slots.actions" class="rui-dialog__actions" justify="flex-end">
                        <slot name="actions" :close="closeWithAction" />
                    </RButtonRow>
                </slot>
            </footer>
        </RSurface>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";
@use "@/styles/motion";
@use "@/styles/breakpoints" as breakpoint;

:global(.rui-dialog-modal) {
    --rui-comp-dialog-viewport-margin: 16px;

    margin: auto;
    padding: var(--rui-comp-dialog-viewport-margin);
    overflow: visible;
    transition:
        overlay 150ms #{motion.$easing-decelerated},
        display 150ms #{motion.$easing-decelerated};
    transition-behavior: allow-discrete;
}

@include breakpoint.up(md) {
    :global(.rui-dialog-modal) {
        --rui-comp-dialog-viewport-margin: 24px;
    }
}

:global(.rui-dialog-modal::backdrop) {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    transition:
        background-color 75ms #{motion.$easing-accelerated},
        overlay 75ms #{motion.$easing-accelerated},
        display 75ms #{motion.$easing-accelerated};
    transition-behavior: allow-discrete;
}

:global(.rui-dialog-modal[open]::backdrop) {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0.32);
    transition:
        background-color 150ms #{motion.$easing-decelerated},
        overlay 150ms #{motion.$easing-decelerated},
        display 150ms #{motion.$easing-decelerated};
    transition-behavior: allow-discrete;
}

:global(.rui-dialog.rui-surface) {
    --rui-comp-dialog-available-width: calc(100vw - (var(--rui-comp-dialog-viewport-margin) * 2));
    --rui-comp-dialog-available-height: calc(100vh - (var(--rui-comp-dialog-viewport-margin) * 2));
    --rui-comp-dialog-auto-width: min(
        var(--rui-comp-dialog-available-width),
        560px,
        max(280px, round(down, var(--rui-comp-dialog-available-width), 56px))
    );

    width: min(var(--rui-comp-dialog-width, var(--rui-comp-dialog-auto-width)), var(--rui-comp-dialog-available-width));
    height: var(--rui-comp-dialog-height, auto);
    max-height: min(var(--rui-comp-dialog-height, 560px), var(--rui-comp-dialog-available-height));
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: scale(0.8);
    opacity: 0;
    transition:
        opacity 75ms #{motion.$easing-accelerated},
        transform 150ms #{motion.$easing-accelerated};
}

:global(.rui-dialog.rui-surface.rui-dialog--measuring-auto-width) {
    width: fit-content;
    min-width: min(280px, var(--rui-comp-dialog-available-width));
    max-width: min(560px, var(--rui-comp-dialog-available-width));
}

:global(.rui-dialog-modal[open] .rui-dialog) {
    transform: scale(1);
    opacity: 1;
    transition:
        opacity 45ms #{motion.$easing-linear},
        transform 150ms #{motion.$easing-decelerated};
}

@starting-style {
    :global(.rui-dialog-modal[open] .rui-dialog) {
        opacity: 0;
        transform: scale(0.8);
    }

    :global(.rui-dialog-modal[open]::backdrop) {
        background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    }
}

.rui-dialog__header,
.rui-dialog__footer {
    flex: 0 0 auto;
}

.rui-dialog__content {
    flex: 0 1 auto;
    min-height: 0;
    overflow: visible;
    padding-inline: var(--rui-comp-dialog-content-padding-inline, 24px);
}

.rui-dialog--has-content-overflow .rui-dialog__content {
    overflow: auto;
    overscroll-behavior: contain;
}

.rui-dialog__message {
    @include typography.body1("--rui-comp-dialog-message");
    margin: 0;
    padding-inline: 0;
    padding-block-end: 28px;
    color: color.$on-surface-medium;
    text-box-trim: trim-both;
    text-box-edge: text alphabetic;
}

.rui-dialog__footer {
    margin-block-start: auto;
}

.rui-dialog__title {
    @include typography.headline6("--rui-comp-dialog-title");
    margin: 0;
    padding-inline: 24px;
    padding-block-start: calc(40px - 1cap);
    padding-block-end: 24px;
    color: color.$on-surface;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-dialog--show-header-divider .rui-dialog__header {
    border-bottom: 1px solid color.$on-surface-outline;
}

.rui-dialog--show-footer-divider .rui-dialog__footer {
    border-top: 1px solid color.$on-surface-outline;
}
</style>
