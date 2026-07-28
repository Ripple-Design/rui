<script setup lang="ts">
import { offset, flip, shift } from "@floating-ui/dom"
import { Teleport, computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue"

import RSurface from "@/components/surface/RSurface.vue"
import {
    ensureFloatingPortalRoot,
    RUI_FLOATING_PORTAL_ID,
    useDismissableLayer,
    useFloatingPosition,
    useOverlayStack,
} from "@/foundations/floating"

import type { RPlainTooltipProps } from "./types"

const props = withDefaults(defineProps<RPlainTooltipProps>(), {
    disabled: false,
})

const tooltipId = useId()
const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const open = ref(false)
const hasHover = ref(false)
const hasFocus = ref(false)
const suppressFocus = ref(false)
const portalReady = ref(false)

const overlayStack = useOverlayStack()
const layer = overlayStack.register()
const portalSelector = `#${RUI_FLOATING_PORTAL_ID}`

const position = useFloatingPosition(triggerRef, floatingRef, {
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    open,
    placement: "top",
    strategy: "fixed",
})

const floatingStyles = computed(() => position.floatingStyles.value)
const describedBy = computed(() => (open.value ? tooltipId : undefined))
const shouldRender = computed(() => portalReady.value && open.value && !!props.text.trim() && !props.disabled)
const triggerAttrs = computed(() => ({
    "aria-describedby": describedBy.value,
}))

watch([hasHover, hasFocus, suppressFocus, () => props.disabled], () => {
    const allowFocusOpen = hasFocus.value && !suppressFocus.value
    open.value = !props.disabled && !!props.text.trim() && (hasHover.value || allowFocusOpen)
}, { immediate: true })

useDismissableLayer(triggerRef, floatingRef, {
    enabled: shouldRender,
    isTopLayer: computed(() => overlayStack.isTopLayer(layer.id)),
    onDismiss() {
        hasHover.value = false
        hasFocus.value = false
        open.value = false
    },
})

function handleMouseEnter() {
    hasHover.value = true
}

function handleMouseLeave() {
    hasHover.value = false
}

function handleFocusIn() {
    if (suppressFocus.value) {
        return
    }

    hasFocus.value = true
}

function handleFocusOut() {
    hasFocus.value = false
    suppressFocus.value = false
}

function handlePointerDown() {
    suppressFocus.value = true
    hasFocus.value = false
}

onMounted(() => {
    ensureFloatingPortalRoot()
    portalReady.value = true
})

onBeforeUnmount(() => {
    overlayStack.unregister(layer.id)
})
</script>

<template>
    <span
        ref="triggerRef"
        class="rui-plain-tooltip-trigger"
        v-bind="triggerAttrs"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
        @pointerdown="handlePointerDown"
    >
        <slot />
    </span>

    <Teleport v-if="portalReady" :to="portalSelector">
        <div
            v-if="shouldRender"
            :id="tooltipId"
            ref="floatingRef"
            class="rui-plain-tooltip-layer"
            role="tooltip"
            :style="floatingStyles"
        >
            <RSurface class="rui-plain-tooltip" :elevation="4">
                {{ text }}
            </RSurface>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-plain-tooltip-trigger {
    display: inline-flex;
}

.rui-plain-tooltip-layer {
    pointer-events: none;
}

.rui-plain-tooltip {
    @include typography.caption("--rui-comp-plain-tooltip");

    max-inline-size: min(280px, calc(100vw - 16px));
    padding: 6px 10px;
    text-wrap: pretty;
    background-color: color.$on-surface;
    color: color.$surface;
}
</style>
