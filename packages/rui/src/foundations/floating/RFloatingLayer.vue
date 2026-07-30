<script setup lang="ts">
import { Teleport, computed, onMounted, ref } from "vue"

import { ensureFloatingPortalRoot } from "@/foundations"

import type { RFloatingLayerProps } from "./types"

import { RUI_FLOATING_PORTAL_ID } from "./constants"

const props = defineProps<RFloatingLayerProps>()

const portalReady = ref(false)
const portalSelector = `#${RUI_FLOATING_PORTAL_ID}`
const layerRef = ref<HTMLElement | null>(null)

const layerStyles = computed(() => ({
    ...props.floatingStyles,
    pointerEvents: props.open ? "auto" : "none",
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
        <div
            ref="layerRef"
            :id="id"
            :role="role"
            :style="layerStyles"
            :class="['rui-floating-layer', { 'rui-floating-layer--open': open }]"
            :aria-hidden="open ? undefined : 'true'"
        >
            <slot />
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-floating-layer {
    visibility: hidden;
    transition: visibility 0s linear motion.$duration-small-out;

    &--open {
        visibility: visible;
        transition-delay: 0s;
    }
}
</style>
