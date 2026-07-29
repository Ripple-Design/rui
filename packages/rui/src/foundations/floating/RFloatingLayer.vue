<script setup lang="ts">
import { Teleport, computed, defineExpose, onMounted, ref } from "vue"

import { RUI_FLOATING_PORTAL_ID } from "./constants"
import { ensureFloatingPortalRoot } from "./usePortalTarget"

import type { RFloatingLayerProps } from "./types"

const props = defineProps<RFloatingLayerProps>()

const portalReady = ref(false)
const portalSelector = `#${RUI_FLOATING_PORTAL_ID}`
const layerRef = ref<HTMLElement | null>(null)

const layerStyles = computed(() => ({
    ...props.floatingStyles,
    pointerEvents: props.open ? "auto" : "none",
    visibility: props.open ? undefined : "hidden",
}))

onMounted(() => {
    ensureFloatingPortalRoot()
    portalReady.value = true
})

defineExpose({
    element: layerRef,
})
</script>

<template>
    <Teleport v-if="portalReady" :to="portalSelector">
        <div ref="layerRef" :id="id" :role="role" :style="layerStyles" :aria-hidden="open ? undefined : 'true'">
            <slot />
        </div>
    </Teleport>
</template>
