import { computed, onBeforeUnmount, ref, watch, type MaybeRefOrGetter, type Ref, toValue } from "vue"

import type { RScaffoldScrollDirection, RScaffoldScrollFacts } from "@/components/scaffold/context"

import type { RAppBarScrollBehavior } from "./types"
import type { RAppBarScrollState } from "./context"

type AppBarScrollSource = {
    direction: Readonly<Ref<RScaffoldScrollDirection>>
    facts: Readonly<Ref<RScaffoldScrollFacts>>
}

type AppBarScrollOptions = {
    root: Ref<HTMLElement | null>
    source: AppBarScrollSource | null
    expandedHeight: MaybeRefOrGetter<string | undefined>
    collapsedHeight: MaybeRefOrGetter<string | undefined>
    scrollBehavior: MaybeRefOrGetter<RAppBarScrollBehavior>
    hideOnScroll: MaybeRefOrGetter<boolean>
    liftOnScroll: MaybeRefOrGetter<boolean>
}

const emptyState: RAppBarScrollState = {
    collapseOffset: 0,
    collapseDistance: 0,
    collapseProgress: 0,
    visibleHeight: 0,
    hideOffset: 0,
    lifted: false,
    phase: "expanded",
}

export function useAppBarScroll(options: AppBarScrollOptions) {
    const state = ref<RAppBarScrollState>({ ...emptyState })
    let frameRequest = 0
    let resizeObserver: ResizeObserver | null = null

    function resolveHeight(value: string | undefined, variable: string, fallback: number) {
        const root = options.root.value
        if (!root) return fallback
        const resolved = value ?? getComputedStyle(root).getPropertyValue(variable).trim()
        if (!resolved) return fallback
        const probe = document.createElement("div")
        probe.style.position = "absolute"
        probe.style.visibility = "hidden"
        probe.style.pointerEvents = "none"
        probe.style.blockSize = resolved
        root.appendChild(probe)
        const height = probe.getBoundingClientRect().height
        probe.remove()
        return height || fallback
    }

    function publish() {
        frameRequest = 0
        const source = options.source
        const root = options.root.value
        if (!root) {
            state.value = { ...emptyState }
            return
        }

        const collapsed = resolveHeight(toValue(options.collapsedHeight), "--rui-comp-app-bar-collapsed-height", 56)
        const expanded = Math.max(
            collapsed,
            resolveHeight(toValue(options.expandedHeight), "--rui-comp-app-bar-expanded-height", collapsed),
        )

        if (!source || source.direction.value !== "vertical") {
            state.value = { ...emptyState, visibleHeight: expanded }
            return
        }

        const collapseDistance = expanded - collapsed
        const facts = source.facts.value
        const behavior = toValue(options.scrollBehavior)
        const collapseOffset = behavior === "fixed" ? 0 : Math.min(collapseDistance, Math.max(0, facts.top))
        const collapseProgress = collapseDistance ? collapseOffset / collapseDistance : 0
        const hidden = Boolean(toValue(options.hideOnScroll) && facts.direction === "down" && facts.top > collapseDistance)
        const phase = hidden ? "hidden" : collapseProgress >= 1 ? "collapsed" : collapseProgress > 0 ? "collapsing" : "expanded"

        state.value = {
            collapseOffset,
            collapseDistance,
            collapseProgress,
            visibleHeight: expanded - collapseOffset,
            hideOffset: hidden ? expanded : 0,
            lifted: Boolean(toValue(options.liftOnScroll) && facts.top > 0),
            phase,
        }
    }

    function refresh() {
        publish()
    }

    function schedule() {
        if (typeof requestAnimationFrame === "undefined") {
            publish()
            return
        }
        if (!frameRequest) frameRequest = requestAnimationFrame(publish)
    }

    watch(
        [
            () => options.source?.facts.value.timestamp,
            () => options.source?.direction.value,
            () => toValue(options.expandedHeight),
            () => toValue(options.collapsedHeight),
            () => toValue(options.scrollBehavior),
            () => toValue(options.hideOnScroll),
            () => toValue(options.liftOnScroll),
            options.root,
        ],
        schedule,
        { immediate: true, flush: "post" },
    )

    watch(
        options.root,
        (root) => {
            resizeObserver?.disconnect()
            resizeObserver = null
            if (!root || typeof ResizeObserver === "undefined") return
            resizeObserver = new ResizeObserver(schedule)
            resizeObserver.observe(root)
        },
        { flush: "post" },
    )

    onBeforeUnmount(() => {
        if (frameRequest && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frameRequest)
        resizeObserver?.disconnect()
    })

    return { state: computed(() => state.value), refresh }
}
