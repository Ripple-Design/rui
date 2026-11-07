<script setup lang="ts">
import type { App } from "vue"

import { R_ICON_STYLES, ruiPlugin } from "@ripple-design/rui"
import { createApp, onBeforeUnmount, onMounted, ref } from "vue"

import ThemePluginTestApp from "./ThemePluginTestApp.vue"

const container = ref<HTMLElement | null>(null)
let app: App | null = null

onMounted(() => {
    if (!container.value) {
        return
    }

    app = createApp(ThemePluginTestApp)

    app.use(ruiPlugin, {
        theme: {
            mode: "day",
            theme: {
                color: {
                    primary: "#6200ee",
                    onSurface: "#000000",
                },
                density: 0,
                iconStyle: R_ICON_STYLES[0],
                shape: {
                    small: { family: "rounded" },
                    medium: { family: "rounded" },
                    large: { family: "rounded" },
                    full: { family: "rounded" },
                    icon: { family: "rounded" },
                },
            },
        },
    })

    app.mount(container.value)
})

onBeforeUnmount(() => {
    app?.unmount()
    app = null
})
</script>

<template>
    <div ref="container" />
</template>
