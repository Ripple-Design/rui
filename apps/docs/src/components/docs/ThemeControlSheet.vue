<script setup lang="ts">
import ThemeControl from "@docs/components/docs/ThemeControl.vue"
import { RButton, RModalSideSheet } from "@ripple-design/rui"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
    <div class="theme-control-sheet">
        <RButton
            aria-controls="docs-theme-sheet"
            :aria-expanded="open ? 'true' : 'false'"
            aria-haspopup="dialog"
            sentence-case
            variant="text"
            @click="open = true"
        >
            Theme
        </RButton>

        <RModalSideSheet id="docs-theme-sheet" v-model="open" title="Theme" side="end">
            <ThemeControl />
        </RModalSideSheet>
    </div>
</template>

<style scoped>
.theme-control-sheet {
    display: contents;
}
</style>
