<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, shallowRef, watch } from "vue"

import type { RResponsiveContainerMode } from "@/components/layout/responsive/types.ts"

import type { RScaffoldLayoutProps } from "./types.ts"

import {
    scaffoldContextKey,
    type RScaffoldBottomAppBarFabState,
    type RScaffoldBottomAppBarRegistration,
    type RScaffoldBottomBarState,
    type RScaffoldScrollFacts,
    type RScaffoldScrollMotionDirection,
} from "./context.ts"

const props = withDefaults(defineProps<RScaffoldLayoutProps>(), {
    scrollDirection: "vertical",
    gridMode: "centered",
    fabPlacement: "viewport",
    bottomBarHideOnScroll: false,
})

const scrollFacts = ref<RScaffoldScrollFacts>({
    top: 0,
    maxTop: 0,
    delta: 0,
    direction: "idle",
    atStart: true,
    atEnd: true,
    timestamp: 0,
})
const bodyGridMode = ref<RResponsiveContainerMode>(props.gridMode)
const bottomBarHideOnScroll = ref(false)
const bottomBarState = ref<RScaffoldBottomBarState>("shown")
const bottomBarHeight = ref(0)
const bottomBarFabOffset = computed(() => (bottomBarState.value === "shown" ? bottomBarHeight.value : 0))
const scrollbarWidth = ref(0)
const topInset = ref<number | null>(null)
const bodyElement = ref<HTMLElement | null>(null)
const bottomBarElement = ref<HTMLElement | null>(null)
const fabElement = ref<HTMLElement | null>(null)
const bottomAppBar = shallowRef<RScaffoldBottomAppBarRegistration | null>(null)
const dockedFabState = ref<RScaffoldBottomAppBarFabState>({
    element: null,
    inlineSize: 0,
    blockSize: 0,
    visible: false,
})
const dockedFabAlignment = ref<"center" | "end">("center")
const dockedFabScaleHidden = ref(false)
const topInsetOwners = new Map<symbol, number | null>()
let previousScrollTop = 0
let scrollFrame = 0
let pendingScrollFacts: RScaffoldScrollFacts | null = null
let bottomBarResizeObserver: ResizeObserver | null = null
let bodyResizeObserver: ResizeObserver | null = null
let fabResizeObserver: ResizeObserver | null = null
let fabScaleTimer: ReturnType<typeof setTimeout> | null = null

const classes = computed(() => ["rui-scaffold", `rui-scaffold--scroll-${props.scrollDirection}`])
const hasDockedFab = computed(() => !!bottomAppBar.value && !!dockedFabState.value.element)
const fabClasses = computed(() => [
    `rui-scaffold__fab--${props.fabPlacement}`,
    {
        "rui-scaffold__fab--bottom-bar-offset": props.fabPlacement !== "app-bar-seam" && !hasDockedFab.value,
        "rui-scaffold__fab--docked": hasDockedFab.value,
        "rui-scaffold__fab--docked-end": hasDockedFab.value && dockedFabAlignment.value === "end",
        "rui-scaffold__fab--docked-scale-hidden": dockedFabScaleHidden.value,
    },
])
const fabStyle = computed(() => {
    if (!hasDockedFab.value) return undefined

    const fab = dockedFabState.value
    return {
        "--rui-comp-scaffold-docked-fab-inline-size": `${fab.inlineSize}px`,
        "--rui-comp-scaffold-docked-fab-block-end": `${Math.max(0, bottomBarHeight.value - fab.blockSize / 2 - bottomAppBar.value!.fabCradleVerticalOffset.value)}px`,
    }
})
const style = computed(() => ({
    "--rui-comp-scaffold-body-top-inset":
        topInset.value == null ? (props.initialTopInset ?? "0px") : `${topInset.value}px`,
    "--rui-comp-scaffold-bottom-bar-height": `${bottomBarHeight.value}px`,
    "--rui-comp-scaffold-fab-bottom-offset": `${bottomBarFabOffset.value}px`,
    "--rui-scaffold-scrollbar-width": `${scrollbarWidth.value}px`,
}))

function publishTopInset() {
    const values = Array.from(topInsetOwners.values())
    topInset.value = values.at(-1) ?? null
}

