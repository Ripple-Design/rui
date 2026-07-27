<script setup lang="ts">
import { RButton, RButtonGroup, RRow, RTextField, themeToCSSVars, useTheme } from "@ripple-design/rui"
import type { RIconStyle, RShapeFamily, RTheme } from "@ripple-design/rui"
import { R_ICON_STYLES } from "@ripple-design/rui"
import { computed, onMounted, ref, watch } from "vue"

const densityOptions = [0, -1, -2, -3] as const
const defaultPrimary = "#6200ee"
const defaultDensity = densityOptions[0]
const defaultIconStyle: RIconStyle = R_ICON_STYLES[0]
const defaultShapeFamily: RShapeFamily = "rounded"
const { theme, setTheme, resetTheme } = useTheme()
const primary = ref(theme.value.color?.primary ?? defaultPrimary)
const density = ref(theme.value.density ?? defaultDensity)
const iconStyle = ref<RIconStyle>(theme.value.iconStyle ?? defaultIconStyle)
const shapeFamily = ref<RShapeFamily>(theme.value.shape?.small?.family ?? defaultShapeFamily)
const cssPrimary = ref("")
let syncSuspended = false

function createShapeTheme(family: RShapeFamily): NonNullable<RTheme["shape"]> {
    return {
        small: { family },
        medium: { family },
        large: { family },
        full: { family },
    }
}

function isValidColor(value: string) {
    return value.length > 0 && (typeof CSS === "undefined" || CSS.supports("color", value))
}

function syncCssPrimary() {
    cssPrimary.value = getComputedStyle(document.documentElement)
        .getPropertyValue("--rui-sys-color-primary")
        .trim()
}

watch(primary, (value) => {
    if (syncSuspended) return

    const trimmed = value.trim()
    if (!isValidColor(trimmed)) return

    setTheme({
        color: {
            primary: trimmed,
        },
    })
    syncCssPrimary()
}, { flush: "sync" })

watch(density, (value) => {
    if (syncSuspended) return

    setTheme({ density: value })
}, { flush: "sync" })

watch(iconStyle, (value) => {
    if (syncSuspended) return

    setTheme({ iconStyle: value })
}, { flush: "sync" })

watch(shapeFamily, (value) => {
    if (syncSuspended) return

    setTheme({ shape: createShapeTheme(value) })
}, { flush: "sync" })

function applyPreset(value: string) {
    primary.value = value
}

function handleReset() {
    syncSuspended = true
    resetTheme()
    primary.value = theme.value.color?.primary ?? defaultPrimary
    density.value = theme.value.density ?? defaultDensity
    iconStyle.value = theme.value.iconStyle ?? defaultIconStyle
    shapeFamily.value = theme.value.shape?.small?.family ?? defaultShapeFamily
    syncCssPrimary()
    syncSuspended = false
}

onMounted(() => {
    syncCssPrimary()
})

const cssVars = computed(() => themeToCSSVars(theme.value))
const previewShapeFamily = computed(() => (shapeFamily.value === "cut" ? "bevel" : "round"))
</script>

<template>
    <div class="theme-plugin-test">
        <RTextField v-model="primary" label="Primary" placeholder="#6200ee" />
        <label class="theme-plugin-test__field">
            <span>Density</span>
            <select v-model.number="density">
                <option v-for="option in densityOptions" :key="option" :value="option">{{ option }}</option>
            </select>
        </label>
        <div class="theme-plugin-test__field">
            <span>Icon style</span>
            <RButtonGroup v-model="iconStyle" selection="single" aria-label="Theme icon style" full-width>
                <RButton v-for="style in R_ICON_STYLES" :key="style" :value="style">{{ style }}</RButton>
            </RButtonGroup>
        </div>
        <label class="theme-plugin-test__field">
            <span>Shape</span>
            <select v-model="shapeFamily">
                <option value="rounded">Rounded</option>
                <option value="cut">Cut</option>
            </select>
        </label>

        <RRow gap="8px" wrap class="theme-plugin-test__actions">
            <button type="button" @click="applyPreset('#ff0000')">Red</button>
            <button type="button" @click="applyPreset('#00c853')">Green</button>
            <button type="button" @click="handleReset">Reset</button>
        </RRow>

        <div
            class="theme-plugin-test__swatch"
            :style="{ '--theme-plugin-test-shape-family': previewShapeFamily }"
        />

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

.theme-plugin-test__field {
    display: grid;
    gap: 0.375rem;
}

.theme-plugin-test__field select {
    padding: 0.375rem 0.5rem;
    border: 1px solid #d0d0d0;
    background: #fff;
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
    border-start-start-radius: 1rem;
    border-start-end-radius: 1rem;
    border-end-end-radius: 1rem;
    border-end-start-radius: 1rem;
    corner-shape: var(--theme-plugin-test-shape-family, round);
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
