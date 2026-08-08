<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"

import type { RScaffoldProps } from "./types"

import { scaffoldContextKey, type RScaffoldAppBarState, type RScaffoldBottomBarState, type RScaffoldScrollMotionDirection } from "./context"

const props = withDefaults(defineProps<RScaffoldProps>(), {
    scrollDirection: "vertical",
    fabPlacement: "viewport",
    bottomBarHideOnScroll: false,
})

const scrollTop = ref(0)
const scrollMotionDirection = ref<RScaffoldScrollMotionDirection>("idle")
const appBarState = ref<RScaffoldAppBarState>("expanded")
const bodyGridMode = ref<RResponsiveContainerMode | null>(null)
const appBarExpandedHeight = ref<string>()
const appBarCollapsedHeight = ref<string>()
const appBarHideOnScroll = ref(false)
const appBarCollapsing = ref(false)
const bottomBarHideOnScroll = ref(false)
const bottomBarState = ref<RScaffoldBottomBarState>("shown")
const bottomBarHeight = ref(0)
const bottomBarFabOffset = computed(() => (bottomBarState.value === "shown" ? bottomBarHeight.value : 0))
const scrollbarWidth = ref(0)
const bodyElement = ref<HTMLElement | null>(null)
const bottomBarElement = ref<HTMLElement | null>(null)
let previousScrollTop = 0
let bottomBarResizeObserver: ResizeObserver | null = null
let bodyResizeObserver: ResizeObserver | null = null

const appBarOffset = computed(() => {
    if (appBarState.value === "hidden") {
        return "0px"
    }

    return appBarState.value === "collapsed"
        ? "var(--rui-comp-scaffold-app-bar-collapsed-height)"
        : "var(--rui-comp-scaffold-app-bar-expanded-height)"
})

const appBarFlowHeight = computed(() => {
    if (appBarState.value === "collapsed" || (appBarState.value === "hidden" && appBarCollapsing.value)) {
        return "var(--rui-comp-scaffold-app-bar-collapsed-height)"
    }

    return "var(--rui-comp-scaffold-app-bar-expanded-height)"
})

const classes = computed(() => [
    "rui-scaffold",
    `rui-scaffold--scroll-${props.scrollDirection}`,
    `rui-scaffold--app-bar-${appBarState.value}`,
])

const style = computed(() => ({
    ...(appBarExpandedHeight.value !== undefined ? { "--rui-comp-scaffold-app-bar-expanded-height": appBarExpandedHeight.value } : {}),
    ...(appBarCollapsedHeight.value !== undefined ? { "--rui-comp-scaffold-app-bar-collapsed-height": appBarCollapsedHeight.value } : {}),
    "--rui-comp-scaffold-app-bar-offset": appBarOffset.value,
    "--rui-comp-scaffold-app-bar-flow-height": appBarFlowHeight.value,
    "--rui-comp-scaffold-app-bar-fab-top": appBarOffset.value,
    "--rui-comp-scaffold-bottom-bar-height": `${bottomBarHeight.value}px`,
    "--rui-comp-scaffold-fab-bottom-offset": `${bottomBarFabOffset.value}px`,
    "--rui-scaffold-scrollbar-width": `${scrollbarWidth.value}px`,
}))

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

