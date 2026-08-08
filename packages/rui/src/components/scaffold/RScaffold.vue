<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"

import { scaffoldContextKey, type RScaffoldBottomBarState, type RScaffoldScrollFacts, type RScaffoldScrollMotionDirection } from "./context"
import type { RScaffoldProps } from "./types"

const props = withDefaults(defineProps<RScaffoldProps>(), {
    scrollDirection: "vertical",
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
const bodyGridMode = ref<RResponsiveContainerMode | null>(null)
const bottomBarHideOnScroll = ref(false)
const bottomBarState = ref<RScaffoldBottomBarState>("shown")
const bottomBarHeight = ref(0)
const bottomBarFabOffset = computed(() => (bottomBarState.value === "shown" ? bottomBarHeight.value : 0))
const scrollbarWidth = ref(0)
const topInset = ref(0)
const bodyElement = ref<HTMLElement | null>(null)
const bottomBarElement = ref<HTMLElement | null>(null)
const topInsetOwners = new Map<symbol, number>()
let previousScrollTop = 0
let scrollFrame = 0
let pendingScrollFacts: RScaffoldScrollFacts | null = null
let bottomBarResizeObserver: ResizeObserver | null = null
let bodyResizeObserver: ResizeObserver | null = null

const classes = computed(() => ["rui-scaffold", `rui-scaffold--scroll-${props.scrollDirection}`])
const style = computed(() => ({
    "--rui-comp-scaffold-body-top-inset": `${topInset.value}px`,
    "--rui-comp-scaffold-bottom-bar-height": `${bottomBarHeight.value}px`,
    "--rui-comp-scaffold-fab-bottom-offset": `${bottomBarFabOffset.value}px`,
    "--rui-scaffold-scrollbar-width": `${scrollbarWidth.value}px`,
}))

function publishTopInset() {
    const values = Array.from(topInsetOwners.values())
    topInset.value = values.at(-1) ?? 0
}

function registerTopInset() {
    const owner = Symbol("scaffold-top-inset")
    topInsetOwners.set(owner, 0)
    publishTopInset()
    return {
        set(value: number) {
            topInsetOwners.set(owner, Math.max(0, value))
            publishTopInset()
        },
        dispose() {
            if (!topInsetOwners.delete(owner)) return
            publishTopInset()
        },
    }
}

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

watch(
    () => props.bottomBarHideOnScroll,
    (enabled) => {
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
    const direction: RScaffoldScrollMotionDirection = atStart ? "up" : Math.abs(delta) >= 4 ? delta > 0 ? "down" : "up" : "idle"

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
})

provide(scaffoldContextKey, {
    scrollDirection: computed(() => props.scrollDirection),
    scrollFacts: computed(() => scrollFacts.value),
    bodyGridMode: computed(() => bodyGridMode.value),
    fabPlacement: computed(() => props.fabPlacement),
    topInset: computed(() => topInset.value),
    bottomBarState: computed(() => bottomBarState.value),
    bottomBarHeight: computed(() => bottomBarHeight.value),
    registerTopInset,
    setBodyGridMode(mode) {
        bodyGridMode.value = mode
    },
    setBottomBarHideOnScroll(enabled) {
        bottomBarHideOnScroll.value = enabled
        if (!enabled) bottomBarState.value = "shown"
    },
    setBottomBarHeight(height) {
        bottomBarHeight.value = height
    },
})
</script>

<template>
    <section :class="classes" :style="style" :data-rui-scaffold-axis="scrollDirection">
        <div v-if="$slots.navigation" class="rui-scaffold__navigation">
            <slot name="navigation" />
        </div>

        <div class="rui-scaffold__main">
            <main ref="bodyElement" class="rui-scaffold__body" @scroll="handleScroll">
                <slot name="app-bar" />
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
        </div>

        <aside v-if="$slots['side-sheet']" class="rui-scaffold__side-sheet">
            <slot name="side-sheet" />
        </aside>

        <div
            v-if="$slots.fab"
            class="rui-scaffold__fab"
            :class="[
                `rui-scaffold__fab--${props.fabPlacement}`,
                { 'rui-scaffold__fab--bottom-bar-offset': props.fabPlacement !== 'app-bar-seam' },
            ]"
        >
            <slot name="fab" />
        </div>

        <slot name="modal" />
    </section>
</template>

<style scoped lang="scss">
.rui-scaffold {
    container-type: inline-size;
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
    background: var(--rui-sys-color-background, #fff);
}

.rui-scaffold__navigation {
    grid-column: 1;
}

.rui-scaffold__side-sheet {
    grid-column: 3;
}

.rui-scaffold__navigation,
.rui-scaffold__side-sheet {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
}

.rui-scaffold__main {
    grid-column: 2;
    position: relative;
    min-inline-size: 0;
    min-block-size: 0;
}

.rui-scaffold__body {
    min-inline-size: 0;
    min-block-size: 0;
    block-size: 100%;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
}

.rui-scaffold__body-content {
    min-block-size: 100%;
    padding-block-start: var(--rui-comp-scaffold-body-top-inset);
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

.rui-scaffold__fab--app-bar-seam {
    inset-block-start: calc(var(--rui-comp-scaffold-body-top-inset) - 28px);
    inset-block-end: auto;
}
</style>
