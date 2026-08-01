<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type StyleValue } from "vue"

import { createSpring } from "@/foundations/spring"

import type {
    RLinearProgressIndicatorAnimationType,
    RLinearProgressIndicatorDirection,
    RLinearProgressIndicatorProps,
} from "./types"

import { normalizeBuffer, normalizeProgress, resolveProgressbarAria } from "./shared"

type LinearProgressIndicatorPhase = "determinate" | "indeterminate" | "draining"
type LinearProgressIndicatorResolvedDirection = {
    active: "forward" | "reverse"
    determinate: "forward" | "reverse"
}
type LinearProgressIndicatorDrainSnapshot = {
    direction: "forward" | "reverse"
    determinateDirection: "forward" | "reverse"
    timelineTime: number
}

const INDETERMINATE_DURATION_MS = 1800
const DETERMINATE_REVEAL_FRAME_COUNT = 2
const DRAINING_LANE_COUNT = 2
const TERMINAL_ANIMATION_NAMES = new Set([
    "rui-linear-progress-indicator-disjoint-primary-start",
    "rui-linear-progress-indicator-disjoint-secondary-start",
])

const props = withDefaults(defineProps<RLinearProgressIndicatorProps>(), {
    buffer: 1,
    closed: false,
    direction: "start-to-end",
    indeterminate: false,
    indeterminateAnimationType: "disjoint",
    progress: 0,
    query: false,
})

const primaryBarRef = ref<HTMLElement | null>(null)
const secondaryBarRef = ref<HTMLElement | null>(null)

function resolveDirection(direction: RLinearProgressIndicatorDirection): LinearProgressIndicatorResolvedDirection {
    const rootDirection = typeof document === "undefined" ? "ltr" : document.documentElement.dir === "rtl" ? "rtl" : "ltr"

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
        default:
            return { active: "forward", determinate: "forward" }
    }
}

function isActiveDirectionReversed(direction: "forward" | "reverse") {
    return direction === "reverse"
}

function resolveActiveDirection(direction: RLinearProgressIndicatorDirection, query: boolean) {
    return query ? "reverse" : resolveDirection(direction).active
}

function supportsNaturalDraining(animationType: RLinearProgressIndicatorAnimationType) {
    return animationType === "disjoint"
}

const resolvedDirection = computed(() => resolveDirection(props.direction))
const phase = ref<LinearProgressIndicatorPhase>(props.indeterminate || props.query ? "indeterminate" : "determinate")
const liveDirection = ref<"forward" | "reverse">(resolveActiveDirection(props.direction, props.query))
const drainSnapshot = ref<LinearProgressIndicatorDrainSnapshot | null>(null)
const drainingLaneCount = ref(0)
const animationEpoch = ref(0)
const determinateRevealProgress = ref(0)
const contiguousColors = computed(() => props.indicatorColors ?? [])
const contiguousColorQueue = ref<string[]>([])
const nextContiguousColorIndex = ref(1)

let determinateRevealFrame = 0

