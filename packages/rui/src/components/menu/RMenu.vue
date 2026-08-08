<script setup lang="ts">
import {
    cloneVNode,
    computed,
    defineComponent,
    onMounted,
    ref,
    useId,
    watch,
    type VNode,
} from "vue"

import RMenuLayer from "@/foundations/menu/RMenuLayer.vue"

import type { RMenuProps, RMenuSlots } from "./types"

const props = withDefaults(defineProps<RMenuProps>(), {
    align: "start",
    disabled: false,
    mode: "menu",
    open: false,
    restoreFocus: true,
})

const emit = defineEmits<{
    (e: "update:open", value: boolean): void
    (e: "open"): void
    (e: "close"): void
}>()

const slots = defineSlots<RMenuSlots>()
const triggerId = useId()
const generatedMenuId = useId()
const menuId = computed(() => props.id ?? generatedMenuId)
const triggerRef = ref<HTMLElement | null>(null)
const menuLayerRef = ref<InstanceType<typeof RMenuLayer> | null>(null)
const resolvedReference = computed(() => props.reference ?? triggerRef.value)
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
                "aria-haspopup": props.mode === "listbox" ? "listbox" : "menu",
                id: triggerId,
                onClick: toggleMenu,
                onKeydown: handleTriggerKeyDown,
                ref: setTriggerRef,
            })
        }
    },
})

onMounted(() => {
    if (!slots.trigger && !props.reference && props.mode === "menu") {
        throw new Error("[RMenu] Provide either a trigger slot or a reference element.")
    }
})

defineExpose({
    element: computed(() => menuLayerRef.value?.element ?? null),
    updatePosition: () => menuLayerRef.value?.updatePosition(),
})
</script>

<template>
    <TriggerRenderer />

    <RMenuLayer
        ref="menuLayerRef"
        :align="align"
        :disabled="disabled"
        :id="menuId"
        :mode="mode"
        :offset="mode === 'listbox' ? 0 : undefined"
        :match-width="matchWidth"
        :dismissal-boundary="resolvedReference"
        :open="open"
        :placement="`bottom-${align}`"
        :reference="resolvedReference"
        :restore-focus="restoreFocus"
        @update:open="handleLayerOpenUpdate"
        @open="emit('open')"
        @close="emit('close')"
    >
        <slot />
    </RMenuLayer>
</template>
