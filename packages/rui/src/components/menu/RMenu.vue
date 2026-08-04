<script setup lang="ts">
import {
    cloneVNode,
    computed,
    defineComponent,
    onMounted,
    ref,
    useId,
    useSlots,
    watch,
    type Slots,
    type VNode,
} from "vue"

import RMenuLayer from "@/foundations/menu/RMenuLayer.vue"

import type { RMenuProps } from "./types"

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
const open = ref(props.open)

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

    requestOpen(true)
}

function toggleMenu() {
    if (props.disabled) {
        return
    }

    requestOpen(!open.value)
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

onMounted(() => {
    if (!slots.trigger) {
        throw new Error("[RMenu] The trigger slot is required.")
    }
})
</script>

<template>
    <TriggerRenderer />

    <RMenuLayer
        :align="align"
        :disabled="disabled"
        :id="menuId"
        :dismissal-boundary="triggerRef"
        :open="open"
        :placement="`bottom-${align}`"
        :reference="triggerRef"
        @update:open="handleLayerOpenUpdate"
        @open="emit('open')"
        @close="emit('close')"
    >
        <slot />
    </RMenuLayer>
</template>
