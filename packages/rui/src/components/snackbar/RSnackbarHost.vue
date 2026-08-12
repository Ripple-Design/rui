<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

import { RTeleport } from "@/foundations/floating"

import RSnackbar from "./RSnackbar.vue"
import { useRSnackbarStore, type SnackbarSnapshot } from "./RSnackbars"
import type { RSnackbarDismissReason } from "./types"

const store = useRSnackbarStore()
const snapshot = ref<SnackbarSnapshot>(store.getState())
let unsubscribe: (() => void) | undefined

const current = computed(() => snapshot.value.current)

function handleSnapshot(value: SnackbarSnapshot) {
    snapshot.value = value
}

function handleShown(id: string) {
    store.notifyShown(id)
}

function handleClose(id: string, reason: RSnackbarDismissReason) {
    store.requestDismiss(id, reason)
}

function handleDismissed(id: string, reason: RSnackbarDismissReason) {
    store.notifyDismissed(id, reason)
}

onMounted(() => {
    unsubscribe = store.subscribe(handleSnapshot)
})

onBeforeUnmount(() => {
    unsubscribe?.()
})
</script>

<template>
    <RTeleport portal="docked">
        <div class="rui-snackbar-host">
            <div v-if="current" class="rui-snackbar-host__positioner">
                <RSnackbar
                    :key="current.id"
                    :model-value="current.open"
                    :message="current.options.message"
                    :duration="current.options.duration"
                    :animation="current.options.animation"
                    :action-label="current.options.action?.label"
                    :two-line="current.options.twoLine"
                    :long-action="current.options.longAction"
                    :dismiss-reason="current.reason ?? 'manual'"
                    :swipe-dismissible="current.options.swipeDismissible"
                    @shown="handleShown(current.id)"
                    @action="current.options.action?.onClick?.()"
                    @close="handleClose(current.id, $event.reason)"
                    @dismissed="handleDismissed(current.id, $event.reason)"
                />
            </div>
        </div>
    </RTeleport>
</template>

<style scoped lang="scss">
.rui-snackbar-host {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding:
        0
        calc(8px + env(safe-area-inset-right, 0px))
        calc(8px + env(safe-area-inset-bottom, 0px))
        calc(8px + env(safe-area-inset-left, 0px));
    pointer-events: none;
}

.rui-snackbar-host__positioner {
    inline-size: min(100%, 576px);
    pointer-events: auto;
}

@media (max-width: 599px) {
    .rui-snackbar-host__positioner {
        inline-size: 100%;
    }
}
</style>
