<script setup lang="ts">
import type { RShapeFamily, RTheme } from "@ripple-design/rui"

import {
    DEFAULT_DOCS_THEME,
    createShapeTheme,
    isValidDocsThemeColor,
    readDocsTheme,
    removeDocsThemeStorage,
    writeDocsThemeStorage,
} from "@docs/lib/theme"
import { RButton, RButtonGroup, RRow, RTextField, applyTheme } from "@ripple-design/rui"
import { computed, onMounted, ref, watch } from "vue"

const densityOptions = [0, -1, -2, -3] as const
const defaultPrimary = DEFAULT_DOCS_THEME.color?.primary ?? "#6200ee"
const defaultDensity = DEFAULT_DOCS_THEME.density ?? densityOptions[0]
const defaultShapeFamily = DEFAULT_DOCS_THEME.shape?.small?.family ?? "rounded"
const inputValue = ref(defaultPrimary)
const densityValue = ref<number>(defaultDensity)
const shapeFamilyValue = ref<RShapeFamily>(defaultShapeFamily)
let syncSuspended = true

function currentDocsTheme(): RTheme {
    return {
        color: {
            primary: inputValue.value.trim() || defaultPrimary,
        },
        density: densityValue.value,
        shape: createShapeTheme(shapeFamilyValue.value),
    }
}

watch(
    inputValue,
    (value) => {
        if (syncSuspended) return

        const trimmed = value.trim()
        if (!isValidDocsThemeColor(trimmed)) return

        applyTheme({ color: { primary: trimmed } })
        writeDocsThemeStorage(currentDocsTheme())
    },
    { flush: "sync" },
)

watch(
    densityValue,
    (value) => {
        if (syncSuspended) return

        applyTheme({ density: value })
        writeDocsThemeStorage(currentDocsTheme())
    },
    { flush: "sync" },
)

watch(
    shapeFamilyValue,
    (value) => {
        if (syncSuspended) return

        applyTheme({ shape: createShapeTheme(value) })
        writeDocsThemeStorage(currentDocsTheme())
    },
    { flush: "sync" },
)

onMounted(() => {
    const theme = readDocsTheme()
    inputValue.value = theme.color?.primary ?? defaultPrimary
    densityValue.value = theme.density ?? defaultDensity
    shapeFamilyValue.value = theme.shape?.small?.family ?? defaultShapeFamily
    syncSuspended = false
})

function resetPrimaryColor() {
    syncSuspended = true
    inputValue.value = defaultPrimary
    writeDocsThemeStorage(currentDocsTheme())
    applyTheme({ color: { primary: defaultPrimary } })
    syncSuspended = false
}

function resetDensity() {
    syncSuspended = true
    densityValue.value = defaultDensity
    writeDocsThemeStorage(currentDocsTheme())
    applyTheme({ density: defaultDensity })
    syncSuspended = false
}

function resetShape() {
    syncSuspended = true
    shapeFamilyValue.value = defaultShapeFamily
    writeDocsThemeStorage(currentDocsTheme())
    applyTheme({ shape: createShapeTheme(defaultShapeFamily) })
    syncSuspended = false
}

function resetAll() {
    syncSuspended = true
    inputValue.value = defaultPrimary
    densityValue.value = defaultDensity
    shapeFamilyValue.value = defaultShapeFamily
    removeDocsThemeStorage()
    applyTheme(DEFAULT_DOCS_THEME)
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
            <select v-model.number="densityValue" style="width: 10px">
                <option v-for="option in densityOptions" :key="option" :value="option">{{ option }}</option>
            </select>
        </label>
        <p class="theme-control__hint">Current density: {{ densityLabel }} ({{ densityValue }})</p>

        <div class="theme-control__field">
            <span>Shape</span>
            <RButtonGroup v-model="shapeFamilyValue" selection="single" aria-label="Shape family">
                <RButton value="rounded">Rounded</RButton>
                <RButton value="cut">Cut</RButton>
            </RButtonGroup>
        </div>

        <RRow gap="8px" wrap class="theme-control__actions">
            <RButton sentence-case variant="text" @click="resetPrimaryColor">Reset primary</RButton>
            <RButton sentence-case variant="text" @click="resetDensity">Reset density</RButton>
            <RButton sentence-case variant="text" @click="resetShape">Reset shape</RButton>
            <RButton sentence-case variant="contained" @click="resetAll">Reset all</RButton>
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
</style>
