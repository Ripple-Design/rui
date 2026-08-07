<script setup lang="ts">
import { computed, provide, ref } from "vue"

import type { RResponsiveContainerMode } from "@/components/responsiveContainer/types"

import { scaffoldContextKey, type RScaffoldAppBarState, type RScaffoldScrollMotionDirection } from "./context"
import type { RScaffoldProps } from "./types"

const props = withDefaults(defineProps<RScaffoldProps>(), {
    scrollDirection: "vertical",
    fabPlacement: "viewport",
})

const scrollTop = ref(0)
const scrollMotionDirection = ref<RScaffoldScrollMotionDirection>("idle")
const appBarState = ref<RScaffoldAppBarState>("expanded")
const bodyGridMode = ref<RResponsiveContainerMode | null>(null)
const appBarExpandedHeight = ref("64px")
let previousScrollTop = 0

const classes = computed(() => [
    "rui-scaffold",
    `rui-scaffold--scroll-${props.scrollDirection}`,
    {
        "rui-scaffold--bars-hidden": scrollMotionDirection.value === "down" && scrollTop.value > 24,
        "rui-scaffold--app-bar-collapsed": appBarState.value === "collapsed",
    },
])

const style = computed(() => ({
    "--rui-comp-scaffold-app-bar-fab-top": appBarExpandedHeight.value,
}))

function handleScroll(event: Event) {
    if (props.scrollDirection !== "vertical") return

    const target = event.currentTarget as HTMLElement
    const nextTop = Math.max(0, target.scrollTop)
    const delta = nextTop - previousScrollTop

    if (Math.abs(delta) >= 4) {
        scrollMotionDirection.value = delta > 0 ? "down" : "up"
    }

    scrollTop.value = nextTop
    previousScrollTop = nextTop
    appBarState.value = nextTop > 48 ? "collapsed" : "expanded"
}

provide(scaffoldContextKey, {
    scrollDirection: computed(() => props.scrollDirection),
    scrollState: computed(() => ({ top: scrollTop.value, direction: scrollMotionDirection.value })),
    appBarState: computed(() => appBarState.value),
    bodyGridMode: computed(() => bodyGridMode.value),
    fabPlacement: computed(() => props.fabPlacement),
    appBarExpandedHeight: computed(() => appBarExpandedHeight.value),
    setBodyGridMode(mode) {
        bodyGridMode.value = mode
    },
    setAppBarExpandedHeight(height) {
        appBarExpandedHeight.value = height
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
            <header v-if="$slots['app-bar']" class="rui-scaffold__app-bar">
                <slot name="app-bar" />
            </header>

            <main class="rui-scaffold__body" @scroll="handleScroll">
                <slot />
            </main>

            <footer v-if="$slots['bottom-bar']" class="rui-scaffold__bottom-bar">
                <slot name="bottom-bar" />
            </footer>
        </div>

        <aside v-if="$slots['side-sheet']" class="rui-scaffold__side-sheet">
            <slot name="side-sheet" />
        </aside>

        <div
            v-if="$slots.fab"
            class="rui-scaffold__fab"
            :class="`rui-scaffold__fab--${props.fabPlacement}`"
        >
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

.rui-scaffold__main {
    grid-column: 2;
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
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    min-inline-size: 0;
    min-block-size: 0;
}

.rui-scaffold__app-bar {
    position: relative;
    z-index: 2;
    transition: transform 180ms ease;
}

.rui-scaffold--bars-hidden:not(:has(.rui-scaffold__fab--app-bar-seam)) .rui-scaffold__app-bar {
    transform: translateY(-100%);
}

.rui-scaffold__body {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
}

.rui-scaffold--scroll-none .rui-scaffold__body {
    overflow: visible;
}

.rui-scaffold--scroll-horizontal .rui-scaffold__body {
    overflow: hidden;
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
