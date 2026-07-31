<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type StyleValue } from "vue"

import { normalizeBuffer, normalizeProgress, resolveProgressbarAria } from "./shared"

import type { RLinearProgressIndicatorProps } from "./types"

type LinearProgressIndicatorPhase = "determinate" | "indeterminate" | "draining"
type LinearProgressIndicatorDirection = "forward" | "reverse"
type LinearProgressIndicatorRevealDuration = "medium" | "large"
type LinearProgressIndicatorDrainSnapshot = {
    direction: LinearProgressIndicatorDirection
    determinateDirection: LinearProgressIndicatorDirection
    primaryBarTime: number
    primaryInnerTime: number
    secondaryBarTime: number
    secondaryInnerTime: number
}

const INDETERMINATE_DURATION_MS = 2000
const DRAINING_LANE_COUNT = 2
const DETERMINATE_REVEAL_FRAME_COUNT = 2

const props = withDefaults(defineProps<RLinearProgressIndicatorProps>(), {
    buffer: 1,
    closed: false,
    indeterminate: false,
    progress: 0,
    query: false,
    reversed: false,
})

const primaryBarRef = ref<HTMLElement | null>(null)
const primaryBarInnerRef = ref<HTMLElement | null>(null)
const secondaryBarRef = ref<HTMLElement | null>(null)
const secondaryBarInnerRef = ref<HTMLElement | null>(null)
const determinateBarRef = ref<HTMLElement | null>(null)

const phase = ref<LinearProgressIndicatorPhase>(props.indeterminate || props.query ? "indeterminate" : "determinate")
const liveDirection = ref<LinearProgressIndicatorDirection>(props.query || props.reversed ? "reverse" : "forward")
const drainSnapshot = ref<LinearProgressIndicatorDrainSnapshot | null>(null)
const drainingLaneCount = ref(0)
const animationEpoch = ref(0)
const determinateRevealProgress = ref(0)
const determinateRevealDuration = ref<LinearProgressIndicatorRevealDuration>("medium")

let determinateRevealFrame = 0

const progress = computed(() => normalizeProgress(props.progress))
const buffer = computed(() => normalizeBuffer(props.buffer))
const showIndeterminateLayer = computed(() => phase.value !== "determinate")
const activeDirection = computed<LinearProgressIndicatorDirection>(() => drainSnapshot.value?.direction ?? liveDirection.value)
const effectiveDeterminateDirection = computed<LinearProgressIndicatorDirection>(() =>
    drainSnapshot.value?.determinateDirection ?? (props.reversed ? "reverse" : "forward"),
)
const determinateProgress = computed(() =>
    phase.value === "determinate" ? determinateRevealProgress.value : 0,
)
const aria = computed(() =>
    resolveProgressbarAria(props.closed, showIndeterminateLayer.value, progress.value, buffer.value),
)
const debugStartTime = typeof performance !== "undefined" ? performance.now() : 0

function logDebug(stage: string, details: Record<string, unknown> = {}) {
    if (!import.meta.env.DEV) {
        return
    }

    console.log("[RLinearProgressIndicator]", stage, {
        activeDirection: activeDirection.value,
        buffer: buffer.value,
        closed: props.closed,
        determinateProgress: determinateProgress.value,
        determinateRevealProgress: determinateRevealProgress.value,
        direction: effectiveDeterminateDirection.value,
        drainingLaneCount: drainingLaneCount.value,
        phase: phase.value,
        progress: progress.value,
        revealFrame: determinateRevealFrame,
        t: Math.round((typeof performance !== "undefined" ? performance.now() : 0) - debugStartTime),
        wantsIndeterminate: props.indeterminate || props.query,
        ...details,
    })
}

