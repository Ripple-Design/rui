<script setup lang="ts">
import { computed } from "vue"

import { normalizeProgress, resolveProgressbarAria } from "./shared"

import type { RCircularProgressIndicatorProps, RCircularProgressIndicatorSize } from "./types"

const props = withDefaults(defineProps<RCircularProgressIndicatorProps>(), {
    closed: false,
    fourColor: false,
    indeterminate: false,
    progress: 0,
    size: 48,
})

const normalizedProgress = computed(() => normalizeProgress(props.progress))
const radiusBySize: Record<RCircularProgressIndicatorSize, number> = {
    24: 8.75,
    36: 12.5,
    48: 18,
}
const strokeWidthBySize: Record<RCircularProgressIndicatorSize, number> = {
    24: 2.5,
    36: 3,
    48: 4,
}
const viewBoxBySize: Record<RCircularProgressIndicatorSize, string> = {
    24: "0 0 24 24",
    36: "0 0 32 32",
    48: "0 0 48 48",
}
const circleCenterBySize: Record<RCircularProgressIndicatorSize, number> = {
    24: 12,
    36: 16,
    48: 24,
}

const radius = computed(() => radiusBySize[props.size])
const strokeWidth = computed(() => strokeWidthBySize[props.size])
const viewBox = computed(() => viewBoxBySize[props.size])
const circleCenter = computed(() => circleCenterBySize[props.size])
const gapPatchStrokeWidthBySize: Record<RCircularProgressIndicatorSize, number> = {
    24: 2,
    36: 2.4,
    48: 3.8,
}
const gapPatchStrokeWidth = computed(() => gapPatchStrokeWidthBySize[props.size])
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => (1 - normalizedProgress.value) * circumference.value)
const aria = computed(() =>
    resolveProgressbarAria(props.closed, props.indeterminate, normalizedProgress.value),
)
const rootClasses = computed(() => [
    "rui-circular-progress-indicator",
    {
        "rui-circular-progress-indicator--closed": props.closed,
        "rui-circular-progress-indicator--indeterminate": props.indeterminate,
        "rui-circular-progress-indicator--four-color": props.fourColor,
    },
])
const sizeStyle = computed(() => ({
    inlineSize: `${props.size}px`,
    blockSize: `${props.size}px`,
}))
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
        :style="sizeStyle"
    >
        <div class="rui-circular-progress-indicator__determinate-container">
            <svg class="rui-circular-progress-indicator__determinate-circle-graphic" :viewBox="viewBox">
                <circle
                    class="rui-circular-progress-indicator__determinate-track"
                    :cx="circleCenter"
                    :cy="circleCenter"
                    :r="radius"
                    :stroke-width="strokeWidth"
                />
                <circle
                    class="rui-circular-progress-indicator__determinate-circle"
                    :cx="circleCenter"
                    :cy="circleCenter"
                    :r="radius"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="dashOffset"
                    :stroke-width="strokeWidth"
                />
            </svg>
        </div>

        <div class="rui-circular-progress-indicator__indeterminate-container">
            <div
                v-for="layer in props.fourColor ? 4 : 1"
                :key="layer"
                class="rui-circular-progress-indicator__spinner-layer"
                :class="props.fourColor ? `rui-circular-progress-indicator__color-${layer}` : undefined"
            >
                <div class="rui-circular-progress-indicator__circle-clipper rui-circular-progress-indicator__circle-left">
                    <svg class="rui-circular-progress-indicator__indeterminate-circle-graphic" :viewBox="viewBox">
                        <circle
                            :cx="circleCenter"
                            :cy="circleCenter"
                            :r="radius"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="circumference / 2"
                            :stroke-width="strokeWidth"
                        />
                    </svg>
                </div>
                <div class="rui-circular-progress-indicator__gap-patch">
                    <svg class="rui-circular-progress-indicator__indeterminate-circle-graphic" :viewBox="viewBox">
                        <circle
                            :cx="circleCenter"
                            :cy="circleCenter"
                            :r="radius"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="circumference / 2"
                            :stroke-width="gapPatchStrokeWidth"
                        />
                    </svg>
                </div>
                <div class="rui-circular-progress-indicator__circle-clipper rui-circular-progress-indicator__circle-right">
                    <svg class="rui-circular-progress-indicator__indeterminate-circle-graphic" :viewBox="viewBox">
                        <circle
                            :cx="circleCenter"
                            :cy="circleCenter"
                            :r="radius"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="circumference / 2"
                            :stroke-width="strokeWidth"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-circular-progress-indicator {
    --rui-comp-circular-progress-indicator-color: var(--rui-sys-color-primary);
    --rui-comp-circular-progress-indicator-track-color: transparent;

    position: relative;
    display: inline-flex;
    line-height: 0;
    overflow: hidden;
    color: var(--rui-comp-circular-progress-indicator-color);
    direction: ltr;
    transition: opacity 250ms cubic-bezier(0.4, 0, 0.6, 1);

    &--closed {
        opacity: 0;
    }
}

.rui-circular-progress-indicator__color-1 .rui-circular-progress-indicator__indeterminate-circle-graphic {
    color: var(--rui-sys-color-primary);
}

.rui-circular-progress-indicator__color-2 .rui-circular-progress-indicator__indeterminate-circle-graphic {
    color: var(--rui-sys-color-secondary);
}

.rui-circular-progress-indicator__color-3 .rui-circular-progress-indicator__indeterminate-circle-graphic {
    color: var(--rui-sys-color-primary-light);
}

.rui-circular-progress-indicator__color-4 .rui-circular-progress-indicator__indeterminate-circle-graphic {
    color: var(--rui-sys-color-secondary-dark);
}