function registerTopInset() {
    const owner = Symbol("scaffold-top-inset")
    topInsetOwners.set(owner, null)
    publishTopInset()
    return {
        set(value: number) {
            topInsetOwners.set(owner, value > 0 || props.initialTopInset === undefined ? Math.max(0, value) : null)
            publishTopInset()
        },
        dispose() {
            if (!topInsetOwners.delete(owner)) return
            publishTopInset()
        },
    }
}

watch(
    () => props.gridMode,
    (mode) => {
        bodyGridMode.value = mode
    },
)

watch(bodyElement, (element) => {
    bodyResizeObserver?.disconnect()
    bodyResizeObserver = null
    if (!element) {
        scrollbarWidth.value = 0
        return
    }
    const updateScrollbarWidth = () => {
        scrollbarWidth.value = Math.max(0, element.offsetWidth - element.clientWidth)
    }
    updateScrollbarWidth()
    if (typeof ResizeObserver !== "undefined") {
        bodyResizeObserver = new ResizeObserver(updateScrollbarWidth)
        bodyResizeObserver.observe(element)
    }
})

watch(bottomBarElement, (element) => {
    bottomBarResizeObserver?.disconnect()
    bottomBarResizeObserver = null
    if (!element || typeof ResizeObserver === "undefined") {
        bottomBarHeight.value = 0
        return
    }
    const updateHeight = () => {
        bottomBarHeight.value = element.getBoundingClientRect().height
    }
    bottomBarResizeObserver = new ResizeObserver(updateHeight)
    bottomBarResizeObserver.observe(element)
    updateHeight()
})

function registerBottomAppBar(registration: RScaffoldBottomAppBarRegistration) {
    bottomAppBar.value = registration
    dockedFabAlignment.value = registration.fabAlignmentMode.value
    syncDockedFab()

    const stopAlignment = watch(registration.fabAlignmentMode, (alignment, previousAlignment) => {
        if (registration.fabAnimationMode.value === "scale" && previousAlignment !== alignment) {
            if (fabScaleTimer != null) clearTimeout(fabScaleTimer)
            dockedFabScaleHidden.value = true
            fabScaleTimer = setTimeout(() => {
                dockedFabAlignment.value = alignment
                dockedFabScaleHidden.value = false
                fabScaleTimer = null
            }, 150)
            return
        }

        dockedFabAlignment.value = alignment
    })
    const stopHideOnScroll = watch(
        registration.hideOnScroll,
        (enabled) => {
            bottomBarHideOnScroll.value = enabled
            if (!enabled) bottomBarState.value = "shown"
        },
        { immediate: true },
    )

    return () => {
        stopAlignment()
        stopHideOnScroll()
        if (fabScaleTimer != null) clearTimeout(fabScaleTimer)
        fabScaleTimer = null
        dockedFabScaleHidden.value = false
        if (bottomAppBar.value !== registration) return
        bottomAppBar.value = null
        dockedFabState.value = { element: null, inlineSize: 0, blockSize: 0, visible: false }
        bottomBarHideOnScroll.value = props.bottomBarHideOnScroll
        if (!bottomBarHideOnScroll.value) bottomBarState.value = "shown"
    }
}

function syncDockedFab() {
    fabResizeObserver?.disconnect()
    fabResizeObserver = null
    const host = fabElement.value
    const candidate = host?.firstElementChild as HTMLElement | null
    const standardFab = candidate?.querySelector<HTMLElement>(".rui-fab.rui-fab--standard.rui-fab--normal")
    if (!candidate || !standardFab || !bottomAppBar.value) {
        dockedFabState.value = { element: null, inlineSize: 0, blockSize: 0, visible: false }
        bottomAppBar.value?.onFabStateChange(dockedFabState.value)
        return
    }

    const publish = () => {
        const rect = standardFab.getBoundingClientRect()
        const visibility = standardFab.closest<HTMLElement>(".rui-fab__visibility")
        const visible = visibility == null || visibility.classList.contains("rui-fab__visibility--visible")
        dockedFabState.value = {
            element: standardFab,
            inlineSize: rect.width,
            blockSize: rect.height,
            visible,
        }
        bottomAppBar.value?.onFabStateChange(dockedFabState.value)
    }
    if (typeof ResizeObserver !== "undefined") {
        fabResizeObserver = new ResizeObserver(publish)
        fabResizeObserver.observe(standardFab)
    }
    publish()
}

watch(fabElement, () => nextTick(syncDockedFab), { flush: "post" })

