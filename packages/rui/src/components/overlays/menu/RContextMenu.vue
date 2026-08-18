<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue"

import { createFloatingVirtualReference, type RFloatingReference } from "@/foundations/floating"

import type { RContextMenuInstance, RContextMenuPoint, RContextMenuProps } from "./types.ts"

import RMenuLayer from "../../../foundations/menu/RMenuLayer.vue"

const props = withDefaults(defineProps<RContextMenuProps>(), {
    align: "end",
    disabled: false,
    open: false,
})

const emit = defineEmits<{
    (e: "update:open", value: boolean): void
    (e: "open"): void
    (e: "close"): void
}>()

const open = ref(props.open)
const reference = ref<RFloatingReference | null>(null)
const usesVirtualReference = ref(false)
const dismissalBoundary = ref<HTMLElement | null>(null)
const offset = ref(0)
const placement = ref<"bottom-start" | "bottom-end" | "right-start">("right-start")

watch(
    () => props.open,
    (value) => {
        open.value = value
    },
)

function requestOpen(value: boolean) {
    open.value = value
    emit("update:open", value)
}

function handleLayerOpenUpdate(value: boolean) {
    requestOpen(value)
}

function handleViewportResize() {
    if (!open.value || !usesVirtualReference.value) {
        return
    }

    requestOpen(false)
}

function attachViewportListeners() {
    if (typeof window === "undefined") {
        return
    }

    window.addEventListener("resize", handleViewportResize)
    window.visualViewport?.addEventListener("resize", handleViewportResize)
}

function detachViewportListeners() {
    if (typeof window === "undefined") {
        return
    }

    window.removeEventListener("resize", handleViewportResize)
    window.visualViewport?.removeEventListener("resize", handleViewportResize)
}

watch(
    [open, usesVirtualReference],
    () => {
        detachViewportListeners()
        if (open.value && usesVirtualReference.value) {
            attachViewportListeners()
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    detachViewportListeners()
})

function isHTMLElement(value: unknown): value is HTMLElement {
    return typeof HTMLElement !== "undefined" && value instanceof HTMLElement
}

function resolveEventBoundary(event: MouseEvent | PointerEvent) {
    if (typeof HTMLElement === "undefined") {
        return null
    }

    if (isHTMLElement(event.currentTarget)) {
        return event.currentTarget
    }

    return isHTMLElement(event.target) ? event.target : null
}

function openAt(event: MouseEvent | PointerEvent): void
function openAt(element: HTMLElement): void
function openAt(point: RContextMenuPoint): void
function openAt(anchor: MouseEvent | PointerEvent | HTMLElement | RContextMenuPoint) {
    if (props.disabled) {
        return
    }

    if (isHTMLElement(anchor)) {
        reference.value = anchor
        usesVirtualReference.value = false
        dismissalBoundary.value = anchor
        offset.value = 8
        placement.value = `bottom-${props.align}`
        requestOpen(true)
        return
    }

    if (anchor instanceof MouseEvent || anchor instanceof PointerEvent) {
        if (anchor.type === "contextmenu") {
            anchor.preventDefault()
        }

        const contextElement = resolveEventBoundary(anchor)
        reference.value = createFloatingVirtualReference({
            clientX: anchor.clientX,
            clientY: anchor.clientY,
            contextElement: contextElement ?? undefined,
        })
        usesVirtualReference.value = true
        dismissalBoundary.value = contextElement
        offset.value = 0
        placement.value = "right-start"
        requestOpen(true)
        return
    }

    reference.value = createFloatingVirtualReference(anchor)
    usesVirtualReference.value = true
    dismissalBoundary.value = anchor.contextElement ?? null
    offset.value = 0
    placement.value = "right-start"
    requestOpen(true)
}

function close() {
    requestOpen(false)
}

defineExpose<RContextMenuInstance>({
    close,
    openAt,
})

const resolvedPlacement = computed(() => placement.value)
</script>

<template>
    <RMenuLayer
        :align="align"
        :disabled="disabled"
        :dismissal-boundary="dismissalBoundary"
        :open="open"
        :offset="offset"
        :placement="resolvedPlacement"
        :reference="reference"
        @update:open="handleLayerOpenUpdate"
        @open="emit('open')"
        @close="emit('close')"
    >
        <slot />
    </RMenuLayer>
</template>
