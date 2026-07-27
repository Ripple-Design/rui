<script setup lang="ts">
import { ThemePlayground } from "@ripple-design/rui/playground"

import { DEFAULT_DOCS_THEME, DOCS_THEME_KEY } from "@docs/lib/theme"
</script>

<template>
    <div class="theme-control-sheet">
        <ThemePlayground :default-theme="DEFAULT_DOCS_THEME" persist :storage-key="DOCS_THEME_KEY" />
    </div>
</template>

<style scoped>
.theme-control-sheet {
    display: contents;
}
</style>