.rui-circular-progress-indicator__determinate-container,
.rui-circular-progress-indicator__indeterminate-container,
.rui-circular-progress-indicator__spinner-layer,
.rui-circular-progress-indicator__determinate-circle-graphic,
.rui-circular-progress-indicator__indeterminate-circle-graphic {
    position: absolute;
    inline-size: 100%;
    block-size: 100%;
    color: inherit;
}

.rui-circular-progress-indicator__determinate-container {
    transform: rotate(-90deg);
}

.rui-circular-progress-indicator__indeterminate-container {
    font-size: 0;
    letter-spacing: 0;
    white-space: nowrap;
    opacity: 0;
}

.rui-circular-progress-indicator__determinate-circle-graphic,
.rui-circular-progress-indicator__indeterminate-circle-graphic {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    fill: transparent;
}

.rui-circular-progress-indicator__determinate-track {
    stroke: var(--rui-comp-circular-progress-indicator-track-color);
}

.rui-circular-progress-indicator__determinate-circle,
.rui-circular-progress-indicator__indeterminate-circle-graphic circle {
    fill: transparent;
    stroke: currentColor;
    transform-origin: center;
}

.rui-circular-progress-indicator__determinate-circle {
    transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.rui-circular-progress-indicator--indeterminate .rui-circular-progress-indicator__determinate-container {
    opacity: 0;
}

.rui-circular-progress-indicator--indeterminate .rui-circular-progress-indicator__indeterminate-container {
    opacity: 1;
    animation: rui-circular-progress-indicator-container-rotate 1333ms linear infinite;
}

.rui-circular-progress-indicator__spinner-layer {
    animation: rui-circular-progress-indicator-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator--four-color .rui-circular-progress-indicator__color-1 {
    animation:
        rui-circular-progress-indicator-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
        rui-circular-progress-indicator-color-1-fade 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator--four-color .rui-circular-progress-indicator__color-2 {
    animation:
        rui-circular-progress-indicator-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
        rui-circular-progress-indicator-color-2-fade 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator--four-color .rui-circular-progress-indicator__color-3 {
    animation:
        rui-circular-progress-indicator-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
        rui-circular-progress-indicator-color-3-fade 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator--four-color .rui-circular-progress-indicator__color-4 {
    animation:
        rui-circular-progress-indicator-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
        rui-circular-progress-indicator-color-4-fade 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator__circle-clipper,
.rui-circular-progress-indicator__gap-patch {
    position: absolute;
    top: 0;
    overflow: hidden;
    inline-size: 50%;
    block-size: 100%;
}

.rui-circular-progress-indicator__circle-right {
    right: 0;
}

.rui-circular-progress-indicator__gap-patch {
    left: 47.5%;
    inline-size: 5%;
}

.rui-circular-progress-indicator__circle-clipper .rui-circular-progress-indicator__indeterminate-circle-graphic {
    inline-size: 200%;
}

.rui-circular-progress-indicator__circle-left .rui-circular-progress-indicator__indeterminate-circle-graphic {
    animation: rui-circular-progress-indicator-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator__circle-right .rui-circular-progress-indicator__indeterminate-circle-graphic {
    left: -100%;
    animation: rui-circular-progress-indicator-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.rui-circular-progress-indicator__gap-patch .rui-circular-progress-indicator__indeterminate-circle-graphic {
    left: -900%;
    inline-size: 2000%;
    transform: rotate(180deg);
}

@keyframes rui-circular-progress-indicator-container-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes rui-circular-progress-indicator-spinner-layer-rotate {
    12.5% {
        transform: rotate(135deg);
    }

    25% {
        transform: rotate(270deg);
    }

    37.5% {
        transform: rotate(405deg);
    }

    50% {
        transform: rotate(540deg);
    }

    62.5% {
        transform: rotate(675deg);
    }

    75% {
        transform: rotate(810deg);
    }

    87.5% {
        transform: rotate(945deg);
    }

    100% {
        transform: rotate(1080deg);
    }
}

@keyframes rui-circular-progress-indicator-color-1-fade {
    0% { opacity: 0.99; }
    25% { opacity: 0.99; }
    26% { opacity: 0; }
    89% { opacity: 0; }
    90% { opacity: 0.99; }
    100% { opacity: 0.99; }
}

@keyframes rui-circular-progress-indicator-color-2-fade {
    0% { opacity: 0; }
    15% { opacity: 0; }
    25% { opacity: 0.99; }
    50% { opacity: 0.99; }
    51% { opacity: 0; }
    100% { opacity: 0; }
}

@keyframes rui-circular-progress-indicator-color-3-fade {
    0% { opacity: 0; }
    40% { opacity: 0; }
    50% { opacity: 0.99; }
    75% { opacity: 0.99; }
    76% { opacity: 0; }
    100% { opacity: 0; }
}

@keyframes rui-circular-progress-indicator-color-4-fade {
    0% { opacity: 0; }
    65% { opacity: 0; }
    75% { opacity: 0.99; }
    90% { opacity: 0.99; }
    100% { opacity: 0; }
}

@keyframes rui-circular-progress-indicator-left-spin {
    from {
        transform: rotate(265deg);
    }

    50% {
        transform: rotate(130deg);
    }

    to {
        transform: rotate(265deg);
    }
}

@keyframes rui-circular-progress-indicator-right-spin {
    from {
        transform: rotate(-265deg);
    }

    50% {
        transform: rotate(-130deg);
    }

    to {
        transform: rotate(-265deg);
    }
}
</style>

