<script setup lang="ts">
import { ThemePlayground } from "@ripple-design/rui/playground"
import { themeToCSSVars, useTheme } from "@ripple-design/rui"
import type { RTheme } from "@ripple-design/rui"
import { computed, onMounted, ref } from "vue"

const { theme } = useTheme()
const cssPrimary = ref("")

function syncCssPrimary() {
    cssPrimary.value = getComputedStyle(document.documentElement)
        .getPropertyValue("--rui-sys-color-primary")
        .trim()
}

onMounted(() => {
    syncCssPrimary()
})

const cssVars = computed(() => themeToCSSVars(theme.value))
const injectedTheme = computed<RTheme>(() => theme.value)
</script>

<template>
    <div class="theme-plugin-test">
        <ThemePlayground :default-theme="injectedTheme" />

        <dl class="theme-plugin-test__meta">
            <div>
                <dt>Injected theme</dt>
                <dd><code>{{ JSON.stringify(theme, null, 2) }}</code></dd>
            </div>
            <div>
                <dt>Generated CSS vars</dt>
                <dd><code>{{ JSON.stringify(cssVars, null, 2) }}</code></dd>
            </div>
            <div>
                <dt>Computed primary</dt>
                <dd><code>{{ cssPrimary }}</code></dd>
            </div>
        </dl>
    </div>
</template>

<style scoped>
.theme-plugin-test {
    display: grid;
    gap: 1rem;
}

.theme-plugin-test__meta {
    display: grid;
    gap: 0.75rem;
    margin: 0;
}

.theme-plugin-test__meta div {
    display: grid;
    gap: 0.25rem;
}

.theme-plugin-test__meta dt {
    font-weight: 600;
}

.theme-plugin-test__meta dd {
    margin: 0;
}

.theme-plugin-test__meta code {
    display: block;
    overflow-x: auto;
    padding: 0.75rem;
    border: 1px solid #d0d0d0;
    background: #f7f7f7;
    white-space: pre-wrap;
}
</style>
