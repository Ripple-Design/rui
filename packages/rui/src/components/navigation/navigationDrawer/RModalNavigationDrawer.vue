<script setup lang="ts">
import { computed, ref, watch } from "vue"

import type { RModalCloseDetail } from "@/primitives/modal/types.ts"

import RModal from "@/primitives/modal/RModal.vue"

import type { RModalNavigationDrawerProps } from "./types.ts"

import RNavigationDrawerPanel from "./RNavigationDrawerPanel.vue"
import { useNavigationDrawerDrag } from "./useNavigationDrawerDrag.ts"

const props = withDefaults(defineProps<RModalNavigationDrawerProps>(), {
    modelValue: false,
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
    side: "start",
    width: "280px",
    closeOnSelect: false,
    edgeSize: 20,
})

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "update:selected", value: unknown): void
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: RModalCloseDetail): void
    (e: "close", detail: RModalCloseDetail): void
}>()

const modalRef = ref<InstanceType<typeof RModal> | null>(null)
const panelRef = ref<InstanceType<typeof RNavigationDrawerPanel> | null>(null)
const root = computed(() => modalRef.value?.element ?? null)
const selected = ref(props.selected)
const modalOpen = computed(() => props.modelValue)
const side = computed(() => props.side)
const edgeSize = computed(() => props.edgeSize)
const resolvedAriaLabel = computed(() => props.ariaLabel)
const resolvedAriaLabelledBy = computed(() => (resolvedAriaLabel.value ? undefined : props.ariaLabelledBy))
const { dragging, style } = useNavigationDrawerDrag({
    open: modalOpen,
    side,
    panel: computed(() => panelRef.value?.element ?? null),
    root,
    edgeSize,
    requestOpen: () => emit("update:modelValue", true),
    requestClose: () => modalRef.value?.close({ reason: "programmatic" }),
})

watch(
    () => props.selected,
    (value) => {
        selected.value = value
    },
)
watch(selected, (value) => emit("update:selected", value))

defineExpose({
    open() {
        modalRef.value?.open()
    },
    close(detail?: Partial<RModalCloseDetail>) {
        modalRef.value?.close({ reason: detail?.reason ?? "programmatic", action: detail?.action })
    },
})

function handleSelect() {
    if (props.closeOnSelect) modalRef.value?.close({ reason: "programmatic" })
}
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
        class="rui-modal-navigation-drawer"
        :class="{ 'rui-modal-navigation-drawer--dragging': dragging }"
        :style="style"
        @update:model-value="emit('update:modelValue', $event)"
        @before-open="emit('before-open')"
        @open="emit('open')"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
    >
        <RNavigationDrawerPanel
            ref="panelRef"
            v-model="selected"
            :title="title"
            :side="side"
            :width="width"
            :class="['rui-modal-navigation-drawer__panel', `rui-modal-navigation-drawer__panel--${side}`]"
            @select="handleSelect"
        >
            <template v-if="$slots.title" #title><slot name="title" /></template>
            <template v-if="$slots.header" #header><slot name="header" /></template>
            <slot />
        </RNavigationDrawerPanel>
    </RModal>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

:global(.rui-modal-navigation-drawer) {
    --rui-comp-navigation-drawer-progress: 0;
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
        display #{motion.$duration-medium-out} #{motion.$easing-accelerated} allow-discrete,
        overlay #{motion.$duration-medium-out} #{motion.$easing-accelerated} allow-discrete;
}

:global(.rui-modal-navigation-drawer)[open] {
    --rui-comp-navigation-drawer-progress: 1;
    transition:
        display #{motion.$duration-medium-in} #{motion.$easing-decelerated} allow-discrete,
        overlay #{motion.$duration-medium-in} #{motion.$easing-decelerated} allow-discrete;
}

.rui-modal-navigation-drawer__panel {
    position: fixed;
    inset-block: 0;
    block-size: 100%;
    pointer-events: auto;
    will-change: transform;
    transform: translateX(calc((var(--rui-comp-navigation-drawer-progress) - 1) * 100%));
    transition: transform #{motion.$duration-medium-out} #{motion.$easing-accelerated};
}

.rui-modal-navigation-drawer__panel--start {
    inset-inline-start: 0;
}

.rui-modal-navigation-drawer__panel--end {
    inset-inline-end: 0;
    transform: translateX(calc((1 - var(--rui-comp-navigation-drawer-progress)) * 100%));
}

:global(.rui-modal-navigation-drawer[open] .rui-modal-navigation-drawer__panel) {
    transition: transform #{motion.$duration-medium-in} #{motion.$easing-decelerated};
}

:global(.rui-modal-navigation-drawer--dragging) .rui-modal-navigation-drawer__panel {
    transition: none;
}

@starting-style {
    :global(.rui-modal-navigation-drawer[open] .rui-modal-navigation-drawer__panel--start) {
        transform: translateX(-100%);
    }

    :global(.rui-modal-navigation-drawer[open] .rui-modal-navigation-drawer__panel--end) {
        transform: translateX(100%);
    }
}

:global(.rui-modal-navigation-drawer::backdrop) {
    background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    transition: background-color #{motion.$duration-medium-out} #{motion.$easing-accelerated};
}

:global(.rui-modal-navigation-drawer[open]::backdrop) {
    background-color: rgb(
        from var(--rui-sys-color-on-surface) r g b / calc(0.6 * var(--rui-comp-navigation-drawer-progress))
    );
    transition: background-color #{motion.$duration-medium-in} #{motion.$easing-decelerated};
}

@starting-style {
    :global(.rui-modal-navigation-drawer[open]::backdrop) {
        background-color: rgb(from var(--rui-sys-color-on-surface) r g b / 0);
    }
}

@media (prefers-reduced-motion: reduce) {
    :global(.rui-modal-navigation-drawer),
    :global(.rui-modal-navigation-drawer)[open],
    .rui-modal-navigation-drawer__panel,
    :global(.rui-modal-navigation-drawer[open] .rui-modal-navigation-drawer__panel),
    :global(.rui-modal-navigation-drawer::backdrop),
    :global(.rui-modal-navigation-drawer[open]::backdrop) {
        transition: none;
    }
}
</style>
