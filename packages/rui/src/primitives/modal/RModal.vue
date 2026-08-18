<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, useAttrs } from "vue"

import { floatingPortalTargetKey, RTeleport } from "@/foundations/floating"
import { RUI_MODAL_ACTION_ATTRIBUTE } from "@/primitives/modal/constants.ts"
import { useModal } from "@/primitives/modal/useModal.ts"
import { getActionTarget, getActionValue, isBackdropClick } from "@/primitives/modal/useModalDismiss.ts"
import { useReturnFocus } from "@/primitives/modal/useReturnFocus.ts"

import type { RModalCloseDetail, RModalCloseReason, RModalProps } from "./types.ts"

const props = withDefaults(defineProps<RModalProps>(), {
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
    (e: "before-close", detail: RModalCloseDetail): void
    (e: "close", detail: RModalCloseDetail): void
}>()

const attrs = useAttrs()
const dialogRef = ref<HTMLDialogElement | null>(null)
provide(floatingPortalTargetKey, dialogRef)
const pendingClose = ref<RModalCloseDetail | null>(null)
const { capture, restore } = useReturnFocus()

const model = computed(() => props.modelValue)
const resolvedInitialFocus = computed(() => props.initialFocus)
const ariaLabel = computed(() => props.ariaLabel)
const ariaLabelledby = computed(() => props.ariaLabelledBy)
const ariaDescribedby = computed(() => props.ariaDescribedBy)
const role = computed(() => props.role)

function focusInitialTarget() {
    const dialog = dialogRef.value
    if (!dialog) return

    const target = resolvedInitialFocus.value

    if (typeof target === "string") {
        dialog.querySelector<HTMLElement>(target)?.focus()
        return
    }

    if (target instanceof HTMLElement) {
        target.focus()
        return
    }

    dialog.focus()
}

async function afterOpen() {
    focusInitialTarget()
    await nextTick()
    emit("open")
}

function requestClose(detail: RModalCloseDetail) {
    const dialog = dialogRef.value
    if (!dialog?.open) return

    pendingClose.value = detail
    emit("before-close", detail)
    dialog.close(detail.action ?? detail.reason)
}

useModal(dialogRef, model, {
    onBeforeOpen() {
        capture()
        emit("before-open")
    },
    onAfterOpen: afterOpen,
    onRequestClose() {
        requestClose({ reason: "programmatic" })
    },
})

function handleCancel(event: Event) {
    if (!props.closeOnEscape) {
        event.preventDefault()
        return
    }

    event.preventDefault()
    requestClose({ reason: "cancel" })
}

function handleWheel(event: WheelEvent) {
    if (event.target instanceof Element && event.target.closest("[data-rui-modal-scrollable], .rui-dialog__content")) {
        return
    }

    event.preventDefault()
}

function handleClick(event: MouseEvent) {
    const actionTarget = getActionTarget(event.target)
    if (actionTarget) {
        requestClose({
            reason: "action",
            action: getActionValue(actionTarget),
        })
        return
    }

    const dialog = dialogRef.value
    if (!dialog || !props.closeOnBackdrop) return

    if (isBackdropClick(event, dialog)) {
        requestClose({ reason: "backdrop" })
    }
}

function handleClose() {
    const detail = pendingClose.value ?? { reason: "programmatic" as RModalCloseReason }
    pendingClose.value = null
    restore(props.returnFocus)
    emit("update:modelValue", false)
    emit("close", detail)
}

defineExpose({
    open() {
        if (!props.modelValue) {
            emit("update:modelValue", true)
        }
    },
    close(detail?: Partial<RModalCloseDetail>) {
        requestClose({
            reason: detail?.reason ?? "programmatic",
            action: detail?.action,
        })
    },
    element: dialogRef,
})

onMounted(() => {
    if (!dialogRef.value) return
    if (!dialogRef.value.hasAttribute("tabindex")) {
        dialogRef.value.tabIndex = -1
    }
})
</script>

<template>
    <RTeleport portal="modal">
        <dialog
            ref="dialogRef"
            class="rui-modal"
            v-bind="attrs"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-describedby="ariaDescribedby"
            :role="role"
            @cancel="handleCancel"
            @click="handleClick"
            @close="handleClose"
            @wheel="handleWheel"
        >
            <slot />
        </dialog>
    </RTeleport>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

:global(.rui-modal) {
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
}

:global(.rui-modal::backdrop) {
    background-color: rgba(0 0 0 / 0.32);
}
</style>