watch(
    () => props.bottomBarHideOnScroll,
    (enabled) => {
        if (bottomAppBar.value) return
        bottomBarHideOnScroll.value = enabled
        if (!enabled) bottomBarState.value = "shown"
    },
    { immediate: true },
)

function scheduleScrollFacts(facts: RScaffoldScrollFacts) {
    pendingScrollFacts = facts
    if (scrollFrame) return
    scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        if (pendingScrollFacts) scrollFacts.value = pendingScrollFacts
    })
}

function handleScroll(event: Event) {
    if (props.scrollDirection !== "vertical") return
    const target = event.currentTarget as HTMLElement
    const top = Math.max(0, target.scrollTop)
    const maxTop = Math.max(0, target.scrollHeight - target.clientHeight)
    const delta = top - previousScrollTop
    const atStart = top <= 0
    const atEnd = top >= maxTop - 1
    const direction: RScaffoldScrollMotionDirection = atStart
        ? "up"
        : Math.abs(delta) >= 4
          ? delta > 0
              ? "down"
              : "up"
          : "idle"

    if (atStart) {
        bottomBarState.value = "shown"
    } else if (bottomBarHideOnScroll.value && direction !== "idle") {
        bottomBarState.value = direction === "down" ? "hidden" : "shown"
    }

    previousScrollTop = top
    scheduleScrollFacts({ top, maxTop, delta, direction, atStart, atEnd, timestamp: performance.now() })
}

onBeforeUnmount(() => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame)
    bodyResizeObserver?.disconnect()
    bottomBarResizeObserver?.disconnect()
    fabResizeObserver?.disconnect()
    if (fabScaleTimer != null) clearTimeout(fabScaleTimer)
})

provide(scaffoldContextKey, {
    scrollDirection: computed(() => props.scrollDirection),
    scrollFacts: computed(() => scrollFacts.value),
    bodyGridMode: computed(() => bodyGridMode.value),
    fabPlacement: computed(() => props.fabPlacement),
    topInset: computed(() => topInset.value ?? 0),
    bottomBarState: computed(() => bottomBarState.value),
    bottomBarHeight: computed(() => bottomBarHeight.value),
    registerTopInset,
    setBottomBarHideOnScroll(enabled) {
        bottomBarHideOnScroll.value = enabled
        if (!enabled) bottomBarState.value = "shown"
    },
    setBottomBarHeight(height) {
        bottomBarHeight.value = height
    },
    registerBottomAppBar,
})
</script>

<template>
    <section :class="classes" :style="style" :data-rui-scaffold-axis="scrollDirection">
        <div v-if="$slots.navigation" class="rui-scaffold__navigation">
            <slot name="navigation" />
        </div>

        <div v-if="$slots['clipped-navigation']" class="rui-scaffold__clipped-navigation">
            <slot name="clipped-navigation" />
        </div>

        <div v-if="$slots['app-bar']" class="rui-scaffold__app-bar">
            <slot name="app-bar" />
        </div>

        <div class="rui-scaffold__main">
            <main ref="bodyElement" class="rui-scaffold__body" @scroll="handleScroll">
                <div class="rui-scaffold__body-content">
                    <slot />
                </div>
            </main>

            <footer
                v-if="$slots['bottom-bar']"
                ref="bottomBarElement"
                class="rui-scaffold__bottom-bar"
                :class="{ 'rui-scaffold__bottom-bar--hidden': bottomBarState === 'hidden' }"
            >
                <slot name="bottom-bar" />
            </footer>
            <div v-if="$slots.fab" ref="fabElement" class="rui-scaffold__fab" :class="fabClasses" :style="fabStyle">
                <slot name="fab" />
            </div>
        </div>

        <aside v-if="$slots['side-sheet']" class="rui-scaffold__side-sheet">
            <slot name="side-sheet" />
        </aside>

        <aside v-if="$slots['clipped-side-sheet']" class="rui-scaffold__clipped-side-sheet">
            <slot name="clipped-side-sheet" />
        </aside>

        <slot name="modal" />
    </section>
</template>