watch(bottomBarElement, (element, previousElement) => {
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
        if (!enabled) {
            bottomBarState.value = "shown"
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    bodyResizeObserver?.disconnect()
    bottomBarResizeObserver?.disconnect()
})

function handleScroll(event: Event) {
    if (props.scrollDirection !== "vertical") return

    const target = event.currentTarget as HTMLElement
    const nextTop = Math.max(0, target.scrollTop)
    const delta = nextTop - previousScrollTop
    const maxScrollTop = Math.max(0, target.scrollHeight - target.clientHeight)
    const isAtTop = nextTop <= 0
    const isAtBottom = nextTop >= maxScrollTop - 1

    if (isAtTop) {
        appBarState.value = "expanded"
        bottomBarState.value = "shown"
        scrollMotionDirection.value = "up"
    } else if (Math.abs(delta) >= 4) {
        scrollMotionDirection.value = delta > 0 ? "down" : "up"

        if (appBarHideOnScroll.value) {
            if (delta > 0 && !isAtBottom && appBarState.value !== "hidden") {
                appBarState.value = "hidden"
            } else if (delta < 0 && !isAtBottom && appBarState.value === "hidden") {
                appBarState.value = "collapsed"
            }
        }

        if (bottomBarHideOnScroll.value) {
            if (delta > 0 && bottomBarState.value !== "hidden") {
                bottomBarState.value = "hidden"
            } else if (delta < 0 && bottomBarState.value === "hidden") {
                bottomBarState.value = "shown"
            }
        }
    }

    scrollTop.value = nextTop
    previousScrollTop = nextTop

    if (appBarState.value !== "hidden") {
        appBarState.value = appBarCollapsing.value && nextTop > 48 ? "collapsed" : "expanded"
    }
}

provide(scaffoldContextKey, {
    scrollDirection: computed(() => props.scrollDirection),
    scrollState: computed(() => ({ top: scrollTop.value, direction: scrollMotionDirection.value })),
    appBarState: computed(() => appBarState.value),
    bodyGridMode: computed(() => bodyGridMode.value),
    fabPlacement: computed(() => props.fabPlacement),
    appBarExpandedHeight: computed(() => appBarExpandedHeight.value),
    appBarOffset,
    appBarHideOnScroll: computed(() => appBarHideOnScroll.value),
    appBarCollapsing: computed(() => appBarCollapsing.value),
    bottomBarState: computed(() => bottomBarState.value),
    setBodyGridMode(mode) {
        bodyGridMode.value = mode
    },
    setAppBarExpandedHeight(height) {
        appBarExpandedHeight.value = height
    },
    setAppBarCollapsedHeight(height) {
        appBarCollapsedHeight.value = height
    },
    setAppBarHideOnScroll(enabled) {
        appBarHideOnScroll.value = enabled
        if (!enabled && appBarState.value === "hidden") {
            appBarState.value = appBarCollapsing.value && scrollTop.value > 48 ? "collapsed" : "expanded"
        }
    },
    setAppBarCollapsing(enabled) {
        appBarCollapsing.value = enabled
        if (!enabled && appBarState.value === "collapsed") {
            appBarState.value = "expanded"
        }
    },
    setBottomBarHideOnScroll(enabled) {
        bottomBarHideOnScroll.value = enabled
        if (!enabled) {
            bottomBarState.value = "shown"
        }
    },
})
</script>

<template>
    <section
        :class="classes"
        :style="style"
        :data-rui-scaffold-axis="scrollDirection"
        :data-rui-scaffold-bars="scrollMotionDirection === 'down' && scrollTop > 24 ? 'hidden' : 'visible'"
        :data-rui-scaffold-app-bar="appBarState"
    >
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
@use "@/styles/breakpoints" as breakpoint;

.rui-scaffold {
    --rui-comp-scaffold-app-bar-expanded-height: 56px;
    --rui-comp-scaffold-app-bar-collapsed-height: 56px;
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

    @include breakpoint.c-up(clg) {
        --rui-comp-scaffold-app-bar-expanded-height: 64px;
        --rui-comp-scaffold-app-bar-collapsed-height: 64px;
    }
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
    padding-block-start: var(--rui-comp-scaffold-app-bar-expanded-height);
}

.rui-scaffold--app-bar-hidden .rui-scaffold__body-content {
    padding-block-start: var(--rui-comp-scaffold-app-bar-expanded-height);
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

@media (prefers-reduced-motion: reduce) {
    .rui-scaffold__app-bar,
    .rui-scaffold__body-content {
        transition-duration: 0ms !important;
    }
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
    inset-block-start: calc(var(--rui-comp-scaffold-app-bar-fab-top) - 28px);
    inset-block-end: auto;
}
</style>
