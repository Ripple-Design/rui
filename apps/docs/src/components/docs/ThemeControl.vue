<script setup lang="ts">
import { RRow, RTextField, applyTheme } from "@ripple-design/rui"
import { computed, onMounted, ref } from "vue"

const defaultPrimary = "#6200ee"
const defaultDensity = 0
const compactDensity = -1
const inputValue = ref(defaultPrimary)
const densityValue = ref(defaultDensity)

function readDensity(raw: string | null) {
    const value = raw == null ? defaultDensity : Number(raw)
    return Number.isFinite(value) ? value : defaultDensity
}

onMounted(() => {
    inputValue.value = localStorage.getItem("rui-docs-primary") ?? defaultPrimary
    densityValue.value = readDensity(localStorage.getItem("rui-docs-density"))
})

function applyPrimaryColor() {
    const value = inputValue.value.trim()

    if (!value) {
        localStorage.removeItem("rui-docs-primary")
        document.documentElement.style.removeProperty("--rui-sys-color-primary")
        return
    }

    applyTheme({ color: { primary: value } })
    localStorage.setItem("rui-docs-primary", value)
}

function applyDensity() {
    applyTheme({ density: densityValue.value })
    localStorage.setItem("rui-docs-density", String(densityValue.value))
}

function resetPrimaryColor() {
    inputValue.value = defaultPrimary
    localStorage.removeItem("rui-docs-primary")
    document.documentElement.style.removeProperty("--rui-sys-color-primary")
}

function resetDensity() {
    densityValue.value = defaultDensity
    localStorage.removeItem("rui-docs-density")
    document.documentElement.style.removeProperty("--rui-sys-density-scale")
}

const densityLabel = computed(() => (densityValue.value === compactDensity ? "Compact" : "Default"))
</script>

<template>
    <div class="theme-control">
        <RTextField v-model="inputValue" label="Primary" placeholder="#6200ee" />
        <div class="theme-control__preview">
            <div class="theme-control__swatch" :style="{ background: inputValue || defaultPrimary }" />
        </div>

        <label class="theme-control__density">
            <span>Density</span>
            <select v-model.number="densityValue">
                <option :value="defaultDensity">Default (0)</option>
                <option :value="compactDensity">Compact (-1)</option>
            </select>
        </label>
        <p class="theme-control__hint">Current: {{ densityLabel }} ({{ densityValue }})</p>

        <RRow gap="8px" class="theme-control__actions">
            <button type="button" @click="resetPrimaryColor">Reset primary</button>
            <button type="button" @click="applyPrimaryColor">Apply primary</button>
            <button type="button" @click="resetDensity">Reset density</button>
            <button type="button" @click="applyDensity">Apply density</button>
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
}

.theme-control__density {
    display: grid;
    gap: 0.375rem;
}

.theme-control__density select {
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
