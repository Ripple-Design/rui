<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type StyleValue } from "vue"

import type { RLinearProgressIndicatorDirection, RLinearProgressIndicatorProps } from "./types"

import { normalizeBuffer, normalizeProgress, resolveProgressbarAria } from "./shared"

type LinearProgressIndicatorPhase = "determinate" | "indeterminate" | "draining"
type LinearProgressIndicatorResolvedDirection = {
    active: "forward" | "reverse"
    determinate: "forward" | "reverse"
}
type LinearProgressIndicatorRevealDuration = "medium" | "large"
type LinearProgressIndicatorDrainSnapshot = {
    direction: "forward" | "reverse"
    determinateDirection: "forward" | "reverse"
    primaryBarTime: number
    primaryInnerTime: number
    secondaryBarTime: number
    secondaryInnerTime: number
}

const INDETERMINATE_DURATION_MS = 1800
const DRAINING_LANE_COUNT = 2
const DETERMINATE_REVEAL_FRAME_COUNT = 2

const props = withDefaults(defineProps<RLinearProgressIndicatorProps>(), {
    buffer: 1,
    closed: false,
    direction: "start-to-end",
    indeterminate: false,
    progress: 0,
    query: false,
})

const primaryBarRef = ref<HTMLElement | null>(null)
const primaryBarInnerRef = ref<HTMLElement | null>(null)
const secondaryBarRef = ref<HTMLElement | null>(null)
const secondaryBarInnerRef = ref<HTMLElement | null>(null)

function resolveDirection(direction: RLinearProgressIndicatorDirection): LinearProgressIndicatorResolvedDirection {
    const rootDirection =
        typeof document === "undefined" ? "ltr" : document.documentElement.dir === "rtl" ? "rtl" : "ltr"

    switch (direction) {
        case "left-to-right":
            return { active: "forward", determinate: "forward" }
        case "right-to-left":
            return { active: "reverse", determinate: "reverse" }
        case "start-to-end":
            return rootDirection === "rtl"
                ? { active: "reverse", determinate: "reverse" }
                : { active: "forward", determinate: "forward" }
        case "end-to-start":
            return rootDirection === "rtl"
                ? { active: "forward", determinate: "forward" }
                : { active: "reverse", determinate: "reverse" }
    }

    return { active: "forward", determinate: "forward" }
}

const resolvedDirection = computed(() => resolveDirection(props.direction))
const phase = ref<LinearProgressIndicatorPhase>(props.indeterminate || props.query ? "indeterminate" : "determinate")
const liveDirection = ref<"forward" | "reverse">(props.query ? "reverse" : resolvedDirection.value.active)
const drainSnapshot = ref<LinearProgressIndicatorDrainSnapshot | null>(null)
const drainingLaneCount = ref(0)
const animationEpoch = ref(0)
const determinateRevealProgress = ref(0)
const determinateRevealDuration = ref<LinearProgressIndicatorRevealDuration>("medium")

let determinateRevealFrame = 0

const progress = computed(() => normalizeProgress(props.progress))
const buffer = computed(() => normalizeBuffer(props.buffer))
const showIndeterminateLayer = computed(() => phase.value !== "determinate")
const activeDirection = computed<"forward" | "reverse">(() => drainSnapshot.value?.direction ?? liveDirection.value)
const effectiveDeterminateDirection = computed<"forward" | "reverse">(
    () => drainSnapshot.value?.determinateDirection ?? resolvedDirection.value.determinate,
)
const determinateProgress = computed(() => (phase.value === "determinate" ? determinateRevealProgress.value : 0))
const aria = computed(() =>
    resolveProgressbarAria(props.closed, showIndeterminateLayer.value, progress.value, buffer.value),
)
const rootClasses = computed(() => [
    "rui-linear-progress-indicator",
    {
        "rui-linear-progress-indicator--closed": props.closed,
        "rui-linear-progress-indicator--determinate": phase.value === "determinate",
        "rui-linear-progress-indicator--indeterminate": phase.value === "indeterminate",
        "rui-linear-progress-indicator--draining": phase.value === "draining",
        "rui-linear-progress-indicator--active-reversed": activeDirection.value === "reverse",
        "rui-linear-progress-indicator--determinate-reversed": effectiveDeterminateDirection.value === "reverse",
    },
])
const determinateBarStyle = computed<StyleValue>(() => ({
    transform: `scaleX(${determinateProgress.value})`,
    transitionDuration:
        determinateRevealDuration.value === "large"
            ? "var(--rui-sys-motion-duration-large-in)"
            : "var(--rui-sys-motion-duration-medium-in)",
}))
const trackStyle = computed<StyleValue>(() => ({
    flexBasis: `${(phase.value === "determinate" ? buffer.value : 1) * 100}%`,
}))
const indeterminateKey = computed(() => `${phase.value}-${activeDirection.value}-${animationEpoch.value}`)
const primaryBarStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.primaryBarTime}ms` }
        : {},
)
const primaryInnerStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.primaryInnerTime}ms` }
        : {},
)
const secondaryBarStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.secondaryBarTime}ms` }
        : {},
)
const secondaryInnerStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.secondaryInnerTime}ms` }
        : {},
)

