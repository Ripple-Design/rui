<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue"

import { scaffoldContextKey, type RScaffoldBottomAppBarFabState } from "@/components/layout/scaffold/context.ts"
import { useResizeObserver } from "@/utils/useResizeObserver.ts"

import type { RBottomAppBarProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"

const props = withDefaults(defineProps<RBottomAppBarProps>(), {
    fabAlignmentMode: "center",
    fabAnimationMode: "scale",
    fabAttached: true,
    fabCradleMargin: "5px",
    fabCradleRoundedCornerRadius: "8px",
    fabCradleVerticalOffset: "0px",
    hideOnScroll: false,
    color: "surface",
})

const attrs = useAttrs()
const scaffold = inject(scaffoldContextKey, null)
const rootRef = ref<HTMLElement | null>(null)
const actionsRef = ref<HTMLElement | null>(null)
const fab = ref<RScaffoldBottomAppBarFabState>({ element: null, inlineSize: 0, blockSize: 0, visible: false })
const rootInlineSize = ref(0)
const actionsPosition = ref<"start" | "end">("end")
const actionsVisible = ref(true)
let disposeRegistration: (() => void) | null = null
let actionsTimer: ReturnType<typeof setTimeout> | null = null

const fabCradleMargin = computed(() => parseDimension(props.fabCradleMargin))
const fabCradleRoundedCornerRadius = computed(() => parseDimension(props.fabCradleRoundedCornerRadius))
const fabCradleVerticalOffset = computed(() => Math.max(0, parseDimension(props.fabCradleVerticalOffset)))
const isFabDocked = computed(() => !!fab.value.element && fab.value.visible && props.fabAttached)
const targetActionsPosition = computed<"start" | "end">(() =>
    isFabDocked.value && props.fabAlignmentMode === "end" ? "start" : "end",
)
const rootClasses = computed(() => [
    "rui-bottom-app-bar",
    `rui-bottom-app-bar--color-${props.color}`,
    {
        "rui-bottom-app-bar--has-cradle": isFabDocked.value,
        "rui-bottom-app-bar--actions-visible": actionsVisible.value,
    },
])
const actionsClasses = computed(() => [
    "rui-bottom-app-bar__actions",
    `rui-bottom-app-bar__actions--${actionsPosition.value}`,
])
const viewBox = computed(() => `0 0 ${Math.max(1, rootInlineSize.value)} 64`)
const cradlePath = computed(() =>
    createCradlePath(
        rootInlineSize.value,
        64,
        isFabDocked.value ? fab.value.inlineSize : 0,
        fabCradleMargin.value,
        fabCradleRoundedCornerRadius.value,
        fabCradleVerticalOffset.value,
        props.fabAlignmentMode,
        rootRef.value ? getComputedStyle(rootRef.value).direction === "rtl" : false,
    ),
)

function parseDimension(value: string) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function createCradlePath(
    width: number,
    height: number,
    fabDiameter: number,
    margin: number,
    cornerRadius: number,
    verticalOffset: number,
    alignment: "center" | "end",
    rtl: boolean,
) {
    if (!width || !fabDiameter) return `M 0 0 H ${width} V ${height} H 0 Z`

    const cradleRadius = (fabDiameter + margin * 2) / 2
    if (!cradleRadius || verticalOffset / cradleRadius >= 1) return `M 0 0 H ${width} V ${height} H 0 Z`

    const offset = alignment === "end" ? width / 2 - 60 : 0
    const middle = width / 2 + (rtl ? -offset : offset)
    const shoulder = Math.min(cornerRadius, cradleRadius)
    const distanceY = verticalOffset + shoulder
    const distanceX = Math.sqrt(Math.max(0, (cradleRadius + shoulder) ** 2 - distanceY ** 2))
    const left = middle - distanceX
    const right = middle + distanceX
    const circleLeft = middle - cradleRadius
    const circleRight = middle + cradleRadius
    const circleBottom = cradleRadius - verticalOffset

    return [
        "M 0 0",
        `H ${left}`,
        shoulder ? `Q ${left} ${shoulder} ${left + shoulder} ${shoulder}` : "",
        `A ${cradleRadius} ${cradleRadius} 0 0 1 ${circleRight} ${circleBottom}`,
        shoulder ? `Q ${right - shoulder} ${shoulder} ${right} 0` : "",
        `H ${width}`,
        `V ${height}`,
        "H 0 Z",
    ]
        .filter(Boolean)
        .join(" ")
}

function publishFabState(state: RScaffoldBottomAppBarFabState) {
    fab.value = state
}

function syncActionsPosition() {
    const target = targetActionsPosition.value
    if (target === actionsPosition.value) {
        actionsVisible.value = true
        return
    }

    if (actionsTimer != null) clearTimeout(actionsTimer)
    actionsVisible.value = false
    actionsTimer = setTimeout(() => {
        actionsPosition.value = target
        actionsVisible.value = true
        actionsTimer = null
    }, 150)
}

watch(targetActionsPosition, syncActionsPosition, { flush: "post" })
watch([() => props.fabAlignmentMode, () => props.fabAttached], () => nextTick(syncActionsPosition), { flush: "post" })
useResizeObserver(rootRef, () => {
    rootInlineSize.value = rootRef.value?.clientWidth ?? 0
})

onMounted(() => {
    rootInlineSize.value = rootRef.value?.clientWidth ?? 0
    if (!scaffold) return

    disposeRegistration = scaffold.registerBottomAppBar({
        fabAlignmentMode: computed(() => props.fabAlignmentMode),
        fabAnimationMode: computed(() => props.fabAnimationMode),
        fabAttached: computed(() => props.fabAttached),
        fabCradleVerticalOffset,
        hideOnScroll: computed(() => props.hideOnScroll),
        onFabStateChange: publishFabState,
    })
})

onBeforeUnmount(() => {
    disposeRegistration?.()
    if (actionsTimer != null) clearTimeout(actionsTimer)
})
</script>

<template>
    <footer ref="rootRef" class="rui-bottom-app-bar__host">
        <RSurface v-bind="attrs" as="div" :class="rootClasses" :color="props.color" :elevation="8">
            <svg class="rui-bottom-app-bar__shape" :viewBox="viewBox" preserveAspectRatio="none" aria-hidden="true">
                <path :d="cradlePath" />
            </svg>
            <div
                class="rui-bottom-app-bar__toolbar"
                role="toolbar"
                :aria-label="ariaLabel"
                :aria-labelledby="ariaLabelledby"
            >
                <div v-if="$slots.navigation" class="rui-bottom-app-bar__navigation">
                    <slot name="navigation" />
                </div>
                <div v-if="$slots.actions" ref="actionsRef" :class="actionsClasses">
                    <slot name="actions" />
                </div>
            </div>
        </RSurface>
    </footer>
</template>

<style scoped lang="scss">
.rui-bottom-app-bar__host {
    display: block;
    inline-size: 100%;
}

.rui-bottom-app-bar {
    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-end: 0;
    --rui-surface-shape-end-start: 0;
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    overflow: visible;
    background-color: transparent;
    color: var(--rui-comp-surface-content-color);
}

.rui-bottom-app-bar__shape {
    position: absolute;
    z-index: 0;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
    fill: var(--rui-comp-surface-background);
}

.rui-bottom-app-bar__toolbar {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    box-sizing: border-box;
    min-block-size: 56px;
    padding-inline: 4px;
    padding-block-end: env(safe-area-inset-bottom, 0px);
}

.rui-bottom-app-bar__navigation,
.rui-bottom-app-bar__actions {
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    transition: opacity 150ms var(--rui-sys-motion-easing-standard);
}

.rui-bottom-app-bar__navigation {
    grid-column: 1;
    justify-self: start;
}

.rui-bottom-app-bar__actions {
    grid-column: 3;
}

.rui-bottom-app-bar__actions--end {
    justify-self: end;
}

.rui-bottom-app-bar__actions--start {
    grid-column: 1 / 3;
    justify-self: start;
    margin-inline-start: 48px;
}

.rui-bottom-app-bar:not(.rui-bottom-app-bar--actions-visible) .rui-bottom-app-bar__actions {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .rui-bottom-app-bar__navigation,
    .rui-bottom-app-bar__actions {
        transition-duration: 0ms;
    }
}
</style>
