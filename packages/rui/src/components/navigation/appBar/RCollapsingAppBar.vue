<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from "vue"

import type { RCollapsingAppBarProps } from "./types.ts"

import { appBarContextKey } from "./context.ts"
import RTopAppBar from "./RTopAppBar.vue"

const props = withDefaults(defineProps<RCollapsingAppBarProps>(), {
    titleEnabled: true,
    expandedTitleGravity: "start",
    collapsedTitleGravity: "start",
    expandedTitleMargin: () => ({}),
    expandedTitleAppearance: () => ({}),
    collapsedTitleAppearance: () => ({}),
})

const appBar = inject(appBarContextKey, null)
const root = ref<HTMLElement | null>(null)
const expandedAnchor = ref<HTMLElement | null>(null)
const collapsedAnchor = ref<HTMLElement | null>(null)
const metrics = ref({
    expandedX: 0,
    expandedY: 0,
    collapsedX: 0,
    collapsedY: 0,
    expandedTextX: 0,
    expandedTextY: 0,
    collapsedTextX: 0,
    collapsedTextY: 0,
    expandedFontSize: 0,
    collapsedFontSize: 0,
    expandedFontWeight: 400,
    collapsedFontWeight: 500,
    expandedLineHeight: 0,
    collapsedLineHeight: 0,
    expandedLetterSpacing: 0,
    collapsedLetterSpacing: 0,
    expandedColor: "",
    collapsedColor: "",
    expandedFontFamily: "",
    collapsedFontFamily: "",
})

const progress = computed(() => appBar?.scrollState.value.collapseProgress ?? 0)

const titleAppearanceStyle = computed(() => ({
    "--rui-comp-app-bar-expanded-title-margin-start": props.expandedTitleMargin.start ?? "32px",
    "--rui-comp-app-bar-expanded-title-margin-top": props.expandedTitleMargin.top ?? "32px",
    "--rui-comp-app-bar-expanded-title-margin-end": props.expandedTitleMargin.end ?? "32px",
    "--rui-comp-app-bar-expanded-title-margin-bottom": props.expandedTitleMargin.bottom ?? "32px",
    "--rui-comp-app-bar-expanded-title-color":
        props.expandedTitleAppearance.color ?? "var(--rui-comp-surface-content-color)",
    "--rui-comp-app-bar-expanded-title-font-family":
        props.expandedTitleAppearance.fontFamily ?? "var(--rui-sys-typo-headline4-font-family)",
    "--rui-comp-app-bar-expanded-title-font-size":
        props.expandedTitleAppearance.fontSize ?? "var(--rui-sys-typo-headline4-size)",
    "--rui-comp-app-bar-expanded-title-font-weight":
        props.expandedTitleAppearance.fontWeight ?? "var(--rui-sys-typo-headline4-weight)",
    "--rui-comp-app-bar-expanded-title-letter-spacing":
        props.expandedTitleAppearance.letterSpacing ?? "var(--rui-sys-typo-headline4-letter-spacing)",
    "--rui-comp-app-bar-expanded-title-line-height":
        props.expandedTitleAppearance.lineHeight ?? "var(--rui-sys-typo-headline4-line-height)",
}))

const toolbarStyle = undefined

