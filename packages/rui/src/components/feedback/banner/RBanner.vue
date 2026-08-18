<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue"

import RButton from "@/components/actions/button/RButton.vue"
import RButtonRow from "@/components/actions/button/RButtonRow.vue"

import type { RBannerProps } from "./types.ts"

import RIcon from "../../base/icon/RIcon.vue"

type BannerLayout = "single-line" | "multiline-side" | "multiline-below"
type LifecycleState = "closed" | "delayed-enter" | "entering" | "shown" | "delayed-leave" | "leaving"

const props = withDefaults(defineProps<RBannerProps>(), {
    lines: 1,
    leftAction: "",
    rightAction: "",
})

const emit = defineEmits<{
    (event: "update:modelValue", value: boolean): void
    (event: "left-action", value: MouseEvent): void
    (event: "right-action", value: MouseEvent): void
    (event: "shown"): void
    (event: "dismissed"): void
}>()

const motionRef = ref<HTMLElement | null>(null)
const bannerRef = ref<HTMLElement | null>(null)
const messageRef = ref<HTMLElement | null>(null)
const actionsRef = ref<InstanceType<typeof RButtonRow> | null>(null)
const isRendered = ref(false)
const isOpen = ref(false)
const layout = ref<BannerLayout>("multiline-below")
const bannerHeight = ref(0)
let lifecycle: LifecycleState = "closed"
let delayTimer: ReturnType<typeof setTimeout> | undefined
let completionTimer: ReturnType<typeof setTimeout> | undefined
let resizeObserver: ResizeObserver | undefined
let requestId: number | undefined

const hasIcon = computed(() => !!props.icon)
const hasActions = computed(() => !!props.leftAction || !!props.rightAction)
const classes = computed(() => [
    "rui-banner__motion",
    `rui-banner--${layout.value}`,
    `rui-banner--lines-${props.lines}`,
    {
        "rui-banner--with-icon": hasIcon.value,
        "rui-banner--open": isOpen.value,
    },
])
const style = computed(() => ({
    "--rui-comp-banner-height": `${bannerHeight.value}px`,
    "--rui-comp-banner-message-lines": props.lines,
}))

function clearTimers() {
    if (delayTimer !== undefined) {
        clearTimeout(delayTimer)
        delayTimer = undefined
    }
    if (completionTimer !== undefined) {
        clearTimeout(completionTimer)
        completionTimer = undefined
    }
}

function cancelAnimationFrame() {
    if (requestId !== undefined && typeof window !== "undefined") {
        window.cancelAnimationFrame(requestId)
        requestId = undefined
    }
}

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function animationDuration(direction: "enter" | "leave") {
    if (prefersReducedMotion()) return 0
    return direction === "enter" ? 180 : 160
}

function queueFrame(callback: () => void) {
    if (typeof window === "undefined") {
        callback()
        return
    }
    requestId = window.requestAnimationFrame(() => {
        requestId = undefined
        callback()
    })
}

function updateLayout() {
    const banner = bannerRef.value
    const message = messageRef.value
    const actions = actionsRef.value?.$el as HTMLElement | undefined
    if (!banner || !message) return

    const width = banner.clientWidth
    if (width <= 0) return

    const wide = width >= 720
    const iconWidth = hasIcon.value ? 56 : 0
    const messageStart = hasIcon.value ? 24 : wide ? 24 : 16
    const messageEndSingle = wide ? 90 : 36
    const actionElements = actions?.querySelectorAll<HTMLElement>(".rui-banner__action")
    const actionsWidth = hasActions.value
        ? Array.from(actionElements ?? []).reduce((total, action) => total + action.offsetWidth, 0)
        : 0
    const messageWidth = message.scrollWidth
    const availableForSingle = width - iconWidth - actionsWidth

    if (props.lines === 1 && availableForSingle >= messageWidth + messageStart + messageEndSingle) {
        layout.value = "single-line"
    } else if (wide && actionsWidth <= width / 2) {
        layout.value = "multiline-side"
    } else {
        layout.value = "multiline-side"
    }

    nextTick(() => {
        bannerHeight.value = banner.offsetHeight
    })
}

function completeEnter() {
    if (lifecycle !== "entering") return
    lifecycle = "shown"
    emit("shown")
}

function completeLeave() {
    if (lifecycle !== "leaving") return
    lifecycle = "closed"
    isOpen.value = false
    queueFrame(() => {
        if (lifecycle !== "closed") return
        isRendered.value = false
        emit("dismissed")
    })
}

