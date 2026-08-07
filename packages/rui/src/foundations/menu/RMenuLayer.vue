<script setup lang="ts">
import { offset, flip, shift, size, type Placement } from "@floating-ui/dom"
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

const MENU_VIEWPORT_INSET = 48
const MENU_HORIZONTAL_VIEWPORT_INSET = 4
const menuViewportPadding = {
    bottom: MENU_VIEWPORT_INSET,
    left: MENU_HORIZONTAL_VIEWPORT_INSET,
    right: MENU_HORIZONTAL_VIEWPORT_INSET,
    top: MENU_VIEWPORT_INSET,
}

const props = withDefaults(
    defineProps<{
        align?: "start" | "end"
        dismissalBoundary?: HTMLElement | null
        disabled?: boolean
        id?: string
        mode?: "menu" | "listbox"
        matchWidth?: boolean
        open: boolean
        offset?: number
        placement: Placement
        reference: RFloatingReference | null
        restoreFocus?: boolean
    }>(),
    {
        align: "start",
        disabled: false,
        mode: "menu",
        matchWidth: false,
        offset: 8,
        restoreFocus: true,
    },
)

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
const popupWidth = ref(0)

const overlayStack = useOverlayStack()
const layer = overlayStack.register()
const { capture, restore } = useFloatingFocus()
const { context, focusFirst, hasGroups } = useMenuState(open, disabled)

provide(menuKey, context)

const menuClasses = computed(() => [
    "rui-menu",
    `rui-menu--align-${props.align}`,
    {
        "rui-menu--grouped": hasGroups.value,
        "rui-menu--match-width": props.matchWidth,
        "rui-menu--open": open.value,
    },
])

const position = useFloatingPosition(reference, floatingRef, {
    middleware: [
        offset(props.offset),
        flip({ padding: menuViewportPadding }),
        shift({ padding: menuViewportPadding }),
        size({
            padding: menuViewportPadding,
            apply({ availableHeight, elements }) {
                elements.floating.style.setProperty("--rui-menu-available-height", `${Math.max(0, availableHeight)}px`)
            },
        }),
    ],
    open,
    placement: computed(() => props.placement),
    strategy: "fixed",
})

const floatingStyles = computed(() => ({
    ...position.floatingStyles.value,
    width: props.matchWidth && popupWidth.value ? `${popupWidth.value}px` : undefined,
    zIndex: layer.zIndex,
}))

let resizeObserver: ResizeObserver | null = null

watch(
    reference,
    (element) => {
        resizeObserver?.disconnect()
        resizeObserver = null

        if (
            !props.matchWidth ||
            typeof HTMLElement === "undefined" ||
            !(element instanceof HTMLElement) ||
            typeof ResizeObserver === "undefined"
        ) {
            return
        }

        resizeObserver = new ResizeObserver(([entry]) => {
            popupWidth.value = entry?.contentRect.width ?? element.getBoundingClientRect().width
        })
        resizeObserver.observe(element)
    },
    { immediate: true },
)

watch(open, async (value, previous) => {
    if (value === previous) {
        return
    }

    overlayStack.setActive(layer.id, value)

    if (value) {
        capture()
        emit("open")
        await nextTick()
        if (props.matchWidth && typeof HTMLElement !== "undefined" && reference.value instanceof HTMLElement) {
            popupWidth.value = reference.value.getBoundingClientRect().width
        }
        await position.update()
        if (props.mode === "menu") {
            focusFirst()
        }
        return
    }

    restore(props.restoreFocus)
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
    if (props.mode === "listbox") {
        return
    }

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
    resizeObserver?.disconnect()
    overlayStack.unregister(layer.id)
})
</script>

<template>
    <RFloatingLayer
        ref="floatingLayerRef"
        :id="id ?? menuId"
        :floating-styles="floatingStyles"
        :open="open"
        :role="mode"
    >
        <RSurface :class="menuClasses" :elevation="8" @keydown="handleMenuKeyDown">
            <slot />
        </RSurface>
    </RFloatingLayer>
</template>

<style scoped lang="scss">
@use "@/styles/motion";
@use "@/styles/scrollbar";

.rui-menu {
    min-inline-size: 112px;
    @include scrollbar.scrollbar;

    max-inline-size: 320px;
    max-block-size: var(--rui-menu-available-height, calc(100dvh - 96px));
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 8px 0;
    opacity: 0;
    transform: scale(0.8);
    transition:
        opacity motion.$duration-small-in motion.$easing-standard,
        transform motion.$duration-small-in motion.$easing-standard;

    &--match-width {
        inline-size: 100%;
        max-inline-size: none;
    }

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