function readAnimationTime(element: HTMLElement | null) {
    const animation = element?.getAnimations()[0]
    const currentTime = animation?.currentTime

    if (typeof currentTime !== "number") {
        return 0
    }

    return ((currentTime % INDETERMINATE_DURATION_MS) + INDETERMINATE_DURATION_MS) % INDETERMINATE_DURATION_MS
}

function cancelDeterminateReveal() {
    if (determinateRevealFrame) {
        cancelAnimationFrame(determinateRevealFrame)
        determinateRevealFrame = 0
    }
}

function restartDeterminateReveal() {
    cancelDeterminateReveal()

    let remainingFrames = DETERMINATE_REVEAL_FRAME_COUNT

    const step = () => {
        if (remainingFrames > 0) {
            remainingFrames -= 1
            determinateRevealFrame = window.requestAnimationFrame(step)
            return
        }

        determinateRevealFrame = 0
        determinateRevealProgress.value = progress.value
    }

    determinateRevealFrame = window.requestAnimationFrame(step)
}

function startIndeterminate(direction: "forward" | "reverse") {
    cancelDeterminateReveal()
    determinateRevealDuration.value = "medium"
    determinateRevealProgress.value = progress.value
    liveDirection.value = direction
    drainSnapshot.value = null
    drainingLaneCount.value = 0
    phase.value = "indeterminate"
    animationEpoch.value += 1
}

function startDraining(direction: "forward" | "reverse") {
    determinateRevealDuration.value = props.query ? "large" : "medium"
    drainSnapshot.value = {
        direction,
        determinateDirection: resolvedDirection.value.determinate,
        primaryBarTime: readAnimationTime(primaryBarRef.value),
        primaryInnerTime: readAnimationTime(primaryBarInnerRef.value),
        secondaryBarTime: readAnimationTime(secondaryBarRef.value),
        secondaryInnerTime: readAnimationTime(secondaryBarInnerRef.value),
    }
    drainingLaneCount.value = DRAINING_LANE_COUNT
    phase.value = "draining"
    animationEpoch.value += 1
}

function stopDraining() {
    determinateRevealProgress.value = 0
    phase.value = "determinate"
    restartDeterminateReveal()
    drainSnapshot.value = null
    drainingLaneCount.value = 0
}

function handleLaneAnimationEnd(event: AnimationEvent) {
    if (phase.value !== "draining" || event.target !== event.currentTarget) {
        return
    }

    drainingLaneCount.value = Math.max(0, drainingLaneCount.value - 1)

    if (drainingLaneCount.value === 0) {
        stopDraining()
    }
}

onBeforeUnmount(() => {
    cancelDeterminateReveal()
})

watch(
    () => props.progress,
    () => {
        if (phase.value === "determinate") {
            determinateRevealProgress.value = progress.value
        }
    },
    { immediate: true },
)

watch(
    () => [props.indeterminate, props.query, props.direction] as const,
    (nextState, previousState) => {
        const [nextIndeterminate, nextQuery, nextDirectionProp] = nextState
        const [prevIndeterminate, prevQuery, prevDirectionProp] = previousState ?? [false, false, nextDirectionProp]
        const nextResolvedDirection = resolveDirection(nextDirectionProp)
        const prevResolvedDirection = resolveDirection(prevDirectionProp)
        const nextWantsIndeterminate = nextIndeterminate || nextQuery
        const prevWantsIndeterminate = prevIndeterminate || prevQuery

        if (nextWantsIndeterminate) {
            if (
                phase.value !== "indeterminate" ||
                !prevWantsIndeterminate ||
                nextResolvedDirection.active !== prevResolvedDirection.active
            ) {
                startIndeterminate(nextResolvedDirection.active)
                return
            }

            liveDirection.value = nextResolvedDirection.active
            return
        }

        if (prevWantsIndeterminate && phase.value === "indeterminate") {
            startDraining(prevResolvedDirection.active)
            return
        }

        cancelDeterminateReveal()
        determinateRevealDuration.value = "medium"
        determinateRevealProgress.value = progress.value
        drainSnapshot.value = null
        drainingLaneCount.value = 0
        phase.value = "determinate"
    },
    { immediate: true },
)
</script>

