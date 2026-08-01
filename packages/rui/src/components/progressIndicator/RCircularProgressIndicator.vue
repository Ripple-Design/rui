<script setup lang="ts">
import { computed } from "vue"

import { normalizeProgress, resolveProgressbarAria } from "./shared"

import type { RCircularProgressIndicatorProps, RCircularProgressIndicatorSize } from "./types"

const props = withDefaults(defineProps<RCircularProgressIndicatorProps>(), {
    closed: false,
    indeterminate: false,
    indicatorColors: () => [],
    progress: 0,
    reversed: false,
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
    36: "0 0 36 36",
    48: "0 0 48 48",
}
const circleCenterBySize: Record<RCircularProgressIndicatorSize, number> = {
    24: 12,
    36: 18,
    48: 24,
}

const resolvedIndicatorColors = computed(() => props.indicatorColors)
const hasMultipleIndicatorColors = computed(() => resolvedIndicatorColors.value.length > 1)
const indicatorColor = computed(() => resolvedIndicatorColors.value[0] ?? "var(--rui-sys-color-primary)")
const colorAnimationDuration = computed(() => `${5400}ms`)
const indicatorColorLayers = computed(() => {
    const colors = resolvedIndicatorColors.value

    if (colors.length <= 1) {
        return [{ color: indicatorColor.value, opacityValues: "1;1", opacityKeyTimes: "0;1" }]
    }

    const segment = 1 / colors.length
    const fade = Math.min(segment * 0.18, 0.08)

    return colors.map((color, index) => {
        if (index === 0) {
            const fadeOutStart = Math.max(0, segment - fade)
            const fadeOutEnd = Math.min(1, segment + fade)
            const wrapFadeInStart = Math.max(0, 1 - fade)

            return {
                color,
                opacityValues: "1;1;0;0;1",
                opacityKeyTimes: [0, fadeOutStart, fadeOutEnd, wrapFadeInStart, 1]
                    .map((time) => time.toFixed(4))
                    .join(";"),
            }
        }

        const start = segment * index
        const end = segment * (index + 1)
        const fadeInStart = Math.max(0, start - fade)
        const fadeInEnd = Math.min(1, start + fade)
        const fadeOutStart = Math.max(0, end - fade)
        const fadeOutEnd = Math.min(1, end + fade)
        const values = end >= 1 ? "0;0;1;1;0" : "0;0;1;1;0;0"
        const keyTimes = end >= 1
            ? [0, fadeInStart, fadeInEnd, fadeOutStart, 1]
            : [0, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd, 1]

        return {
            color,
            opacityValues: values,
            opacityKeyTimes: keyTimes.map((time) => time.toFixed(4)).join(";"),
        }
    })
})
const radius = computed(() => radiusBySize[props.size])
const strokeWidth = computed(() => strokeWidthBySize[props.size])
const viewBox = computed(() => viewBoxBySize[props.size])
const circleCenter = computed(() => circleCenterBySize[props.size])
const determinateDashOffset = computed(() => 100 - normalizedProgress.value * 100)
const aria = computed(() => resolveProgressbarAria(props.closed, props.indeterminate, normalizedProgress.value))
const rootClasses = computed(() => [
    "rui-circular-progress-indicator",
    {
        "rui-circular-progress-indicator--closed": props.closed,
        "rui-circular-progress-indicator--indeterminate": props.indeterminate,
        "rui-circular-progress-indicator--reversed": props.reversed,
    },
])
const sizeStyle = computed<Record<string, string>>(() => ({
    "--rui-comp-circular-progress-indicator-color": indicatorColor.value,
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
            <svg class="rui-circular-progress-indicator__determinate-circle-graphic" :viewBox.attr="viewBox">
                <circle
                    class="rui-circular-progress-indicator__determinate-track"
                    :cx.attr="circleCenter"
                    :cy.attr="circleCenter"
                    :r.attr="radius"
                    :stroke-width.attr="strokeWidth"
                />
                <circle
                    class="rui-circular-progress-indicator__determinate-circle"
                    :cx.attr="circleCenter"
                    :cy.attr="circleCenter"
                    :r.attr="radius"
                    pathLength="100"
                    :stroke-dasharray.attr="100"
                    :stroke-dashoffset.attr="determinateDashOffset"
                    :stroke-width.attr="strokeWidth"
                />
            </svg>
        </div>

        <div class="rui-circular-progress-indicator__indeterminate-container">
            <div class="rui-circular-progress-indicator__spinner-layer">
                <svg class="rui-circular-progress-indicator__indeterminate-circle-graphic" :viewBox.attr="viewBox">
                    <template v-for="(layer, index) in indicatorColorLayers" :key="`${layer.color}-${index}`">
                        <circle
                            class="rui-circular-progress-indicator__indeterminate-arc"
                            :cx.attr="circleCenter"
                            :cy.attr="circleCenter"
                            :r.attr="radius"
                            pathLength="100"
                            :stroke.attr="layer.color"
                            :stroke-width.attr="strokeWidth"
                        >
                            <animate
                                v-if="hasMultipleIndicatorColors"
                                attributeName="opacity"
                                :values.attr="layer.opacityValues"
                                :keyTimes.attr="layer.opacityKeyTimes"
                                calcMode="linear"
                                :dur.attr="colorAnimationDuration"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </template>
                </svg>
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

    &--reversed {
        transform: scaleX(-1);
    }
}

.rui-circular-progress-indicator__determinate-container,
.rui-circular-progress-indicator__indeterminate-container,
.rui-circular-progress-indicator__spinner-layer,
.rui-circular-progress-indicator__determinate-circle-graphic,
.rui-circular-progress-indicator__indeterminate-circle-graphic {
    position: absolute;
    inset: 0;
    color: inherit;
}

.rui-circular-progress-indicator__determinate-container {
    transform: rotate(-90deg);
}

.rui-circular-progress-indicator__indeterminate-container {
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
.rui-circular-progress-indicator__indeterminate-arc {
    fill: transparent;
    transform-origin: center;
}

.rui-circular-progress-indicator__determinate-circle {
    stroke: currentColor;
    transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.rui-circular-progress-indicator__indeterminate-arc {
    stroke-dasharray: 5.556 94.444;
    stroke-dashoffset: 0;
    animation: rui-circular-progress-indicator-arc-grow 5400ms linear infinite both;
}

.rui-circular-progress-indicator--indeterminate .rui-circular-progress-indicator__determinate-container {
    opacity: 0;
}

.rui-circular-progress-indicator--indeterminate .rui-circular-progress-indicator__indeterminate-container {
    opacity: 1;
}

.rui-circular-progress-indicator__spinner-layer {
    animation: rui-circular-progress-indicator-spinner-layer-rotate 5400ms linear infinite both;
}

@keyframes rui-circular-progress-indicator-spinner-layer-rotate {
    0% {
        transform: rotate(-20deg);
    }

    2.5% {
        transform: rotate(18deg);
    }

    5% {
        transform: rotate(56deg);
    }

    7.5% {
        transform: rotate(94deg);
    }

    10% {
        transform: rotate(132deg);
    }

    12.5% {
        transform: rotate(170.077deg);
    }

    15% {
        transform: rotate(247.956deg);
    }

    17.5% {
        transform: rotate(407.62deg);
    }

    20% {
        transform: rotate(506.592deg);
    }

    22.5% {
        transform: rotate(567.18deg);
    }

    25% {
        transform: rotate(610deg);
    }

    27.5% {
        transform: rotate(648deg);
    }

    30% {
        transform: rotate(686deg);
    }

    32.5% {
        transform: rotate(724deg);
    }

    35% {
        transform: rotate(762deg);
    }

    37.5% {
        transform: rotate(800.077deg);
    }

    40% {
        transform: rotate(877.956deg);
    }

    42.5% {
        transform: rotate(1037.62deg);
    }

    45% {
        transform: rotate(1136.592deg);
    }

    47.5% {
        transform: rotate(1197.18deg);
    }

    50% {
        transform: rotate(1240deg);
    }

    52.5% {
        transform: rotate(1278deg);
    }

    55% {
        transform: rotate(1316deg);
    }

    57.5% {
        transform: rotate(1354deg);
    }

    60% {
        transform: rotate(1392deg);
    }

    62.5% {
        transform: rotate(1430.077deg);
    }

    65% {
        transform: rotate(1507.956deg);
    }

    67.5% {
        transform: rotate(1667.62deg);
    }

    70% {
        transform: rotate(1766.592deg);
    }

    72.5% {
        transform: rotate(1827.18deg);
    }

    75% {
        transform: rotate(1870deg);
    }

    77.5% {
        transform: rotate(1908deg);
    }

    80% {
        transform: rotate(1946deg);
    }

    82.5% {
        transform: rotate(1984deg);
    }

    85% {
        transform: rotate(2022deg);
    }

    87.5% {
        transform: rotate(2060.077deg);
    }

    90% {
        transform: rotate(2137.956deg);
    }

    92.5% {
        transform: rotate(2297.62deg);
    }

    95% {
        transform: rotate(2396.592deg);
    }

    97.5% {
        transform: rotate(2457.18deg);
    }

    100% {
        transform: rotate(2500deg);
    }
}

@keyframes rui-circular-progress-indicator-arc-grow {
    0% {
        stroke-dasharray: 5.556 94.444;
    }

    2.5% {
        stroke-dasharray: 15.142 84.858;
    }

    5% {
        stroke-dasharray: 48.837 51.163;
    }

    7.5% {
        stroke-dasharray: 66.772 33.228;
    }

    10% {
        stroke-dasharray: 73.458 26.542;
    }

    12.5% {
        stroke-dasharray: 74.979 25.021;
    }

    15% {
        stroke-dasharray: 63.901 36.099;
    }

    17.5% {
        stroke-dasharray: 30.105 69.895;
    }

    20% {
        stroke-dasharray: 13.169 86.831;
    }

    22.5% {
        stroke-dasharray: 6.894 93.106;
    }

    25% {
        stroke-dasharray: 5.556 94.444;
    }

    27.5% {
        stroke-dasharray: 15.142 84.858;
    }

    30% {
        stroke-dasharray: 48.837 51.163;
    }

    32.5% {
        stroke-dasharray: 66.772 33.228;
    }

    35% {
        stroke-dasharray: 73.458 26.542;
    }

    37.5% {
        stroke-dasharray: 74.979 25.021;
    }

    40% {
        stroke-dasharray: 63.901 36.099;
    }

    42.5% {
        stroke-dasharray: 30.105 69.895;
    }

    45% {
        stroke-dasharray: 13.169 86.831;
    }

    47.5% {
        stroke-dasharray: 6.894 93.106;
    }

    50% {
        stroke-dasharray: 5.556 94.444;
    }

    52.5% {
        stroke-dasharray: 15.142 84.858;
    }

    55% {
        stroke-dasharray: 48.837 51.163;
    }

    57.5% {
        stroke-dasharray: 66.772 33.228;
    }

    60% {
        stroke-dasharray: 73.458 26.542;
    }

    62.5% {
        stroke-dasharray: 74.979 25.021;
    }

    65% {
        stroke-dasharray: 63.901 36.099;
    }

    67.5% {
        stroke-dasharray: 30.105 69.895;
    }

    70% {
        stroke-dasharray: 13.169 86.831;
    }

    72.5% {
        stroke-dasharray: 6.894 93.106;
    }

    75% {
        stroke-dasharray: 5.556 94.444;
    }

    77.5% {
        stroke-dasharray: 15.142 84.858;
    }

    80% {
        stroke-dasharray: 48.837 51.163;
    }

    82.5% {
        stroke-dasharray: 66.772 33.228;
    }

    85% {
        stroke-dasharray: 73.458 26.542;
    }

    87.5% {
        stroke-dasharray: 74.979 25.021;
    }

    90% {
        stroke-dasharray: 63.901 36.099;
    }

    92.5% {
        stroke-dasharray: 30.105 69.895;
    }

    95% {
        stroke-dasharray: 13.169 86.831;
    }

    97.5% {
        stroke-dasharray: 6.894 93.106;
    }

    100% {
        stroke-dasharray: 5.556 94.444;
    }
}
</style>
