<script setup lang="ts">
import type { Component } from "vue"

import { computed, defineAsyncComponent } from "vue"

const props = defineProps<{
    demo: string
}>()

const demoModules = import.meta.glob("../demos/**/*.vue")

const demoComponent = computed<Component | null>(() => {
    const key = Object.keys(demoModules).find((path) => path.endsWith(`/${props.demo}.vue`))

    if (!key) {
        return null
    }

    return defineAsyncComponent(demoModules[key] as () => Promise<{ default: Component }>)
})
</script>

<template>
    <component :is="demoComponent" v-if="demoComponent" />
    <p v-else class="demo-preview__missing">Unknown demo: {{ demo }}</p>
</template>

<style scoped>
.demo-preview__missing {
    margin: 0;
    color: #b00020;
}
</style>