const progress = computed(() => normalizeProgress(props.progress))
const buffer = computed(() => normalizeBuffer(props.buffer))
const showIndeterminateLayer = computed(() => phase.value !== "determinate")
const activeDirection = computed<"forward" | "reverse">(() => drainSnapshot.value?.direction ?? liveDirection.value)
const effectiveDeterminateDirection = computed<"forward" | "reverse">(
    () => drainSnapshot.value?.determinateDirection ?? resolvedDirection.value.determinate,
)
const determinateProgress = computed(() => (phase.value === "determinate" ? determinateRevealProgress.value : 0))
const progressSpring = createSpring({
    initialValue: progress.value,
    onUpdate(value) {
        determinateRevealProgress.value = value
    },
})
const usesContiguousAnimation = computed(() => props.indeterminateAnimationType === "contiguous")
const usesDisjointAnimation = computed(() => !usesContiguousAnimation.value)
const aria = computed(() =>
    resolveProgressbarAria(props.closed, showIndeterminateLayer.value, progress.value, buffer.value),
)
const rootClasses = computed(() => [
    "rui-linear-progress-indicator",
    {
        "rui-linear-progress-indicator--closed": props.closed,
        "rui-linear-progress-indicator--contiguous": usesContiguousAnimation.value,
        "rui-linear-progress-indicator--determinate": phase.value === "determinate",
        "rui-linear-progress-indicator--determinate-reversed": effectiveDeterminateDirection.value === "reverse",
        "rui-linear-progress-indicator--draining": phase.value === "draining",
        "rui-linear-progress-indicator--indeterminate": phase.value === "indeterminate",
        "rui-linear-progress-indicator--active-reversed": isActiveDirectionReversed(activeDirection.value),
    },
])
const determinateBarStyle = computed<StyleValue>(() => ({
    transform: `scaleX(${determinateProgress.value})`,
}))
const trackStyle = computed<StyleValue>(() => ({
    flexBasis: `${(phase.value === "determinate" ? buffer.value : 1) * 100}%`,
}))
const indeterminateKey = computed(
    () => `${phase.value}-${activeDirection.value}-${props.indeterminateAnimationType}-${animationEpoch.value}`,
)
const primaryBarStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.timelineTime}ms` }
        : {},
)
const secondaryBarStyle = computed<StyleValue>(() =>
    phase.value === "draining" && drainSnapshot.value
        ? { animationDelay: `${-drainSnapshot.value.timelineTime}ms` }
        : {},
)

function resetContiguousColors() {
    if (contiguousColors.value.length < 3) {
        throw new Error("RLinearProgressIndicator contiguous mode requires at least three indicatorColors.")
    }

    contiguousColorQueue.value = Array(3).fill(contiguousColors.value[0])
    nextContiguousColorIndex.value = 1
}

function rotateContiguousColors(event: AnimationEvent) {
    if (event.target !== event.currentTarget || !usesContiguousAnimation.value || phase.value !== "indeterminate") {
        return
    }

    const [firstColor, secondColor] = contiguousColorQueue.value
    const nextColor = contiguousColors.value[nextContiguousColorIndex.value]

    if (!firstColor || !secondColor || !nextColor) {
        return
    }

    contiguousColorQueue.value = [nextColor, firstColor, secondColor]
    nextContiguousColorIndex.value = (nextContiguousColorIndex.value + 1) % contiguousColors.value.length
}

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
    progressSpring.jumpTo(0)

    let remainingFrames = DETERMINATE_REVEAL_FRAME_COUNT

    const step = () => {
        if (remainingFrames > 0) {
            remainingFrames -= 1
            determinateRevealFrame = window.requestAnimationFrame(step)
            return
        }

        determinateRevealFrame = 0
        progressSpring.setTarget(progress.value)
    }

    determinateRevealFrame = window.requestAnimationFrame(step)
}

function startIndeterminate(direction: "forward" | "reverse") {
    cancelDeterminateReveal()
    progressSpring.jumpTo(progress.value)
    liveDirection.value = direction
    drainSnapshot.value = null
    drainingLaneCount.value = 0

    if (usesContiguousAnimation.value) {
        resetContiguousColors()
    }

    phase.value = "indeterminate"
    animationEpoch.value += 1
}

function startDraining(direction: "forward" | "reverse") {
    if (!supportsNaturalDraining(props.indeterminateAnimationType)) {
        determinateRevealProgress.value = 0
        phase.value = "determinate"
        restartDeterminateReveal()
        drainSnapshot.value = null
        drainingLaneCount.value = 0
        animationEpoch.value += 1
        return
    }

    drainSnapshot.value = {
        direction,
        determinateDirection: resolvedDirection.value.determinate,
        timelineTime: readAnimationTime(primaryBarRef.value),
    }
    drainingLaneCount.value = DRAINING_LANE_COUNT
    phase.value = "draining"
    animationEpoch.value += 1
}

function stopDraining() {
    phase.value = "determinate"
    restartDeterminateReveal()
    drainSnapshot.value = null
    drainingLaneCount.value = 0
}

function handleLaneAnimationEnd(event: AnimationEvent) {
    if (
        phase.value !== "draining" ||
        event.target !== event.currentTarget ||
        !TERMINAL_ANIMATION_NAMES.has(event.animationName)
    ) {
        return
    }

    drainingLaneCount.value = Math.max(0, drainingLaneCount.value - 1)

    if (drainingLaneCount.value === 0) {
        stopDraining()
    }
}

onBeforeUnmount(() => {
    cancelDeterminateReveal()
    progressSpring.destroy()
})

watch(
    () => props.progress,
    () => {
        if (phase.value === "determinate" && !determinateRevealFrame) {
            progressSpring.setTarget(progress.value)
        }
    },
    { immediate: true },
)

watch(
    () => [props.indeterminate, props.query, props.direction, props.indeterminateAnimationType, props.indicatorColors] as const,
    (nextState, previousState) => {
        const [nextIndeterminate, nextQuery, nextDirectionProp, nextAnimationType] = nextState
        const [prevIndeterminate, prevQuery, prevDirectionProp, prevAnimationType] = previousState ?? [
            false,
            false,
            nextDirectionProp,
            nextAnimationType,
        ]
        const nextActiveDirection = resolveActiveDirection(nextDirectionProp, nextQuery)
        const prevActiveDirection = resolveActiveDirection(prevDirectionProp, prevQuery)
        const nextWantsIndeterminate = nextIndeterminate || nextQuery
        const prevWantsIndeterminate = prevIndeterminate || prevQuery

        if (nextWantsIndeterminate) {
            if (
                phase.value !== "indeterminate" ||
                !prevWantsIndeterminate ||
                nextActiveDirection !== prevActiveDirection ||
                nextAnimationType !== prevAnimationType
            ) {
                startIndeterminate(nextActiveDirection)
                return
            }

            liveDirection.value = nextActiveDirection
            return
        }

        if (prevWantsIndeterminate && phase.value === "indeterminate") {
            startDraining(prevActiveDirection)
            return
        }

        cancelDeterminateReveal()
        progressSpring.jumpTo(progress.value)
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
            <template v-if="usesDisjointAnimation">
                <div
                    ref="primaryBarRef"
                    class="rui-linear-progress-indicator__disjoint-segment rui-linear-progress-indicator__disjoint-segment--primary"
                    :style="primaryBarStyle"
                    @animationend="handleLaneAnimationEnd"
                />
                <div
                    ref="secondaryBarRef"
                    class="rui-linear-progress-indicator__disjoint-segment rui-linear-progress-indicator__disjoint-segment--secondary"
                    :style="secondaryBarStyle"
                    @animationend="handleLaneAnimationEnd"
                />
            </template>
            <div v-else class="rui-linear-progress-indicator__contiguous-track">
                <span
                    class="rui-linear-progress-indicator__contiguous-segment rui-linear-progress-indicator__contiguous-segment--first"
                    :style="{ backgroundColor: contiguousColorQueue[0] }"
                    @animationiteration="rotateContiguousColors"
                />
                <span
                    class="rui-linear-progress-indicator__contiguous-segment rui-linear-progress-indicator__contiguous-segment--second"
                    :style="{ backgroundColor: contiguousColorQueue[1] }"
                />
                <span
                    class="rui-linear-progress-indicator__contiguous-segment rui-linear-progress-indicator__contiguous-segment--third"
                    :style="{ backgroundColor: contiguousColorQueue[2] }"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-linear-progress-indicator {
    --rui-linear-progress-indicator-disjoint-duration: 1800ms;
    --rui-linear-progress-indicator-contiguous-duration: 333ms;

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
.rui-linear-progress-indicator__disjoint-segment,
.rui-linear-progress-indicator__contiguous-track {
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
    position: absolute;
    inset: 0;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: center left;
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

.rui-linear-progress-indicator__disjoint-segment {
    inset: 0;
    background-color: currentColor;
    animation-duration: var(--rui-linear-progress-indicator-disjoint-duration);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-fill-mode: both;
}

.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__disjoint-segment--primary {
    animation-name:
        rui-linear-progress-indicator-disjoint-primary-start,
        rui-linear-progress-indicator-disjoint-primary-end;
}

.rui-linear-progress-indicator--indeterminate
    .rui-linear-progress-indicator__disjoint-segment--secondary {
    animation-name:
        rui-linear-progress-indicator-disjoint-secondary-start,
        rui-linear-progress-indicator-disjoint-secondary-end;
}

.rui-linear-progress-indicator--draining .rui-linear-progress-indicator__disjoint-segment {
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__disjoint-segment--primary {
    animation-name:
        rui-linear-progress-indicator-disjoint-primary-start,
        rui-linear-progress-indicator-disjoint-primary-end;
}

.rui-linear-progress-indicator--draining
    .rui-linear-progress-indicator__disjoint-segment--secondary {
    animation-name:
        rui-linear-progress-indicator-disjoint-secondary-start,
        rui-linear-progress-indicator-disjoint-secondary-end;
}

.rui-linear-progress-indicator--active-reversed
    .rui-linear-progress-indicator__indeterminate-layer {
    transform: scaleX(-1);
}

.rui-linear-progress-indicator--active-reversed
    .rui-linear-progress-indicator__buffer-dots {
    transform: rotate(0);
    animation-name: rui-linear-progress-indicator-buffering-reverse;
}


.rui-linear-progress-indicator__contiguous-track {
    overflow: hidden;
}

.rui-linear-progress-indicator__contiguous-segment {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: currentColor;
    animation-duration: var(--rui-linear-progress-indicator-contiguous-duration);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-fill-mode: both;
}

.rui-linear-progress-indicator__contiguous-segment--first {
    animation-name: rui-linear-progress-indicator-contiguous-first;
}

.rui-linear-progress-indicator__contiguous-segment--second {
    animation-name: rui-linear-progress-indicator-contiguous-second;
}

.rui-linear-progress-indicator__contiguous-segment--third {
    animation-name: rui-linear-progress-indicator-contiguous-third;
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

@keyframes rui-linear-progress-indicator-disjoint-primary-start {
    0%,
    70.3889% {
        inset-inline-start: 0%;
    }

    70.3889% {
        animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }

    100% {
        inset-inline-start: 100%;
    }
}

@keyframes rui-linear-progress-indicator-disjoint-primary-end {
    0%,
    55.5556% {
        inset-inline-end: 100%;
    }

    55.5556% {
        animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    }

    87.0556%,
    100% {
        inset-inline-end: 0%;
    }
}

@keyframes rui-linear-progress-indicator-disjoint-secondary-start {
    0%,
    18.5% {
        inset-inline-start: 0%;
    }

    18.5% {
        animation-timing-function: cubic-bezier(0, 0, 0.65, 1);
    }

    65.7222%,
    100% {
        inset-inline-start: 100%;
    }
}

@keyframes rui-linear-progress-indicator-disjoint-secondary-end {
    0% {
        inset-inline-end: 100%;
        animation-timing-function: cubic-bezier(0.1, 0, 0.45, 1);
    }

    41.6667%,
    100% {
        inset-inline-end: 0%;
    }
}
@keyframes rui-linear-progress-indicator-contiguous-first {
    0% {
        inset-inline-start: 0%;
        inset-inline-end: 100%;
    }

    12.5% {
        inset-inline-start: 0%;
        inset-inline-end: 99.076%;
    }

    25% {
        inset-inline-start: 0%;
        inset-inline-end: 95.718%;
    }

    37.5% {
        inset-inline-start: 0%;
        inset-inline-end: 88.655%;
    }

    50% {
        inset-inline-start: 0%;
        inset-inline-end: 76.431%;
    }

    62.5% {
        inset-inline-start: 0%;
        inset-inline-end: 59.985%;
    }

    75% {
        inset-inline-start: 0%;
        inset-inline-end: 44.155%;
    }

    87.5% {
        inset-inline-start: 0%;
        inset-inline-end: 31.753%;
    }

    100% {
        inset-inline-start: 0%;
        inset-inline-end: 22.539%;
    }
}

@keyframes rui-linear-progress-indicator-contiguous-second {
    0% {
        inset-inline-start: 0%;
        inset-inline-end: 22.539%;
    }

    12.5% {
        inset-inline-start: 0.924%;
        inset-inline-end: 15.704%;
    }

    25% {
        inset-inline-start: 4.282%;
        inset-inline-end: 10.618%;
    }

    37.5% {
        inset-inline-start: 11.345%;
        inset-inline-end: 6.849%;
    }

    50% {
        inset-inline-start: 23.569%;
        inset-inline-end: 4.105%;
    }

    62.5% {
        inset-inline-start: 40.015%;
        inset-inline-end: 2.178%;
    }

    75% {
        inset-inline-start: 55.845%;
        inset-inline-end: 0.922%;
    }

    87.5% {
        inset-inline-start: 68.247%;
        inset-inline-end: 0.224%;
    }

    100% {
        inset-inline-start: 77.461%;
        inset-inline-end: 0%;
    }
}

@keyframes rui-linear-progress-indicator-contiguous-third {
    0% {
        inset-inline-start: 77.461%;
        inset-inline-end: 0%;
    }

    12.5% {
        inset-inline-start: 84.296%;
        inset-inline-end: 0%;
    }

    25% {
        inset-inline-start: 89.382%;
        inset-inline-end: 0%;
    }

    37.5% {
        inset-inline-start: 93.151%;
        inset-inline-end: 0%;
    }

    50% {
        inset-inline-start: 95.895%;
        inset-inline-end: 0%;
    }

    62.5% {
        inset-inline-start: 97.822%;
        inset-inline-end: 0%;
    }

    75% {
        inset-inline-start: 99.078%;
        inset-inline-end: 0%;
    }

    87.5% {
        inset-inline-start: 99.776%;
        inset-inline-end: 0%;
    }

    100% {
        inset-inline-start: 100%;
        inset-inline-end: 0%;
    }
}

</style>