<template>
    <div
        :class="rootClasses"
        role="progressbar"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        :aria-hidden="aria.ariaHidden"
        :aria-valuemin="aria.ariaValueMin"
        :aria-valuemax="aria.ariaValueMax"
        :aria-valuenow="aria.ariaValueNow"
    >
        <div class="rui-linear-progress-indicator__buffer">
            <div class="rui-linear-progress-indicator__track" :style="trackStyle" />
            <div class="rui-linear-progress-indicator__buffer-dots" />
        </div>

        <div class="rui-linear-progress-indicator__determinate-bar" :style="determinateBarStyle" />

        <div
            v-if="showIndeterminateLayer"
            :key="indeterminateKey"
            class="rui-linear-progress-indicator__indeterminate-layer"
        >
            <div
                ref="primaryBarRef"
                class="rui-linear-progress-indicator__indeterminate-bar rui-linear-progress-indicator__indeterminate-bar--primary"
                :style="primaryBarStyle"
                @animationend="handleLaneAnimationEnd"
            >
                <span
                    ref="primaryBarInnerRef"
                    class="rui-linear-progress-indicator__indeterminate-bar-inner"
                    :style="primaryInnerStyle"
                />
            </div>
            <div
                ref="secondaryBarRef"
                class="rui-linear-progress-indicator__indeterminate-bar rui-linear-progress-indicator__indeterminate-bar--secondary"
                :style="secondaryBarStyle"
                @animationend="handleLaneAnimationEnd"
            >
                <span
                    ref="secondaryBarInnerRef"
                    class="rui-linear-progress-indicator__indeterminate-bar-inner"
                    :style="secondaryInnerStyle"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-linear-progress-indicator {
    position: relative;
    inline-size: 100%;
    block-size: 4px;
    overflow: hidden;
    transform: translateZ(0) scaleY(1);
    transform-origin: center bottom;
    color: var(--rui-sys-color-primary);
    opacity: 1;
    transition:
        opacity var(--rui-sys-motion-duration-medium-out) var(--rui-sys-motion-easing-accelerated),
        transform var(--rui-sys-motion-duration-medium-out) var(--rui-sys-motion-easing-accelerated);

    &--closed {
        opacity: 0;
        transform: translateZ(0) scaleY(0);
    }
}

.rui-linear-progress-indicator__buffer,
.rui-linear-progress-indicator__determinate-bar,
.rui-linear-progress-indicator__indeterminate-layer,
.rui-linear-progress-indicator__indeterminate-bar,
.rui-linear-progress-indicator__indeterminate-bar-inner {
    position: absolute;
    inset: 0;
}

.rui-linear-progress-indicator__buffer {
    display: flex;
    overflow: hidden;
}

.rui-linear-progress-indicator__track {
    flex: 0 1 100%;
    background-color: currentColor;
    opacity: 0.24;
    transition: flex-basis #{motion.$duration-medium-in} #{motion.$easing-standard};
}

.rui-linear-progress-indicator__buffer-dots {
    flex: auto;
    background-image: radial-gradient(circle at 2px 2px, currentColor 2px, transparent 2px);
    background-repeat: repeat-x;
    background-size: 10px 4px;
    opacity: 0.24;
    transform: rotate(180deg);
    animation: rui-linear-progress-indicator-buffering 250ms infinite linear;
}

.rui-linear-progress-indicator__determinate-bar {
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: center left;
    transition: transform #{motion.$duration-medium-in} #{motion.$easing-standard};
}

.rui-linear-progress-indicator--determinate-reversed .rui-linear-progress-indicator__determinate-bar {
    transform-origin: center right;
}

.rui-linear-progress-indicator--indeterminate .rui-linear-progress-indicator__determinate-bar,
.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__determinate-bar {
    opacity: 0;
}

.rui-linear-progress-indicator__indeterminate-layer {
    pointer-events: none;
}

.rui-linear-progress-indicator__indeterminate-bar {
    inline-size: 100%;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-fill-mode: none;
    transform-origin: center left;
}

.rui-linear-progress-indicator__indeterminate-bar-inner {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    background-color: currentColor;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-fill-mode: none;
}

.rui-linear-progress-indicator__indeterminate-bar--primary {
    left: -145.166611%;
}

.rui-linear-progress-indicator__indeterminate-bar--secondary {
    left: -54.888891%;
}

.rui-linear-progress-indicator--indeterminate .rui-linear-progress-indicator__indeterminate-bar--primary {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-translate;
}

