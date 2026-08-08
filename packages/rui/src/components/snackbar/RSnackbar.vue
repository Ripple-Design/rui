<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

import RButton from "@/components/button/RButton.vue"

import type {
    RSnackbarCloseDetail,
    RSnackbarDismissReason,
    RSnackbarProps,
} from "./types"

const props = withDefaults(defineProps<RSnackbarProps>(), {
    modelValue: false,
    message: "",
    duration: "short",
    animation: "fade",
    actionLabel: "",
    dismissReason: "manual",
    swipeDismissible: true,
})

const emit = defineEmits<{
    (event: "update:modelValue", value: boolean): void
    (event: "action"): void
    (event: "close", detail: RSnackbarCloseDetail): void
    (event: "shown"): void
    (event: "dismissed", detail: RSnackbarCloseDetail): void
}>()

const snackbarRef = ref<HTMLElement | null>(null)
const isMultiline = ref(false)
const isStacked = ref(false)
const translateX = ref(0)
const dragging = ref(false)
const pointerId = ref<number | null>(null)
const pointerStartX = ref(0)
const pointerStartY = ref(0)
const width = ref(0)
const visualState = ref<"shown" | "leaving">("shown")
const isOpen = ref(false)
let timeout: ReturnType<typeof setTimeout> | undefined
let lifecycleTimer: ReturnType<typeof setTimeout> | undefined
let resizeObserver: ResizeObserver | undefined
let lifecycleState: "closed" | "entering" | "shown" | "leaving" = "closed"

const durationMs = computed(() => {
    if (props.duration === "indefinite") return null
    if (props.duration === "short") return 1500
    if (props.duration === "long") return 2750
    return props.duration > 0 ? props.duration : 2750
})

const style = computed(() => ({
    "--rui-comp-snackbar-translate-x": `${translateX.value}px`,
    "--rui-comp-snackbar-slide-offset": "calc(100% + 8px)",
}))

function clearTimer() {
    if (timeout !== undefined) {
        clearTimeout(timeout)
        timeout = undefined
    }
}

function scheduleTimer() {
    clearTimer()
    if (!props.modelValue || durationMs.value === null) return

    timeout = setTimeout(() => requestClose("timeout"), durationMs.value)
}

function clearLifecycleTimer() {
    if (lifecycleTimer !== undefined) {
        clearTimeout(lifecycleTimer)
        lifecycleTimer = undefined
    }
}

function completeEnter() {
    if (lifecycleState !== "entering") return
    lifecycleState = "shown"
    emit("shown")
    scheduleTimer()
}

function completeLeave() {
    if (lifecycleState !== "leaving") return
    lifecycleState = "closed"
    isOpen.value = false
    nextTick(() => emit("dismissed", { reason: props.dismissReason }))
}

function handleTransitionEnd(event: TransitionEvent) {
    if (event.target !== snackbarRef.value || lifecycleState !== "leaving") return

    const property = props.animation === "slide" ? "transform" : "opacity"
    if (event.propertyName === property) {
        completeLeave()
    }
}

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function transitionDuration(duration: number) {
    return prefersReducedMotion() ? 0 : duration
}

function animationDuration() {
    return props.animation === "slide" ? 250 : 150
}

function startEnter() {
    clearLifecycleTimer()
    lifecycleState = "entering"
    visualState.value = "shown"
    nextTick(() => {
        setupResizeObserver()
        updateLayout()
        const open = () => {
            isOpen.value = true
        }
        if (typeof requestAnimationFrame === "undefined") {
            open()
        } else {
            requestAnimationFrame(open)
        }
        lifecycleTimer = setTimeout(completeEnter, transitionDuration(animationDuration()))
    })
}

function startLeave() {
    clearTimer()
    clearLifecycleTimer()
    if (lifecycleState === "closed") return
    lifecycleState = "leaving"
    visualState.value = "leaving"
    lifecycleTimer = setTimeout(
        completeLeave,
        transitionDuration(props.animation === "slide" ? 300 : 125),
    )
}