<style scoped lang="scss">
.rui-scaffold {
    container-type: inline-size;
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: var(--rui-comp-scaffold-body-top-inset, 0px) minmax(0, 1fr);
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
    background: var(--rui-sys-color-background, #fff);
}

.rui-scaffold__navigation {
    grid-column: 1;
    grid-row: 1 / -1;
    inline-size: max-content;
    justify-self: start;
}

.rui-scaffold__side-sheet {
    grid-column: 3;
    grid-row: 1 / -1;
}

.rui-scaffold__clipped-navigation {
    grid-column: 1;
    grid-row: 2;
}

.rui-scaffold__clipped-side-sheet {
    grid-column: 3;
    grid-row: 2;
}

.rui-scaffold__navigation,
.rui-scaffold__side-sheet,
.rui-scaffold__clipped-navigation,
.rui-scaffold__clipped-side-sheet {
    display: grid;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
}

.rui-scaffold__navigation :deep(.rui-navigation-rail),
.rui-scaffold__clipped-navigation :deep(.rui-navigation-rail) {
    block-size: 100%;
}

.rui-scaffold__app-bar {
    z-index: 3;
    grid-column: 1 / -1;
    grid-row: 1;
    min-inline-size: 0;
    min-block-size: 0;
}

.rui-scaffold__app-bar :deep(.rui-app-bar-container) {
    position: relative;
    inset-block-start: auto;
    margin-block-end: 0;
}

.rui-scaffold:has(> .rui-scaffold__navigation) > .rui-scaffold__app-bar {
    grid-column: 2 / -1;
}

.rui-scaffold:has(> .rui-scaffold__side-sheet) > .rui-scaffold__app-bar {
    grid-column: 1 / 3;
}

.rui-scaffold:has(> .rui-scaffold__navigation):has(> .rui-scaffold__side-sheet) > .rui-scaffold__app-bar {
    grid-column: 2 / 3;
}

.rui-scaffold__main {
    grid-column: 2;
    grid-row: 1 / -1;
    display: grid;
    grid-template-rows: var(--rui-comp-scaffold-body-top-inset) minmax(0, 1fr);
    position: relative;
    min-inline-size: 0;
    min-block-size: 0;
}

.rui-scaffold__body {
    z-index: 0;
    grid-row: 2;
    position: relative;
    min-inline-size: 0;
    min-block-size: 0;
    block-size: 100%;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
}

.rui-scaffold__body-content {
    block-size: 100%;
    min-block-size: 100%;
}

.rui-scaffold--scroll-vertical .rui-scaffold__body {
    overflow-x: hidden;
    overflow-y: auto;
}

.rui-scaffold--scroll-none .rui-scaffold__body {
    overflow: visible;
}

.rui-scaffold--scroll-horizontal .rui-scaffold__body {
    overflow: hidden;
}

.rui-scaffold__bottom-bar {
    position: absolute;
    z-index: 3;
    inset-inline: 0;
    inset-block-end: 0;
    inset-inline-end: var(--rui-scaffold-scrollbar-width, 0px);
    pointer-events: auto;
    transition: transform 225ms var(--rui-sys-motion-easing-decelerated);
}

.rui-scaffold__bottom-bar--hidden {
    transform: translateY(var(--rui-comp-scaffold-bottom-bar-height, 0px));
    transition-duration: 175ms;
    transition-timing-function: var(--rui-sys-motion-easing-accelerated);
    pointer-events: none;
}

.rui-scaffold__fab {
    position: absolute;
    z-index: 4;
    inset-inline-end: 24px;
    inset-block-end: calc(24px + var(--rui-comp-scaffold-fab-bottom-offset, 0px));
    transition: inset-block-end 225ms var(--rui-sys-motion-easing-decelerated);
}

.rui-scaffold__fab--bottom-bar-offset {
    pointer-events: auto;
}

.rui-scaffold__fab--docked {
    inset-inline-end: auto;
    inset-block-end: var(--rui-comp-scaffold-docked-fab-block-end);
    inset-inline-start: calc(50% - var(--rui-comp-scaffold-docked-fab-inline-size) / 2);
    transition:
        inset-inline-start 300ms var(--rui-sys-motion-easing-standard),
        inset-block-end 0ms linear;
}

.rui-scaffold__fab--docked-end {
    inset-inline-start: auto;
    inset-inline-end: calc(60px - var(--rui-comp-scaffold-docked-fab-inline-size) / 2);
}

.rui-scaffold__fab--docked-scale-hidden {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
}

.rui-scaffold__fab--app-bar-seam {
    inset-block-start: calc(var(--rui-comp-scaffold-body-top-inset) - 28px);
    inset-block-end: auto;
}
</style>