.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--primary
    > .rui-linear-progress-indicator__indeterminate-bar-inner {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-scale;
}

.rui-linear-progress-indicator--indeterminate .rui-linear-progress-indicator__indeterminate-bar--secondary {
    animation-name: rui-linear-progress-indicator-secondary-indeterminate-translate;
}

.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--secondary
    > .rui-linear-progress-indicator__indeterminate-bar-inner {
    animation-name: rui-linear-progress-indicator-secondary-indeterminate-scale;
}

.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__indeterminate-bar {
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__indeterminate-bar-inner {
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__indeterminate-bar--primary {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-translate;
}

.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__indeterminate-bar--primary
    > .rui-linear-progress-indicator__indeterminate-bar-inner {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-scale;
}

.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__indeterminate-bar--secondary {
    animation-name: rui-linear-progress-indicator-secondary-indeterminate-translate;
}

.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__indeterminate-bar--secondary
    > .rui-linear-progress-indicator__indeterminate-bar-inner {
    animation-name: rui-linear-progress-indicator-secondary-indeterminate-scale;
}

.rui-linear-progress-indicator--active-reversed .rui-linear-progress-indicator__buffer-dots {
    transform: rotate(0);
    animation-name: rui-linear-progress-indicator-buffering-reverse;
}

.rui-linear-progress-indicator--active-reversed .rui-linear-progress-indicator__indeterminate-bar {
    right: 0;
    left: auto;
    transform-origin: center right;
}

.rui-linear-progress-indicator--active-reversed .rui-linear-progress-indicator__indeterminate-bar--primary {
    right: -145.166611%;
    left: auto;
}

.rui-linear-progress-indicator--active-reversed .rui-linear-progress-indicator__indeterminate-bar--secondary {
    right: -54.888891%;
    left: auto;
}

.rui-linear-progress-indicator--active-reversed.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--primary,
.rui-linear-progress-indicator--active-reversed.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__indeterminate-bar--primary {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-translate-reverse;
}

.rui-linear-progress-indicator--active-reversed.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--secondary,
.rui-linear-progress-indicator--active-reversed.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__indeterminate-bar--secondary {
    animation-name: rui-linear-progress-indicator-secondary-indeterminate-translate-reverse;
}

@keyframes rui-linear-progress-indicator-buffering {
    from {
        transform: rotate(180deg) translateX(calc(4px * -2.5));
    }
}

@keyframes rui-linear-progress-indicator-buffering-reverse {
    from {
        transform: translateX(-10px);
    }
}

@keyframes rui-linear-progress-indicator-primary-indeterminate-translate {
    0% {
        transform: translateX(0);
    }

    70.39% {
        animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
        transform: translateX(0);
    }

    85.19% {
        animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
        transform: translateX(83.67142%);
    }

    100% {
        transform: translateX(200.611057%);
    }
}

@keyframes rui-linear-progress-indicator-primary-indeterminate-scale {
    0% {
        transform: scaleX(0.08);
    }

    55.56% {
        animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
        transform: scaleX(0.08);
    }

    87.06% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transform: scaleX(0.661479);
    }

    100% {
        transform: scaleX(0.08);
    }
}

@keyframes rui-linear-progress-indicator-secondary-indeterminate-translate {
    0% {
        animation-timing-function: cubic-bezier(0, 0, 0.65, 1);
        transform: translateX(0);
    }

    18.5% {
        transform: translateX(37.651913%);
    }

    65.72% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateX(84.386165%);
    }

    100% {
        transform: translateX(160.277782%);
    }
}

@keyframes rui-linear-progress-indicator-secondary-indeterminate-scale {
    0% {
        animation-timing-function: cubic-bezier(0.1, 0, 0.45, 1);
        transform: scaleX(0.08);
    }

    18.5% {
        transform: scaleX(0.457104);
    }

    41.67% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transform: scaleX(0.72796);
    }

    100% {
        transform: scaleX(0.08);
    }
}

@keyframes rui-linear-progress-indicator-primary-indeterminate-translate-reverse {
    0% {
        transform: translateX(0);
    }

    20% {
        animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
        transform: translateX(0);
    }

    59.15% {
        animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
        transform: translateX(-83.67142%);
    }

    100% {
        transform: translateX(-200.611057%);
    }
}

@keyframes rui-linear-progress-indicator-secondary-indeterminate-translate-reverse {
    0% {
        animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
        transform: translateX(0);
    }

    25% {
        animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
        transform: translateX(-37.651913%);
    }

    48.35% {
        animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
        transform: translateX(-84.386165%);
    }

    100% {
        transform: translateX(-160.277782%);
    }
}
</style>
