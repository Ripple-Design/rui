<script setup lang="ts">
import { RRow, RTextField, themeToCSSVars, useTheme } from "@ripple-design/rui"
import { computed, onMounted, ref } from "vue"

const defaultPrimary = "#6200ee"
const { theme, setTheme, resetTheme } = useTheme()
const primary = ref(theme.value.color?.primary ?? defaultPrimary)
const cssPrimary = ref("")

function syncCssPrimary() {
    cssPrimary.value = getComputedStyle(document.documentElement)
        .getPropertyValue("--rui-sys-color-primary")
        .trim()
}

function applyPrimary() {
    setTheme({
        color: {
            primary: primary.value,
        },
    })
    syncCssPrimary()
}

function applyPreset(value: string) {
    primary.value = value
    applyPrimary()
}

function handleReset() {
    resetTheme()
    primary.value = theme.value.color?.primary ?? defaultPrimary
    syncCssPrimary()
}

onMounted(() => {
    syncCssPrimary()
})

const cssVars = computed(() => themeToCSSVars(theme.value))
</script>

<template>
    <div class="theme-plugin-test">
        <RTextField v-model="primary" label="Primary" placeholder="#6200ee" />

        <RRow gap="8px" wrap class="theme-plugin-test__actions">
            <button type="button" @click="applyPrimary">Apply</button>
            <button type="button" @click="applyPreset('#ff0000')">Red</button>
            <button type="button" @click="applyPreset('#00c853')">Green</button>
            <button type="button" @click="handleReset">Reset</button>
        </RRow>

        <div class="theme-plugin-test__swatch" />

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

.theme-plugin-test__actions button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d0d0d0;
    background: #fff;
    cursor: pointer;
}

.theme-plugin-test__swatch {
    width: 100%;
    height: 3rem;
    border: 1px solid #d0d0d0;
    background: var(--rui-sys-color-primary);
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