function scheduleCompletion(direction: "enter" | "leave") {
    completionTimer = setTimeout(direction === "enter" ? completeEnter : completeLeave, animationDuration(direction))
}

async function startEnter() {
    clearTimers()
    cancelAnimationFrame()
    lifecycle = "entering"
    isRendered.value = true
    isOpen.value = false
    await nextTick()
    updateLayout()
    await nextTick()
    queueFrame(() => {
        if (lifecycle !== "entering") return
        isOpen.value = true
        scheduleCompletion("enter")
    })
}

function startLeave() {
    clearTimers()
    cancelAnimationFrame()
    if (!isRendered.value || lifecycle === "closed") {
        lifecycle = "closed"
        isOpen.value = false
        isRendered.value = false
        return
    }
    lifecycle = "leaving"
    isOpen.value = false
    scheduleCompletion("leave")
}

function requestVisibility(open: boolean, delay = 0) {
    if (open && (lifecycle === "shown" || lifecycle === "entering" || lifecycle === "delayed-enter")) return
    if (!open && (lifecycle === "closed" || lifecycle === "leaving" || lifecycle === "delayed-leave")) return

    clearTimers()
    cancelAnimationFrame()

    if (open) {
        lifecycle = "delayed-enter"
        delayTimer = setTimeout(startEnter, Math.max(0, delay))
    } else {
        lifecycle = "delayed-leave"
        delayTimer = setTimeout(startLeave, Math.max(0, delay))
    }
}

function show(delay = 0) {
    emit("update:modelValue", true)
    requestVisibility(true, delay)
}

function dismiss(delay = 0) {
    emit("update:modelValue", false)
    requestVisibility(false, delay)
}

function handleTransitionEnd(event: TransitionEvent) {
    if (event.target !== motionRef.value || event.propertyName !== "block-size") return
    if (lifecycle === "entering") completeEnter()
    if (lifecycle === "leaving") completeLeave()
}

watch(
    () => props.modelValue,
    (open) => requestVisibility(open),
    { immediate: true },
)

watch(
    () => [props.message, props.lines, props.icon, props.leftAction, props.rightAction],
    async () => {
        await nextTick()
        updateLayout()
    },
)

watch(isRendered, async (rendered) => {
    if (!rendered || !bannerRef.value || typeof ResizeObserver === "undefined") return
    resizeObserver ??= new ResizeObserver(updateLayout)
    resizeObserver.observe(bannerRef.value)
    await nextTick()
    updateLayout()
})

onBeforeUnmount(() => {
    clearTimers()
    cancelAnimationFrame()
    resizeObserver?.disconnect()
})

defineExpose({ show, dismiss })
</script>

<template>
    <div v-if="isRendered" ref="motionRef" :class="classes" :style="style" @transitionend="handleTransitionEnd">
        <section ref="bannerRef" class="rui-banner">
            <div class="rui-banner__content">
                <span v-if="icon" class="rui-banner__icon-container">
                    <RIcon class="rui-banner__icon" :icon="icon" :size="24" emphasis="inherit" decorative />
                </span>

                <span ref="messageRef" class="rui-banner__message">{{ message }}</span>

                <RButtonRow v-if="hasActions" ref="actionsRef" class="rui-banner__actions" justify="flex-end">
                    <RButton
                        v-if="leftAction"
                        class="rui-banner__action rui-banner__action--left"
                        variant="text"
                        @click="emit('left-action', $event)"
                    >
                        {{ leftAction }}
                    </RButton>
                    <RButton
                        v-if="rightAction"
                        class="rui-banner__action rui-banner__action--right"
                        variant="text"
                        @click="emit('right-action', $event)"
                    >
                        {{ rightAction }}
                    </RButton>
                </RButtonRow>
            </div>
            <div class="rui-banner__divider" />
        </section>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/typography";

.rui-banner__motion {
    --rui-comp-banner-height: 0px;
    /* @cssvar Banner surface background color. */
    --rui-comp-banner-background: var(--rui-sys-color-surface);
    /* @cssvar Banner message text color. */
    --rui-comp-banner-message-color: var(--rui-sys-color-on-surface-high);
    /* @cssvar Banner action text color. */
    --rui-comp-banner-action-color: var(--rui-sys-color-primary);
    /* @cssvar Banner divider color. */
    --rui-comp-banner-divider-color: var(--rui-sys-color-on-surface);
    --rui-comp-banner-enter-duration: 180ms;
    --rui-comp-banner-leave-duration: 160ms;

    display: block;
    block-size: 0;
    overflow: clip;
    will-change: block-size;
    transition: block-size var(--rui-comp-banner-enter-duration) var(--rui-sys-motion-easing-standard);
}

