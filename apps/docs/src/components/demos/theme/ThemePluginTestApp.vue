<script setup lang="ts">
import { RThemeProvider } from "@ripple-design/rui"
import { ThemePlayground } from "@ripple-design/rui/playground"
import { themeToCSSVars, useTheme } from "@ripple-design/rui"
import type { RTheme } from "@ripple-design/rui"
import { computed, onMounted, ref } from "vue"

const { theme } = useTheme()
const globalCssPrimary = ref("")
const localCssPrimary = ref("")

function syncCssPrimary() {
    globalCssPrimary.value = getComputedStyle(document.documentElement)
        .getPropertyValue("--rui-sys-color-primary")
        .trim()
}

function syncLocalPrimary() {
    const provider = document.getElementById("theme-plugin-test-local-scope")
    localCssPrimary.value = provider
        ? getComputedStyle(provider).getPropertyValue("--rui-sys-color-primary").trim()
        : ""
}

onMounted(() => {
    syncCssPrimary()
    syncLocalPrimary()
})

const cssVars = computed(() => themeToCSSVars(theme.value))
const injectedTheme = computed<RTheme>(() => theme.value)
const localTheme = {
    night: {
        color: {
            primary: "#ff6b6b",
            onSurface: "#ffffff",
        },
    },
}
</script>

<template>
    <div class="theme-plugin-test">
        <ThemePlayground :default-theme="injectedTheme" />

        <RThemeProvider id="theme-plugin-test-local-scope" :theme="localTheme" mode="night" tag="section">
            <div class="theme-plugin-test__scoped">
                <p>Scoped provider area</p>
                <ThemePlayground :default-theme="injectedTheme" title="Scoped theme" trigger-label="Scoped theme" />
            </div>
        </RThemeProvider>

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
                <dt>Global primary</dt>
                <dd><code>{{ globalCssPrimary }}</code></dd>
            </div>
            <div>
                <dt>Scoped primary</dt>
                <dd><code>{{ localCssPrimary }}</code></dd>
            </div>
        </dl>
    </div>
</template>

<style scoped>
.theme-plugin-test {
    display: grid;
    gap: 1rem;
}

.theme-plugin-test__scoped {
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid var(--rui-sys-color-on-surface-outline);
    background: var(--rui-sys-color-surface);
    color: var(--rui-sys-color-on-surface);
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