const animatedTitleStyle = computed(() => {
    const metricsValue = metrics.value
    const {
        expandedX,
        expandedY,
        collapsedX,
        collapsedY,
        expandedTextX,
        expandedTextY,
        collapsedTextX,
        collapsedTextY,
        expandedFontSize,
        collapsedFontSize,
        expandedFontWeight,
        collapsedFontWeight,
        expandedLineHeight,
        collapsedLineHeight,
        expandedLetterSpacing,
        collapsedLetterSpacing,
    } = metricsValue
    if (!expandedFontSize || !collapsedFontSize) return undefined

    const eased = 1 - Math.pow(1 - progress.value, 2)
    return {
        insetInlineStart: `${expandedX}px`,
        insetInlineEnd: "auto",
        insetBlockStart: `${expandedY}px`,
        insetBlockEnd: "auto",
        color: `color-mix(in srgb, ${metricsValue.expandedColor} ${(1 - eased) * 100}%, ${metricsValue.collapsedColor} ${eased * 100}%)`,
        fontFamily: eased >= 1 ? metricsValue.collapsedFontFamily : metricsValue.expandedFontFamily,
        fontSize: `${expandedFontSize + (collapsedFontSize - expandedFontSize) * eased}px`,
        fontWeight: expandedFontWeight + (collapsedFontWeight - expandedFontWeight) * eased,
        lineHeight: `${expandedLineHeight + (collapsedLineHeight - expandedLineHeight) * eased}px`,
        letterSpacing: `${expandedLetterSpacing + (collapsedLetterSpacing - expandedLetterSpacing) * eased}px`,
        transform: `translate(${(collapsedX + collapsedTextX - expandedX - expandedTextX) * eased}px, ${(collapsedY + collapsedTextY - expandedY - expandedTextY) * eased}px)`,
    }
})

let resizeObserver: ResizeObserver | null = null

function updateTitleMetrics() {
    const rootElement = root.value
    const expandedElement = expandedAnchor.value
    const collapsedElement = collapsedAnchor.value
    if (!rootElement || !expandedElement || !collapsedElement) return

    const collapsedTypographyElement = collapsedElement.closest(".rui-text") as HTMLElement | null
    if (!collapsedTypographyElement) return

    const rootRect = rootElement.getBoundingClientRect()
    const expandedRect = expandedElement.getBoundingClientRect()
    const collapsedRect = collapsedElement.getBoundingClientRect()
    const expandedStyle = getComputedStyle(expandedElement)
    const collapsedStyle = getComputedStyle(collapsedTypographyElement)
    const expandedTextX =
        expandedStyle.textAlign === "center" ? (expandedRect.width - expandedElement.clientWidth) / 2 : 0
    const expandedTextY = (expandedRect.height - Number.parseFloat(expandedStyle.lineHeight)) / 2
    const collapsedTextX =
        collapsedStyle.textAlign === "center" ? (collapsedRect.width - collapsedElement.clientWidth) / 2 : 0
    const collapsedTextY = (collapsedRect.height - Number.parseFloat(collapsedStyle.lineHeight)) / 2
    const expandedFontSize = Number.parseFloat(expandedStyle.fontSize)
    const collapsedFontSize = Number.parseFloat(collapsedStyle.fontSize)

    if (!expandedFontSize || !collapsedFontSize) return
    metrics.value = {
        expandedX: expandedRect.left - rootRect.left,
        expandedY: expandedRect.top - rootRect.top,
        collapsedX: collapsedRect.left - rootRect.left,
        collapsedY: collapsedRect.top - rootRect.top,
        expandedTextX,
        expandedTextY,
        collapsedTextX,
        collapsedTextY,
        expandedFontSize,
        collapsedFontSize,
        expandedFontWeight: Number.parseFloat(expandedStyle.fontWeight),
        collapsedFontWeight: Number.parseFloat(collapsedStyle.fontWeight),
        expandedLineHeight: Number.parseFloat(expandedStyle.lineHeight),
        collapsedLineHeight: Number.parseFloat(collapsedStyle.lineHeight),
        expandedLetterSpacing: Number.parseFloat(expandedStyle.letterSpacing),
        collapsedLetterSpacing: Number.parseFloat(collapsedStyle.letterSpacing),
        expandedColor: expandedStyle.color,
        collapsedColor: collapsedStyle.color,
        expandedFontFamily: expandedStyle.fontFamily,
        collapsedFontFamily: collapsedStyle.fontFamily,
    }
}

