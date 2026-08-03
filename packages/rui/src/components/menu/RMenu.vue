<script setup lang="ts">
import { offset, flip, shift } from "@floating-ui/dom"
import {
    cloneVNode,
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useId,
    useSlots,
    watch,
    type Slots,
    type VNode,
} from "vue"

import RSurface from "@/components/surface/RSurface.vue"
import {
    RFloatingLayer,
    useDismissableLayer,
    useFloatingFocus,
    useFloatingPosition,
    useOverlayStack,
} from "@/foundations/floating"

import { menuKey, type RMenuProps } from "./types"
import { useMenuState } from "./useMenuState"

const props = withDefaults(defineProps<RMenuProps>(), {
    align: "start",
    disabled: false,
    open: false,
})

const emit = defineEmits<{
    (e: "update:open", value: boolean): void
    (e: "open"): void
    (e: "close"): void
}>()

const slots: Slots = useSlots()
const triggerId = useId()
const menuId = useId()
const triggerRef = ref<HTMLElement | null>(null)
const floatingLayerRef = ref<InstanceType<typeof RFloatingLayer> | null>(null)
const open = ref(props.open)

const overlayStack = useOverlayStack()
const layer = overlayStack.register()
const { capture, restore } = useFloatingFocus()
const { context, focusFirst, hasGroups } = useMenuState(
    open,
    computed(() => props.disabled),
)

provide(menuKey, context)

const floatingRef = computed(() => floatingLayerRef.value?.element ?? null)
const resolvedPlacement = computed(() => `bottom-${props.align}` as const)
const menuClasses = computed(() => [
    "rui-menu",
    `rui-menu--align-${props.align}`,
    { "rui-menu--open": open.value, "rui-menu--grouped": hasGroups.value },
])

const position = useFloatingPosition(triggerRef, floatingRef, {
    middleware: [offset(8), flip(), shift({ padding: 4 })],
    open,
    placement: resolvedPlacement,
    strategy: "fixed",
})

watch(
    () => props.open,
    (value) => {
        open.value = value
    },
)

watch(open, async (value, previous) => {
    if (value === previous) {
        return
    }

    overlayStack.setActive(layer.id, value)
    emit("update:open", value)

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

useDismissableLayer(triggerRef, floatingRef, {
    enabled: open,
    isTopLayer: computed(() => overlayStack.isTopLayer(layer.id)),
    onDismiss() {
        open.value = false
    },
})

function setTriggerRef(element: Element | import("vue").ComponentPublicInstance | null) {
    if (element instanceof HTMLElement) {
        triggerRef.value = element
        return
    }

    const host = (element as { $el?: unknown } | null)?.$el
    triggerRef.value = host instanceof HTMLElement ? host : null
}

function openMenu() {
    if (props.disabled) {
        return
    }

    open.value = true
}

function toggleMenu() {
    if (props.disabled) {
        return
    }

    open.value = !open.value
}

function handleTriggerKeyDown(event: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        if (!open.value) {
            openMenu()
        }
    }
}

function resolveSingleTriggerVNode(): VNode | null {
    const triggerNodes = slots.trigger?.().filter((node: VNode) => typeof node.type !== "symbol")
    if (!triggerNodes?.length) {
        return null
    }

    if (triggerNodes.length !== 1) {
        throw new Error("[RMenu] The trigger slot must have exactly one root node.")
    }

    return triggerNodes[0] as VNode
}

const TriggerRenderer = defineComponent({
    name: "RMenuTriggerRenderer",
    setup() {
        return () => {
            const node = resolveSingleTriggerVNode()
            if (!node) {
                return null
            }

            return cloneVNode(node, {
                "aria-controls": menuId,
                "aria-expanded": open.value ? "true" : "false",
                "aria-haspopup": "menu",
                id: triggerId,
                onClick: toggleMenu,
                onKeydown: handleTriggerKeyDown,
                ref: setTriggerRef,
            })
        }
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
        open.value = false
    }
}

onMounted(() => {
    if (!slots.trigger) {
        throw new Error("[RMenu] The trigger slot is required.")
    }
})

onBeforeUnmount(() => {
    overlayStack.unregister(layer.id)
})
</script>

<template>
    <TriggerRenderer />

    <RFloatingLayer
        ref="floatingLayerRef"
        :id="menuId"
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
