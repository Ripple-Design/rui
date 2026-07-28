<script setup lang="ts">
import { ThemePlayground } from "@ripple-design/rui/playground"

import { DEFAULT_DOCS_DAY_NIGHT_THEME, DOCS_THEME_KEY, DOCS_THEME_MODE_KEY } from "@docs/lib/theme"
</script>

<template>
    <div class="theme-control-sheet">
        <ThemePlayground
            :default-theme="DEFAULT_DOCS_DAY_NIGHT_THEME"
            persist
            :restore-on-mounted="false"
            :storage-key="DOCS_THEME_KEY"
            :mode-storage-key="DOCS_THEME_MODE_KEY"
        />
    </div>
</template>

<style scoped>
.theme-control-sheet {
    display: contents;
}
</style>
