<script setup lang="ts">
import { Teleport, computed, onMounted, ref, watch } from "vue"

import { ensureFloatingPortalRoot, resolvePortalTarget } from "./usePortalTarget"
import { resolveFloatingValue } from "./shared"
import { ensureModalPortalRoot } from "./useModalPortalRoot"
import type { RTeleportProps } from "./teleportTypes"

const props = withDefaults(defineProps<RTeleportProps>(), {
    portal: "modal",
})

const portalReady = ref(false)
const portalRoot = ref<HTMLElement | null>(null)
const target = computed(() => resolveFloatingValue(props.target, null))
const resolvedTarget = computed(() => target.value ? resolvePortalTarget(target.value) : portalRoot.value)

function ensurePortalRoot() {
    portalRoot.value ??= props.portal === "modal"
        ? ensureModalPortalRoot()
        : ensureFloatingPortalRoot()
}

onMounted(() => {
    if (!target.value) {
        ensurePortalRoot()
    }
    portalReady.value = true
})

watch(target, (value) => {
    if (portalReady.value && !value) {
        ensurePortalRoot()
    }
})
</script>

<template>
    <Teleport v-if="portalReady && resolvedTarget" :to="resolvedTarget">
        <slot />
    </Teleport>
</template>