.rui-banner--open {
    block-size: var(--rui-comp-banner-height);
}

.rui-banner__motion:not(.rui-banner--open) {
    transition-duration: var(--rui-comp-banner-leave-duration);
}

.rui-banner {
    box-sizing: border-box;
    background: var(--rui-comp-banner-background);
    will-change: transform;
    transform: translateY(calc(-1 * var(--rui-comp-banner-height)));
    transition: transform var(--rui-comp-banner-enter-duration) var(--rui-sys-motion-easing-standard);
}

.rui-banner--open .rui-banner {
    transform: translateY(0);
}

.rui-banner__motion:not(.rui-banner--open) .rui-banner {
    transition-duration: var(--rui-comp-banner-leave-duration);
}

.rui-banner__content {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    padding-block-start: 24px;
}

.rui-banner__icon-container {
    display: grid;
    grid-column: 1;
    place-items: center;
    inline-size: 40px;
    block-size: 40px;
    margin-inline-start: 16px;
    border-radius: 50%;
    background: var(--rui-sys-color-primary);
    color: var(--rui-sys-color-on-primary);
}

.rui-banner__icon {
    color: inherit;
}

.rui-banner__message {
    @include typography.body2("--rui-comp-banner-message");

    display: -webkit-box;
    grid-column: 2;
    min-inline-size: 0;
    overflow: hidden;
    margin-inline: 24px 16px;
    color: var(--rui-comp-banner-message-color);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--rui-comp-banner-message-lines);
    line-clamp: var(--rui-comp-banner-message-lines);
}

.rui-banner__actions.rui-button-row {
    grid-column: 3;
    grid-row: 1;
    align-self: end;
}

.rui-banner__action {
    flex: 0 0 auto;
}

.rui-banner__action :deep(.rui-button) {
    --rui-button-color: var(--rui-comp-banner-action-color);
    --rui-button-padding-inline-start: 8px;
    --rui-button-padding-inline-end: 8px;

    min-inline-size: 0;
}

.rui-banner__divider {
    block-size: 1px;
    background: color-mix(in srgb, var(--rui-comp-banner-divider-color) 12%, transparent);
}

.rui-banner--lines-1 .rui-banner {
    block-size: 52px;
}

.rui-banner--lines-1 .rui-banner__content {
    block-size: 51px;
}

.rui-banner--with-icon.rui-banner--lines-1 .rui-banner {
    block-size: 72px;
}

.rui-banner--with-icon.rui-banner--lines-1 .rui-banner__content {
    block-size: 71px;
}

.rui-banner--lines-2 .rui-banner {
    block-size: 72px;
}

.rui-banner--lines-2 .rui-banner__content {
    block-size: 71px;
}

.rui-banner--lines-3 .rui-banner {
    block-size: 90px;
}

.rui-banner--lines-3 .rui-banner__content {
    block-size: 89px;
}

.rui-banner--single-line .rui-banner__content {
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: baseline;
    padding-block-start: 10px;
}

.rui-banner--single-line .rui-banner__message {
    grid-column: 2;
    margin-inline-end: 36px;
}

.rui-banner--single-line:not(.rui-banner--with-icon) .rui-banner__content {
    padding-block-start: 16px;
}

.rui-banner--single-line .rui-banner__actions,
.rui-banner--multiline-side .rui-banner__actions {
    grid-column: 3;
    grid-row: 1;
    align-self: end;
    margin-block-start: 0;
}

@media (min-width: 720px) {
    .rui-banner__content {
        padding-block-start: 16px;
    }

    .rui-banner__message {
        margin-inline-start: 24px;
        margin-inline-end: 90px;
    }

    .rui-banner__icon-container + .rui-banner__message {
        margin-inline-start: 24px;
    }

    .rui-banner--single-line .rui-banner__content {
        padding-block-start: 8px;
    }

    .rui-banner--single-line .rui-banner__message {
        margin-inline-end: 90px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rui-banner__motion,
    .rui-banner {
        transition-duration: 0ms;
        transition-delay: 0ms;
    }
}
</style>
