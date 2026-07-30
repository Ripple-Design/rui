<script setup lang="ts">
import { offset, flip, shift } from "@floating-ui/dom"
import { Teleport, computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue"

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
const floatingRef = ref<HTMLElement | null>(null)
const open = ref(false)
const hasHover = ref(false)
const hasFocus = ref(false)
const suppressFocus = ref(false)
const portalReady = ref(false)

const overlayStack = useOverlayStack()
const layer = overlayStack.register()
const portalSelector = `#${RUI_FLOATING_PORTAL_ID}`

const position = useFloatingPosition(
    computed(() => props.target ?? null),
    floatingRef,
    {
        middleware: [offset(4), flip(), shift({ padding: 4 })],
        open,
        placement: "top",
        strategy: "fixed",
    },
)

const floatingStyles = computed(() => position.floatingStyles.value)
const shouldMount = computed(() => portalReady.value && !!props.text.trim())

watch(
    [hasHover, hasFocus, suppressFocus, () => props.disabled],
    () => {
        const allowFocusOpen = hasFocus.value && !suppressFocus.value
        open.value = !props.disabled && !!props.text.trim() && (hasHover.value || allowFocusOpen)
        overlayStack.setActive(layer.id, open.value)
    },
    { immediate: true },
)

useDismissableLayer(
    computed(() => props.target ?? null),
    floatingRef,
    {
        enabled: computed(() => shouldMount.value && open.value),
        isTopLayer: computed(() => overlayStack.isTopLayer(layer.id)),
        onDismiss() {
            hasHover.value = false
            hasFocus.value = false
            open.value = false
        },
    },
)

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
}

function handlePointerDown() {
    suppressFocus.value = true
    hasFocus.value = false
}

function handleDocumentKeyDown() {
    suppressFocus.value = false
}

function attachTargetListeners(target: HTMLElement | null) {
    if (!target) {
        return
    }

    target.addEventListener("mouseenter", handleMouseEnter)
    target.addEventListener("mouseleave", handleMouseLeave)
    target.addEventListener("focusin", handleFocusIn)
    target.addEventListener("focusout", handleFocusOut)
    target.addEventListener("pointerdown", handlePointerDown)
}

function detachTargetListeners(target: HTMLElement | null) {
    if (!target) {
        return
    }

    target.removeEventListener("mouseenter", handleMouseEnter)
    target.removeEventListener("mouseleave", handleMouseLeave)
    target.removeEventListener("focusin", handleFocusIn)
    target.removeEventListener("focusout", handleFocusOut)
    target.removeEventListener("pointerdown", handlePointerDown)
}

watch(
    () => props.target,
    (nextTarget, previousTarget) => {
        detachTargetListeners(previousTarget ?? null)
        attachTargetListeners(nextTarget ?? null)
    },
    { immediate: true },
)

watch(
    () => [props.target, open.value] as const,
    ([target, isOpen]) => {
        if (!target) {
            return
        }

        if (isOpen) {
            target.setAttribute("aria-describedby", tooltipId)
            return
        }

        if (target.getAttribute("aria-describedby") === tooltipId) {
            target.removeAttribute("aria-describedby")
        }
    },
    { immediate: true },
)

onMounted(() => {
    ensureFloatingPortalRoot()
    portalReady.value = true
    document.addEventListener("keydown", handleDocumentKeyDown, true)
})

onBeforeUnmount(() => {
    detachTargetListeners(props.target ?? null)
    if (props.target?.getAttribute("aria-describedby") === tooltipId) {
        props.target.removeAttribute("aria-describedby")
    }
    document.removeEventListener("keydown", handleDocumentKeyDown, true)
    overlayStack.unregister(layer.id)
})
</script>

<template>
    <Teleport v-if="portalReady" :to="portalSelector">
        <div
            v-if="shouldMount"
            :id="tooltipId"
            ref="floatingRef"
            class="rui-plain-tooltip-layer"
            :class="{ 'is-open': open }"
            role="tooltip"
            :style="floatingStyles"
        >
            <div class="rui-plain-tooltip">
                {{ text }}
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
@use "@/styles/motion";
@use "@/styles/typography";

.rui-plain-tooltip-layer {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 2500;
    min-inline-size: 32px;
    max-inline-size: 320px;
    min-block-size: 24px;
    padding: 0 8px;
    border-radius: 4px;
    background-color: var(
        --rui-comp-plain-tooltip-background-color,
        color-mix(
            in srgb,
            color-mix(in srgb, var(--rui-sys-color-background) 60%, transparent),
            color-mix(in srgb, var(--rui-sys-color-on-background) 90%, transparent)
        )
    );
    color: var(--rui-sys-color-on-primary);
    opacity: 0;
    transform: scale(0);
    transform-origin: center bottom;
    pointer-events: none;
    transition:
        transform 150ms #{motion.$easing-standard},
        opacity 150ms #{motion.$easing-standard};

    &.is-open {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
    }
}

.rui-plain-tooltip {
    @include typography.caption("--rui-comp-plain-tooltip");

    display: flex;
    align-items: center;
    justify-content: center;
    min-block-size: inherit;
    text-wrap: pretty;
}
</style>
