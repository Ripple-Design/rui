<script setup lang="ts">
import type { RThemeController, RThemeModePreference, RThemePatch } from "./types"

import { computed, onBeforeUnmount, ref, watch } from "vue"

import { createThemeController, provideTheme } from "./controller"

const props = withDefaults(defineProps<{
    mode?: RThemeModePreference
    tag?: string
    theme?: RThemePatch
}>(), {
    mode: "system",
    tag: "div",
    theme: () => ({}),
})

const rootElement = ref<HTMLElement | null>(null)
const controller = createThemeController(props.theme, () => rootElement.value, props.mode, {
    syncGlobal: false,
})

provideTheme(controller)

watch(rootElement, (element) => {
    if (!element) {
        return
    }

    controller.setTheme(props.theme, {
        replace: true,
        resetDefault: true,
    })
    controller.setMode(props.mode, {
        resetDefault: true,
    })
}, { flush: "post" })

watch(() => props.theme, (nextTheme) => {
    controller.setTheme(nextTheme, {
        replace: true,
        resetDefault: true,
    })
}, { deep: true })

watch(() => props.mode, (nextMode) => {
    controller.setMode(nextMode, {
        resetDefault: true,
    })
})

const exposed = computed<RThemeController>(() => controller)

defineExpose({
    controller: exposed,
    element: rootElement,
})

onBeforeUnmount(() => {
    controller.destroy()
})
</script>

<template>
    <component :is="tag" ref="rootElement">
        <slot />
    </component>
</template>