onMounted(() => {
    nextTick(updateTitleMetrics)
    window.addEventListener("resize", updateTitleMetrics)
    // Container changes can happen without a window resize, so observe the actual layout bounds.
    if (!root.value || typeof ResizeObserver === "undefined") return
    resizeObserver = new ResizeObserver(updateTitleMetrics)
    resizeObserver.observe(root.value)
})

onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener("resize", updateTitleMetrics)
})
</script>

<template>
    <div ref="root" class="rui-collapsing-app-bar" :style="titleAppearanceStyle">
        <div class="rui-collapsing-app-bar__expanded-content">
            <slot name="background" />
            <slot />
        </div>

        <span
            v-if="titleEnabled && title"
            ref="expandedAnchor"
            class="rui-collapsing-app-bar__expanded-title"
            :class="`rui-collapsing-app-bar__expanded-title--${expandedTitleGravity}`"
            aria-hidden="true"
        >
            {{ title }}
        </span>

        <div class="rui-collapsing-app-bar__toolbar">
            <RTopAppBar :aria-label="title">
                <template v-if="$slots.navigation" #navigation>
                    <slot name="navigation" />
                </template>
                <template #title>
                    <span ref="collapsedAnchor" class="rui-collapsing-app-bar__collapsed-anchor">
                        {{ title }}
                    </span>
                </template>
                <template v-if="$slots.subtitle" #subtitle>
                    <slot name="subtitle" />
                </template>
                <template v-if="$slots.actions" #actions>
                    <slot name="actions" />
                </template>
            </RTopAppBar>
        </div>

        <span
            v-if="titleEnabled && title"
            class="rui-collapsing-app-bar__animated-title"
            :class="`rui-collapsing-app-bar__animated-title--${expandedTitleGravity}`"
            :style="animatedTitleStyle"
        >
            {{ title }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.rui-collapsing-app-bar {
    --rui-comp-app-bar-expanded-title-margin-start: 32px;
    --rui-comp-app-bar-expanded-title-margin-end: 32px;
    --rui-comp-app-bar-expanded-title-margin-top: 32px;
    --rui-comp-app-bar-expanded-title-margin-bottom: 32px;
    position: relative;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
}

.rui-collapsing-app-bar__expanded-content {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.rui-collapsing-app-bar__expanded-title,
.rui-collapsing-app-bar__animated-title {
    position: absolute;
    inset-inline-start: var(--rui-comp-app-bar-expanded-title-margin-start);
    inset-inline-end: var(--rui-comp-app-bar-expanded-title-margin-end);
    inset-block-end: var(--rui-comp-app-bar-expanded-title-margin-bottom);
    display: block;
    overflow: hidden;
    color: var(--rui-comp-app-bar-expanded-title-color);
    font-family: var(--rui-comp-app-bar-expanded-title-font-family);
    font-size: var(--rui-comp-app-bar-expanded-title-font-size);
    font-weight: var(--rui-comp-app-bar-expanded-title-font-weight);
    line-height: var(--rui-comp-app-bar-expanded-title-line-height);
    letter-spacing: var(--rui-comp-app-bar-expanded-title-letter-spacing);
    white-space: nowrap;
    text-overflow: ellipsis;
    transform-origin: top left;
}

.rui-collapsing-app-bar__expanded-title {
    visibility: hidden;
}

.rui-collapsing-app-bar__animated-title {
    z-index: 3;
    will-change: transform;
    pointer-events: none;
}

.rui-collapsing-app-bar__expanded-title--center,
.rui-collapsing-app-bar__animated-title--center {
    text-align: center;
}

.rui-collapsing-app-bar__expanded-title--end,
.rui-collapsing-app-bar__animated-title--end {
    text-align: end;
}

.rui-collapsing-app-bar__toolbar {
    position: absolute;
    z-index: 2;
    inset-inline: 0;
    inset-block-start: 0;
    block-size: var(--rui-comp-app-bar-collapsed-height, 56px);
}

.rui-collapsing-app-bar__collapsed-anchor {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    color: transparent;
    text-overflow: ellipsis;
}
</style>
