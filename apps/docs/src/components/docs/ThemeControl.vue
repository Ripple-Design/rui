<script setup lang="ts">
import { RRow, RTextField, applyTheme } from "@ripple-design/rui"
import type { RShapeFamily, RTheme } from "@ripple-design/rui"
import { computed, onMounted, ref, watch } from "vue"

const densityOptions = [0, -1, -2, -3] as const
const shapeCategories = ["small", "medium", "large", "full"] as const
const defaultPrimary = "#6200ee"
const defaultDensity = densityOptions[0]
const defaultShapeFamily: RShapeFamily = "rounded"
const inputValue = ref(defaultPrimary)
const densityValue = ref<number>(defaultDensity)
const shapeFamilyValue = ref<RShapeFamily>(defaultShapeFamily)
let syncSuspended = true

function readStorage(key: string) {
    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

function writeStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value)
    } catch {
        // Ignore storage failures in restrictive environments.
    }
}

function removeStorage(key: string) {
    try {
        localStorage.removeItem(key)
    } catch {
        // Ignore storage failures in restrictive environments.
    }
}

function readDensity(raw: string | null) {
    const value = raw == null ? defaultDensity : Number(raw)
    return densityOptions.includes(value as (typeof densityOptions)[number]) ? value : defaultDensity
}

function readShapeFamily(raw: string | null): RShapeFamily {
    return raw === "cut" ? "cut" : defaultShapeFamily
}

function isValidColor(value: string) {
    return value.length > 0 && (typeof CSS === "undefined" || CSS.supports("color", value))
}

function createShapeTheme(family: RShapeFamily): NonNullable<RTheme["shape"]> {
    return {
        small: { family },
        medium: { family },
        large: { family },
        full: { family },
    }
}

function clearShapeTheme() {
    for (const category of shapeCategories) {
        document.documentElement.style.removeProperty(`--rui-sys-shape-${category}-family`)
        document.documentElement.style.removeProperty(`--rui-sys-shape-${category}-start-start`)
        document.documentElement.style.removeProperty(`--rui-sys-shape-${category}-start-end`)
        document.documentElement.style.removeProperty(`--rui-sys-shape-${category}-end-end`)
        document.documentElement.style.removeProperty(`--rui-sys-shape-${category}-end-start`)
    }
}

watch(inputValue, (value) => {
    if (syncSuspended) return

    const trimmed = value.trim()
    if (!isValidColor(trimmed)) return

    applyTheme({ color: { primary: trimmed } })
    writeStorage("rui-docs-primary", trimmed)
}, { flush: "sync" })

watch(densityValue, (value) => {
    if (syncSuspended) return

    applyTheme({ density: value })
    writeStorage("rui-docs-density", String(value))
}, { flush: "sync" })

watch(shapeFamilyValue, (value) => {
    if (syncSuspended) return

    applyTheme({ shape: createShapeTheme(value) })
    writeStorage("rui-docs-shape-family", value)
}, { flush: "sync" })

onMounted(() => {
    inputValue.value = readStorage("rui-docs-primary") ?? defaultPrimary
    densityValue.value = readDensity(readStorage("rui-docs-density"))
    shapeFamilyValue.value = readShapeFamily(readStorage("rui-docs-shape-family"))
    syncSuspended = false
})

function resetPrimaryColor() {
    syncSuspended = true
    inputValue.value = defaultPrimary
    removeStorage("rui-docs-primary")
    document.documentElement.style.removeProperty("--rui-sys-color-primary")
    syncSuspended = false
}

function resetDensity() {
    syncSuspended = true
    densityValue.value = defaultDensity
    removeStorage("rui-docs-density")
    document.documentElement.style.removeProperty("--rui-sys-density-scale")
    syncSuspended = false
}

function resetShape() {
    syncSuspended = true
    shapeFamilyValue.value = defaultShapeFamily
    removeStorage("rui-docs-shape-family")
    clearShapeTheme()
    syncSuspended = false
}

const densityLabel = computed(() => {
    switch (densityValue.value) {
        case -1:
            return "Compact"
        case -2:
            return "Dense"
        case -3:
            return "Densest"
        default:
            return "Default"
    }
})

const shapeLabel = computed(() => (shapeFamilyValue.value === "cut" ? "Cut" : "Rounded"))
const previewShapeFamily = computed(() => (shapeFamilyValue.value === "cut" ? "bevel" : "round"))
</script>

<template>
    <div class="theme-control">
        <RTextField v-model="inputValue" label="Primary" placeholder="#6200ee" />
        <div class="theme-control__preview">
            <div
                class="theme-control__swatch"
                :style="{
                    background: inputValue || defaultPrimary,
                    '--theme-control-preview-shape-family': previewShapeFamily,
                }"
            />
        </div>

        <label class="theme-control__field">
            <span>Density</span>
            <select v-model.number="densityValue">
                <option v-for="option in densityOptions" :key="option" :value="option">{{ option }}</option>
            </select>
        </label>
        <p class="theme-control__hint">Current density: {{ densityLabel }} ({{ densityValue }})</p>

        <label class="theme-control__field">
            <span>Shape</span>
            <select v-model="shapeFamilyValue">
                <option value="rounded">Rounded</option>
                <option value="cut">Cut</option>
            </select>
        </label>
        <p class="theme-control__hint">Current shape: {{ shapeLabel }}</p>

        <RRow gap="8px" wrap class="theme-control__actions">
            <button type="button" @click="resetPrimaryColor">Reset primary</button>
            <button type="button" @click="resetDensity">Reset density</button>
            <button type="button" @click="resetShape">Reset shape</button>
        </RRow>
    </div>
</template>

<style scoped>
.theme-control {
    display: grid;
    gap: 0.75rem;
}

.theme-control__preview {
    display: grid;
    gap: 0.375rem;
}

.theme-control__swatch {
    width: 100%;
    height: 2rem;
    border: 1px solid #d0d0d0;
    border-start-start-radius: 0.75rem;
    border-start-end-radius: 0.75rem;
    border-end-end-radius: 0.75rem;
    border-end-start-radius: 0.75rem;
    corner-shape: var(--theme-control-preview-shape-family, round);
}

.theme-control__field {
    display: grid;
    gap: 0.375rem;
}

.theme-control__field select {
    padding: 0.375rem 0.5rem;
    border: 1px solid #d0d0d0;
    background: #fff;
}

.theme-control__hint {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
}

.theme-control__actions {
    justify-content: flex-end;
}

.theme-control__actions button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d0d0d0;
    background: #fff;
    cursor: pointer;
}
</style>
