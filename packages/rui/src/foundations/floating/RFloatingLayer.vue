<script setup lang="ts">
import { computed, ref, watch, type StyleValue } from "vue"

import { useFloatingPortalTarget } from "./usePortalTarget"
import RTeleport from "./RTeleport.vue"

import type { RFloatingLayerProps } from "./types"

const props = defineProps<RFloatingLayerProps>()
const emit = defineEmits<{
    (e: "ready", element: HTMLElement): void
}>()

const portalTarget = useFloatingPortalTarget(props.portalTarget)
const layerRef = ref<HTMLElement | null>(null)

const layerStyles = computed<StyleValue>(() => ({
    ...props.floatingStyles,
    pointerEvents: props.open ? "auto" : "none",
}))

watch(
    layerRef,
    (element) => {
        if (element) {
            console.log("[RFloatingLayer] ready", { element, open: props.open })
            emit("ready", element)
        }
    },
    { flush: "post" },
)

defineExpose({
    element: layerRef,
})
</script>

<template>
    <RTeleport portal="docked" :target="portalTarget">
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
    </RTeleport>
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-floating-layer {
    visibility: hidden;
    transition: visibility 0s linear motion.$duration-small-out;
    transition-behavior: allow-discrete;

    &--open {
        visibility: visible;
        transition-delay: 0s;
        transition-behavior: allow-discrete;
    }
}
</style>
