<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, useAttrs, watch } from "vue"

import { RSurface } from "@/components"
import { selectionModelKey, useSelectionModel } from "@/foundations/selectionModel"
import { useResizeObserver } from "@/utils/useResizeObserver"

import { bottomNavigationKey } from "./context"
import type { RBottomNavigationProps } from "./types"

const props = withDefaults(defineProps<RBottomNavigationProps>(), {
    color: "surface",
    labelVisibility: "auto",
    horizontalTranslation: false,
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const rootRef = ref<HTMLElement | null>(null)
const selection = useSelectionModel(model)
const initialized = ref(false)
const transitionsEnabled = ref(false)
const layoutVersion = ref(0)
let transitionTimer: ReturnType<typeof setTimeout> | null = null

const visibleCount = computed(() => selection.items.value.length)
const labelVisibility = computed<"selected" | "labeled" | "unlabeled">(() => {
    if (props.labelVisibility === "auto" || props.labelVisibility == null) {
        return visibleCount.value <= 3 ? "labeled" : "selected"
    }

    return props.labelVisibility
})
const classes = computed(() => [
    "rui-bottom-navigation",
    `rui-bottom-navigation--color-${props.color}`,
    `rui-bottom-navigation--${labelVisibility.value}`,
    {
        "rui-bottom-navigation--horizontal-translation": props.horizontalTranslation && labelVisibility.value === "selected",
        "rui-bottom-navigation--transitions-enabled": transitionsEnabled.value,
    },
])

provide(selectionModelKey, selection)
provide(bottomNavigationKey, {
    ...selection,
    color: computed(() => props.color),
    horizontalTranslation: computed(() => props.horizontalTranslation),
    labelVisibility,
    layoutVersion: computed(() => layoutVersion.value),
    transitionsEnabled: computed(() => transitionsEnabled.value),
})

function clearTransitionTimer() {
    if (transitionTimer == null) {
        return
    }

    clearTimeout(transitionTimer)
    transitionTimer = null
}

function syncItemWidths() {
    const root = rootRef.value
    if (!root) {
        return
    }

    const items = selection.items.value
    const width = root.clientWidth
    const count = items.length
    if (!count || !width) {
        return
    }

    const layoutWidth = Math.min(width, count * 168)
    const shifting = labelVisibility.value === "selected" && props.horizontalTranslation
    const selectedId = selection.selectedItem.value?.id
    let widths: number[]
    let remainder = 0

    if (!shifting) {
        const itemWidth = Math.min(Math.floor(layoutWidth / count), 168)
        widths = items.map(() => itemWidth)
        remainder = layoutWidth - itemWidth * count
    } else {
        const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId))
        const inactiveCount = count - 1
        const shiftingLayoutWidth = Math.min(layoutWidth, 168 + inactiveCount * 96)

        if (!inactiveCount) {
            widths = [shiftingLayoutWidth]
        } else {
            const activeAvailable = Math.max(0, shiftingLayoutWidth - inactiveCount * 56)
            const activeWidth = Math.min(Math.max(96, activeAvailable), 168)
            const inactiveWidth = Math.min(Math.max(56, Math.floor((shiftingLayoutWidth - activeWidth) / inactiveCount)), 96)
            widths = items.map((_, index) => (index === selectedIndex ? activeWidth : inactiveWidth))
            remainder = shiftingLayoutWidth - activeWidth - inactiveWidth * inactiveCount
        }
    }

    items.forEach((item, index) => {
        const element = item.state.element
        if (!element) {
            return
        }

        const extra = remainder > 0 ? 1 : 0
        remainder -= extra
        element.style.setProperty("--rui-comp-bottom-navigation-item-inline-size", `${widths[index]! + extra}px`)
    })
}

function scheduleWidthSync() {
    nextTick(syncItemWidths)
}

watch(
    () => selection.items.value,
    (items) => {
        if (import.meta.env.DEV && items.length > 5) {
            console.warn("RBottomNavigation supports up to five destinations.")
        }

        layoutVersion.value += 1
        scheduleWidthSync()
    },
    { deep: true, flush: "post" },
)
watch([labelVisibility, () => props.horizontalTranslation], () => {
    layoutVersion.value += 1
    scheduleWidthSync()
})
watch(
    () => model.value,
    (value, previousValue) => {
        scheduleWidthSync()
        if (!initialized.value) {
            initialized.value = true
            return
        }
        if (Object.is(value, previousValue)) {
            return
        }

        clearTransitionTimer()
        transitionsEnabled.value = true
        transitionTimer = setTimeout(() => {
            transitionsEnabled.value = false
            transitionTimer = null
        }, 300)
    },
    { flush: "post" },
)

useResizeObserver(rootRef, scheduleWidthSync)

onBeforeUnmount(clearTransitionTimer)
</script>

<template>
    <RSurface v-bind="attrs" :class="classes" as="nav" :color="props.color" :elevation="8">
        <div ref="rootRef" class="rui-bottom-navigation__items">
            <slot />
        </div>
    </RSurface>
</template>

<style scoped lang="scss">
.rui-bottom-navigation {
    position: relative;
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    max-inline-size: 100%;
    padding-block-end: env(safe-area-inset-bottom, 0px);
    overflow: hidden;
    color: var(--rui-comp-surface-content-color);

    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-start: 0;
    --rui-surface-shape-end-end: 0;
}

.rui-bottom-navigation__items {
    display: flex;
    inline-size: 100%;
    width: 100%;
    min-inline-size: 0;
    justify-content: center;
    min-block-size: 56px;
}
</style>