function requestClose(reason: RSnackbarDismissReason) {
    clearTimer()
    emit("update:modelValue", false)
    emit("close", { reason })
}

function handleAction() {
    emit("action")
    requestClose("action")
}

function handlePointerDown(event: PointerEvent) {
    if (!props.swipeDismissible || !snackbarRef.value) return

    clearTimer()
    pointerId.value = event.pointerId
    pointerStartX.value = event.clientX
    pointerStartY.value = event.clientY
    width.value = snackbarRef.value.offsetWidth
    dragging.value = false
    snackbarRef.value.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
    if (pointerId.value !== event.pointerId || !snackbarRef.value) return

    const deltaX = event.clientX - pointerStartX.value
    const deltaY = event.clientY - pointerStartY.value
    if (!dragging.value) {
        if (Math.abs(deltaY) > Math.abs(deltaX) || Math.abs(deltaX) < 4) return
        dragging.value = true
    }

    const direction = getComputedStyle(snackbarRef.value).direction === "rtl" ? -1 : 1
    const logicalDelta = deltaX * direction
    translateX.value = Math.max(0, Math.min(logicalDelta, width.value)) * direction
    event.preventDefault()
}

function handlePointerEnd(event: PointerEvent) {
    if (pointerId.value !== event.pointerId) return

    const distance = Math.abs(translateX.value)
    const shouldDismiss = dragging.value && width.value > 0 && distance >= width.value * 0.5
    pointerId.value = null
    dragging.value = false

    if (shouldDismiss) {
        requestClose("swipe")
        return
    }

    translateX.value = 0
    scheduleTimer()
}

function updateLayout() {
    const element = snackbarRef.value
    if (!element) return

    const message = element.querySelector<HTMLElement>(".rui-snackbar__message")
    const action = element.querySelector<HTMLElement>(".rui-snackbar__action")
    if (!message) return

    const lineHeight = Number.parseFloat(getComputedStyle(message).lineHeight)
    isMultiline.value = Number.isFinite(lineHeight)
        ? message.scrollHeight > lineHeight + 1
        : message.scrollHeight > message.clientHeight
    isStacked.value = window.innerWidth < 600 && isMultiline.value && !!action && action.offsetWidth > 128
}

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            startEnter()
        } else {
            startLeave()
        }
    },
    { immediate: true },
)

watch(
    () => [props.message, props.actionLabel, props.duration],
    async () => {
        await nextTick()
        updateLayout()
    },
)

function setupResizeObserver() {
    if (typeof ResizeObserver === "undefined") return
    if (resizeObserver) return
    resizeObserver = new ResizeObserver(updateLayout)
    if (snackbarRef.value) resizeObserver.observe(snackbarRef.value)
}

onMounted(() => {
    setupResizeObserver()
})

onBeforeUnmount(() => {
    clearTimer()
    clearLifecycleTimer()
    resizeObserver?.disconnect()
})

defineExpose({
    dismiss: requestClose,
})
</script>

<template>
    <div
        ref="snackbarRef"
        class="rui-snackbar__motion"
        :class="[
            {
                'rui-snackbar--open': isOpen,
                'rui-snackbar--stacked': isStacked,
                'rui-snackbar--dragging': dragging,
            },
            `rui-snackbar--${animation}`,
            `rui-snackbar--${visualState}`,
        ]"
        :style="style"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerEnd"
        @pointercancel="handlePointerEnd"
        @transitionend="handleTransitionEnd"
    >
        <div class="rui-snackbar__content">
            <span class="rui-snackbar__message">{{ message }}</span>
            <RButton
            v-if="actionLabel"
            class="rui-snackbar__action"
            variant="text"
            sentence-case
            @click.stop="handleAction"
        >
            {{ actionLabel }}
        </RButton>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/elevations";
@use "@/styles/motion";
@use "@/styles/typography";