function describeAnimation(element: HTMLElement | null) {
    const animation = element?.getAnimations()[0]
    const timing = animation?.effect?.getComputedTiming?.()

    return {
        currentTime: animation?.currentTime ?? null,
        delay: timing?.delay ?? null,
        duration: timing?.duration ?? null,
        endTime: timing?.endTime ?? null,
        fill: timing?.fill ?? null,
        iterations: timing?.iterations ?? null,
        progress: timing?.progress ?? null,
        playState: animation?.playState ?? null,
    }
}
const rootClasses = computed(() => [
    "rui-linear-progress-indicator",
    {
        "rui-linear-progress-indicator--closed": props.closed,
        "rui-linear-progress-indicator--determinate": phase.value === "determinate",
        "rui-linear-progress-indicator--indeterminate": phase.value === "indeterminate",
        "rui-linear-progress-indicator--draining": phase.value === "draining",
        "rui-linear-progress-indicator--reversed": activeDirection.value === "reverse",
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
const bufferStyle = computed<StyleValue>(() => ({
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
        logDebug("cancel-determinate-reveal", { revealFrame: determinateRevealFrame })
        cancelAnimationFrame(determinateRevealFrame)
        determinateRevealFrame = 0
    }
}

function restartDeterminateReveal() {
    logDebug("restart-determinate-reveal:start", {
        animation: describeAnimation(primaryBarRef.value),
    })
    cancelDeterminateReveal()

    let remainingFrames = DETERMINATE_REVEAL_FRAME_COUNT

    const step = () => {
        logDebug("restart-determinate-reveal:step", {
            remainingFrames,
            animation: describeAnimation(primaryBarRef.value),
            determinateBarTransform: determinateBarRef.value ? getComputedStyle(determinateBarRef.value).transform : null,
            determinateRevealProgress: determinateRevealProgress.value,
        })

        if (remainingFrames > 0) {
            remainingFrames -= 1
            determinateRevealFrame = window.requestAnimationFrame(step)
            return
        }

        determinateRevealFrame = 0
        determinateRevealProgress.value = progress.value
        logDebug("restart-determinate-reveal:apply", {
            progress: progress.value,
            animation: describeAnimation(primaryBarRef.value),
            determinateBarTransform: determinateBarRef.value ? getComputedStyle(determinateBarRef.value).transform : null,
        })
    }

    determinateRevealFrame = window.requestAnimationFrame(step)
}

function startIndeterminate(direction: LinearProgressIndicatorDirection) {
    logDebug("start-indeterminate", { direction })
    cancelDeterminateReveal()
    determinateRevealDuration.value = "medium"
    determinateRevealProgress.value = progress.value
    liveDirection.value = direction
    drainSnapshot.value = null
    drainingLaneCount.value = 0
    phase.value = "indeterminate"
    animationEpoch.value += 1
}

function startDraining(direction: LinearProgressIndicatorDirection) {
    logDebug("start-draining", {
        animation: describeAnimation(primaryBarRef.value),
        direction,
        primaryBarTime: readAnimationTime(primaryBarRef.value),
        primaryInnerTime: readAnimationTime(primaryBarInnerRef.value),
        secondaryBarTime: readAnimationTime(secondaryBarRef.value),
        secondaryInnerTime: readAnimationTime(secondaryBarInnerRef.value),
        revealDuration: props.query ? "large" : "medium",
    })
    determinateRevealDuration.value = props.query ? "large" : "medium"
    drainSnapshot.value = {
        direction,
        determinateDirection: props.reversed ? "reverse" : "forward",
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
    logDebug("stop-draining:before", {
        animation: describeAnimation(primaryBarRef.value),
        drainSnapshot: drainSnapshot.value,
    })
    determinateRevealProgress.value = 0
    phase.value = "determinate"
    restartDeterminateReveal()
    drainSnapshot.value = null
    drainingLaneCount.value = 0
    logDebug("stop-draining:after", {
        animation: describeAnimation(primaryBarRef.value),
        determinateRevealProgress: determinateRevealProgress.value,
    })
}

function handleLaneAnimationEnd(event: AnimationEvent) {
    logDebug("lane-animation-end", {
        currentTargetClassName: event.currentTarget instanceof HTMLElement ? event.currentTarget.className : null,
        eventAnimationName: event.animationName,
        eventTargetClassName: event.target instanceof HTMLElement ? event.target.className : null,
    })

    if (phase.value !== "draining" || event.target !== event.currentTarget) {
        return
    }

    drainingLaneCount.value = Math.max(0, drainingLaneCount.value - 1)
    logDebug("lane-animation-end:countdown", {
        drainingLaneCount: drainingLaneCount.value,
    })

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
        logDebug("progress-change", {
            nextProgress: progress.value,
        })

        if (phase.value === "determinate") {
            determinateRevealProgress.value = progress.value
            logDebug("progress-change:applied-to-determinate", {
                determinateRevealProgress: determinateRevealProgress.value,
            })
        }
    },
    { immediate: true },
)

watch(
    () => [props.indeterminate, props.query, props.reversed] as const,
    (nextState, previousState) => {
        const [nextIndeterminate, nextQuery, nextReversed] = nextState
        const [prevIndeterminate, prevQuery, prevReversed] = previousState ?? [false, false, nextReversed]
        const nextWantsIndeterminate = nextIndeterminate || nextQuery
        const prevWantsIndeterminate = prevIndeterminate || prevQuery
        const nextDirection: LinearProgressIndicatorDirection = nextQuery || nextReversed ? "reverse" : "forward"
        const prevDirection: LinearProgressIndicatorDirection = prevQuery || prevReversed ? "reverse" : "forward"

        logDebug("mode-change", {
            nextDirection,
            nextState,
            nextWantsIndeterminate,
            prevDirection,
            previousState,
            prevWantsIndeterminate,
        })

        if (nextWantsIndeterminate) {
            if (phase.value !== "indeterminate" || !prevWantsIndeterminate || nextDirection !== prevDirection) {
                startIndeterminate(nextDirection)
                return
            }

            liveDirection.value = nextDirection
            logDebug("mode-change:update-live-direction", { nextDirection })
            return
        }

        if (prevWantsIndeterminate && phase.value === "indeterminate") {
            startDraining(prevDirection)
            return
        }

        cancelDeterminateReveal()
        determinateRevealDuration.value = "medium"
        determinateRevealProgress.value = progress.value
        drainSnapshot.value = null
        drainingLaneCount.value = 0
        phase.value = "determinate"
        logDebug("mode-change:direct-determinate", {
            determinateRevealProgress: determinateRevealProgress.value,
        })
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
            <div class="rui-linear-progress-indicator__buffer-bar" :style="bufferStyle" />
            <div class="rui-linear-progress-indicator__buffer-dots" />
        </div>

        <div ref="determinateBarRef" class="rui-linear-progress-indicator__determinate-bar" :style="determinateBarStyle" />

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
    transform: translateZ(0);
    color: var(--rui-sys-color-primary);
    opacity: 1;
    transition: opacity #{motion.$duration-medium-in} #{motion.$easing-standard};

    &--closed {
        opacity: 0;
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

.rui-linear-progress-indicator__buffer-bar {
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

.rui-linear-progress-indicator--reversed .rui-linear-progress-indicator__buffer-dots {
    transform: rotate(0);
    animation-name: rui-linear-progress-indicator-buffering-reverse;
}

.rui-linear-progress-indicator--reversed .rui-linear-progress-indicator__indeterminate-bar {
    right: 0;
    left: auto;
    transform-origin: center right;
}

.rui-linear-progress-indicator--reversed .rui-linear-progress-indicator__indeterminate-bar--primary {
    right: -145.166611%;
    left: auto;
}

.rui-linear-progress-indicator--reversed .rui-linear-progress-indicator__indeterminate-bar--secondary {
    right: -54.888891%;
    left: auto;
}

.rui-linear-progress-indicator--reversed.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--primary,
.rui-linear-progress-indicator--reversed.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__indeterminate-bar--primary {
    animation-name: rui-linear-progress-indicator-primary-indeterminate-translate-reverse;
}

.rui-linear-progress-indicator--reversed.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__indeterminate-bar--secondary,
.rui-linear-progress-indicator--reversed.rui-linear-progress-indicator--draining
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

    20% {
        animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
        transform: translateX(0);
    }

    59.15% {
        animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
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

    36.65% {
        animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
        transform: scaleX(0.08);
    }

    69.15% {
        animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
        transform: scaleX(0.661479);
    }

    100% {
        transform: scaleX(0.08);
    }
}

@keyframes rui-linear-progress-indicator-secondary-indeterminate-translate {
    0% {
        animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
        transform: translateX(0);
    }

    25% {
        animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
        transform: translateX(37.651913%);
    }

    48.35% {
        animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
        transform: translateX(84.386165%);
    }

    100% {
        transform: translateX(160.277782%);
    }
}

@keyframes rui-linear-progress-indicator-secondary-indeterminate-scale {
    0% {
        animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
        transform: scaleX(0.08);
    }

    19.15% {
        animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
        transform: scaleX(0.457104);
    }

    44.15% {
        animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
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
