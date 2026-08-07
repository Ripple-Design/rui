<script setup lang="ts">
import { computed, provide, ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsive/types"

import type { RScaffoldProps } from "./types"

import { scaffoldContextKey, type RScaffoldAppBarState, type RScaffoldScrollMotionDirection } from "./context"

const props = withDefaults(defineProps<RScaffoldProps>(), {
    scrollDirection: "vertical",
    fabPlacement: "viewport",
})

const scrollTop = ref(0)
const scrollMotionDirection = ref<RScaffoldScrollMotionDirection>("idle")
const appBarState = ref<RScaffoldAppBarState>("expanded")
const bodyGridMode = ref<RResponsiveContainerMode | null>(null)
const appBarExpandedHeight = ref("64px")
const appBarCollapsedHeight = ref("64px")
const appBarHideOnScroll = ref(false)
const appBarCollapsing = ref(false)
let previousScrollTop = 0

const appBarOffset = computed(() => {
    if (appBarState.value === "hidden") {
        return "0px"
    }

    return appBarState.value === "collapsed" ? appBarCollapsedHeight.value : appBarExpandedHeight.value
})

const appBarFlowHeight = computed(() => {
    if (appBarState.value === "collapsed" || (appBarState.value === "hidden" && appBarCollapsing.value)) {
        return appBarCollapsedHeight.value
    }

    return appBarExpandedHeight.value
})

const classes = computed(() => [
    "rui-scaffold",
    `rui-scaffold--scroll-${props.scrollDirection}`,
    `rui-scaffold--app-bar-${appBarState.value}`,
])

const style = computed(() => ({
    "--rui-comp-scaffold-app-bar-offset": appBarOffset.value,
    "--rui-comp-scaffold-app-bar-expanded-height": appBarExpandedHeight.value,
    "--rui-comp-scaffold-app-bar-flow-height": appBarFlowHeight.value,
    "--rui-comp-scaffold-app-bar-fab-top": appBarOffset.value,
}))

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
            <main class="rui-scaffold__body" @scroll="handleScroll">
                <header v-if="$slots['app-bar']" class="rui-scaffold__app-bar">
                    <slot name="app-bar" />
                </header>

                <div class="rui-scaffold__body-content">
                    <slot />
                </div>
            </main>

            <footer v-if="$slots['bottom-bar']" class="rui-scaffold__bottom-bar">
                <slot name="bottom-bar" />
            </footer>
        </div>

        <aside v-if="$slots['side-sheet']" class="rui-scaffold__side-sheet">
            <slot name="side-sheet" />
        </aside>

        <div v-if="$slots.fab" class="rui-scaffold__fab" :class="`rui-scaffold__fab--${props.fabPlacement}`">
            <slot name="fab" />
        </div>

        <slot name="modal" />
    </section>
</template>

<style scoped lang="scss">
.rui-scaffold {
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
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    min-inline-size: 0;
    min-block-size: 0;
}

.rui-scaffold__app-bar {
    position: sticky;
    z-index: 3;
    inset-block-start: 0;
    inline-size: calc(100% - var(--rui-scaffold-scrollbar-width, 0px));
    margin-block-end: calc(-1 * var(--rui-comp-scaffold-app-bar-expanded-height, 64px));
    overflow-anchor: none;
    transition: transform 225ms var(--rui-sys-motion-easing-decelerated), margin-block-end 225ms var(--rui-sys-motion-easing-decelerated);
}

.rui-scaffold--app-bar-hidden .rui-scaffold__app-bar {
    transform: translateY(-100%);
    transition-duration: 175ms;
    transition-timing-function: var(--rui-sys-motion-easing-accelerated);
}

.rui-scaffold--app-bar-expanded .rui-scaffold__app-bar,
.rui-scaffold--app-bar-collapsed .rui-scaffold__app-bar {
    transform: translateY(0);
}

.rui-scaffold__body {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
}

.rui-scaffold__body-content {
    min-block-size: 100%;
    padding-block-start: var(--rui-comp-scaffold-app-bar-expanded-height, 64px);
}

.rui-scaffold--app-bar-hidden .rui-scaffold__body-content {
    padding-block-start: var(--rui-comp-scaffold-app-bar-expanded-height, 64px);
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
    position: relative;
    z-index: 2;
}

.rui-scaffold__fab {
    position: absolute;
    z-index: 4;
    inset-inline-end: 24px;
    inset-block-end: 24px;
    pointer-events: none;
}

.rui-scaffold__fab :deep(*) {
    pointer-events: auto;
}

.rui-scaffold__fab--app-bar-seam {
    inset-block-start: calc(var(--rui-comp-scaffold-app-bar-fab-top) - 28px);
    inset-block-end: auto;
}
</style>