.rui-snackbar__motion {
    --rui-comp-snackbar-background: color-mix(
        in srgb,
        #{color.$surface} 20%,
        #{color.$on-surface} 80%
    );
    --rui-comp-snackbar-content-color: #{color.$surface};
    --rui-comp-snackbar-action-color: #{color.$primary};
    --rui-comp-snackbar-action-alpha: 0.5;

    @include typography.body2("--rui-comp-snackbar-message");

    display: none;
    align-items: center;
    inline-size: 100%;
    box-sizing: border-box;
    min-block-size: 48px;
    padding-inline: 8px;
    border-radius: 4px;
    background: var(--rui-comp-snackbar-background);
    box-shadow: #{elevations.shadow(6)};
    color: var(--rui-comp-snackbar-content-color);
    pointer-events: auto;
    touch-action: pan-y;
    opacity: 1;
    transform: scale(1) translateX(var(--rui-comp-snackbar-translate-x));
    transition:
        opacity 150ms #{motion.$easing-linear},
        transform 150ms #{motion.$easing-decelerated},
        display 150ms allow-discrete;
    transition-behavior: allow-discrete;
    user-select: none;
}

.rui-snackbar__content {
    display: flex;
    align-items: center;
    inline-size: 100%;
}

.rui-snackbar__message {
    flex: 1 1 auto;
    margin-inline: 8px;
    padding-block: 14px;
    overflow: hidden;
    color: inherit;
}

.rui-snackbar__action {
    --rui-button-color: rgb(from var(--rui-comp-snackbar-action-color) r g b / var(--rui-comp-snackbar-action-alpha));
    --rui-button-padding-inline-start: 8px;
    --rui-button-padding-inline-end: 8px;

    flex: 0 0 auto;
    min-inline-size: 48px;
}

.rui-snackbar--stacked {
    align-items: stretch;
    flex-direction: column;
}

.rui-snackbar--stacked .rui-snackbar__message {
    padding-block: 16px 2px;
}

.rui-snackbar--dragging {
    transition: none !important;
}

.rui-snackbar--open {
    display: flex;
}

@starting-style {
    .rui-snackbar--fade.rui-snackbar--open:not(.rui-snackbar--leaving) {
        opacity: 0;
        transform: scale(0.8) translateX(var(--rui-comp-snackbar-translate-x));
    }

    .rui-snackbar--slide.rui-snackbar--open:not(.rui-snackbar--leaving) {
        opacity: 0;
        transform: translateY(var(--rui-comp-snackbar-slide-offset)) translateX(var(--rui-comp-snackbar-translate-x));
    }
}

.rui-snackbar--fade.rui-snackbar--leaving {
    opacity: 0;
    transition:
        opacity 75ms #{motion.$easing-linear},
        display 75ms allow-discrete;
    transition-behavior: allow-discrete;
}

.rui-snackbar--slide {
    transition:
        transform 250ms #{motion.$easing-standard},
        display 250ms allow-discrete;
    transition-behavior: allow-discrete;
}

.rui-snackbar--slide.rui-snackbar--leaving {
    transform: translateY(var(--rui-comp-snackbar-slide-offset)) translateX(var(--rui-comp-snackbar-translate-x));
}

.rui-snackbar--slide .rui-snackbar__content {
    opacity: 1;
    transition: opacity 180ms #{motion.$easing-linear} 70ms;
}

.rui-snackbar--slide.rui-snackbar--leaving .rui-snackbar__content {
    opacity: 0;
    transition-delay: 0ms;
}

@starting-style {
    .rui-snackbar--slide.rui-snackbar--open .rui-snackbar__content {
        opacity: 0;
    }
}

@media (min-width: 600px) {
    .rui-snackbar__motion {
        inline-size: auto;
        min-inline-size: 320px;
        max-inline-size: 576px;
    }

    .rui-snackbar__message {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rui-snackbar__motion,
    .rui-snackbar--leaving,
    .rui-snackbar--slide {
        transition-duration: 0ms;
        transition-delay: 0ms;
    }
}
</style>
