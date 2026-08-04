<script setup lang="ts">
import { offset, flip, shift, type Placement } from "@floating-ui/dom"
import { computed, nextTick, onBeforeUnmount, provide, ref, useId, watch } from "vue"

import RSurface from "@/components/surface/RSurface.vue"
import {
    RFloatingLayer,
    useDismissableLayer,
    useFloatingFocus,
    useFloatingPosition,
    useOverlayStack,
    type RFloatingReference,
} from "@/foundations/floating"

import { menuKey } from "./types"
import { useMenuState } from "./useMenuState"

const props = withDefaults(defineProps<{
    align?: "start" | "end"
    dismissalBoundary?: HTMLElement | null
    disabled?: boolean
    id?: string
    open: boolean
    offset?: number
    placement: Placement
    reference: RFloatingReference | null
}>(), {
    align: "start",
    disabled: false,
    offset: 8,
})

const emit = defineEmits<{
    (e: "update:open", value: boolean): void
    (e: "open"): void
    (e: "close"): void
}>()

const menuId = useId()
const floatingLayerRef = ref<InstanceType<typeof RFloatingLayer> | null>(null)
const open = computed({
    get: () => props.open,
    set: (value) => emit("update:open", value),
})
const disabled = computed(() => props.disabled)
const reference = computed(() => props.reference)
const dismissalBoundary = computed(() => props.dismissalBoundary ?? null)
const floatingRef = computed(() => floatingLayerRef.value?.element ?? null)

const overlayStack = useOverlayStack()
const layer = overlayStack.register()
const { capture, restore } = useFloatingFocus()
const { context, focusFirst, hasGroups } = useMenuState(open, disabled)

provide(menuKey, context)

const menuClasses = computed(() => [
    "rui-menu",
    `rui-menu--align-${props.align}`,
    { "rui-menu--open": open.value, "rui-menu--grouped": hasGroups.value },
])

const position = useFloatingPosition(reference, floatingRef, {
    middleware: [offset(props.offset), flip(), shift({ padding: 4 })],
    open,
    placement: computed(() => props.placement),
    strategy: "fixed",
})

watch(open, async (value, previous) => {
    if (value === previous) {
        return
    }

    overlayStack.setActive(layer.id, value)

    if (value) {
        capture()
        emit("open")
        await nextTick()
        await position.update()
        focusFirst()
        return
    }

    restore(true)
    emit("close")
})

useDismissableLayer(dismissalBoundary, floatingRef, {
    enabled: open,
    isTopLayer: computed(() => overlayStack.isTopLayer(layer.id)),
    onDismiss() {
        emit("update:open", false)
    },
})

function handleMenuKeyDown(event: KeyboardEvent) {
    const currentId = context.focusedItemId.value
    if (!currentId) {
        return
    }

    if (event.key === "ArrowDown") {
        event.preventDefault()
        context.focusByDirection(currentId, "next")
        return
    }

    if (event.key === "ArrowUp") {
        event.preventDefault()
        context.focusByDirection(currentId, "prev")
        return
    }

    if (event.key === "Home") {
        event.preventDefault()
        context.focusByDirection(currentId, "first")
        return
    }

    if (event.key === "End") {
        event.preventDefault()
        context.focusByDirection(currentId, "last")
        return
    }

    if (event.key === "Escape") {
        event.preventDefault()
        emit("update:open", false)
    }
}

onBeforeUnmount(() => {
    overlayStack.unregister(layer.id)
})
</script>

<template>
    <RFloatingLayer
        ref="floatingLayerRef"
        :id="id ?? menuId"
        :floating-styles="position.floatingStyles.value"
        :open="open"
        role="menu"
    >
        <RSurface :class="menuClasses" :elevation="8" @keydown="handleMenuKeyDown">
            <slot />
        </RSurface>
    </RFloatingLayer>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-menu {
    min-inline-size: 112px;
    max-inline-size: 320px;
    padding: 8px 0;
    opacity: 0;
    transform: scale(0.8);
    transition:
        opacity motion.$duration-small-in motion.$easing-standard,
        transform motion.$duration-small-in motion.$easing-standard;

    &--grouped {
        padding-block: 0;
    }

    &--open {
        opacity: 1;
        transform: scale(1);
    }

    &--align-start {
        transform-origin: top left;
    }

    &--align-end {
        transform-origin: top right;
    }
}
</style>
