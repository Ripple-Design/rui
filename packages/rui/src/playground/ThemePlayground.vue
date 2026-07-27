<script setup lang="ts">
import type { RShapeFamily, RTheme } from "@/foundations/theme"
import type { RIconStyle } from "@/foundations/icon"

import { computed, ref, watch } from "vue"

import { RButton, RButtonGroup, RRow, RTextField, RModalSideSheet } from "@/components"
import { R_ICON_STYLES } from "@/foundations/icon"
import { applyTheme } from "@/foundations/theme"

const props = withDefaults(
    defineProps<{
        defaultTheme?: RTheme
        initialOpen?: boolean
        persist?: boolean
        storageKey?: string
        triggerLabel?: string
        title?: string
    }>(),
    {
        defaultTheme: () => ({
            color: { primary: "#6200ee" },
            density: 0,
            iconStyle: R_ICON_STYLES[0],
            shape: {
                small: { family: "rounded" },
                medium: { family: "rounded" },
                large: { family: "rounded" },
                full: { family: "rounded" },
            },
        }),
        initialOpen: false,
        persist: false,
        storageKey: "rui-theme-playground",
        triggerLabel: "Theme",
        title: "Theme",
    },
)

const open = ref(props.initialOpen)
const densityOptions = [0, -1, -2, -3] as const
const defaultPrimary = props.defaultTheme.color?.primary ?? "#6200ee"
const defaultDensity = props.defaultTheme.density ?? densityOptions[0]
const defaultIconStyle = props.defaultTheme.iconStyle ?? R_ICON_STYLES[0]
const defaultShapeFamily = props.defaultTheme.shape?.small?.family ?? "rounded"
const inputValue = ref(defaultPrimary)
const densityValue = ref<number>(defaultDensity)
const iconStyleValue = ref<RIconStyle>(defaultIconStyle)
const shapeFamilyValue = ref<RShapeFamily>(defaultShapeFamily)
let syncSuspended = true

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

function normalizeIconStyle(value: unknown): RIconStyle {
    return typeof value === "string" && R_ICON_STYLES.includes(value as RIconStyle) ? (value as RIconStyle) : defaultIconStyle
}

function currentTheme(): RTheme {
    return {
        color: {
            primary: inputValue.value.trim() || defaultPrimary,
        },
        density: densityValue.value,
        iconStyle: iconStyleValue.value,
        shape: createShapeTheme(shapeFamilyValue.value),
    }
}

function normalizeTheme(theme: unknown): RTheme {
    const next = typeof theme === "object" && theme != null ? (theme as RTheme) : {}
    const density = densityOptions.includes((next.density ?? NaN) as (typeof densityOptions)[number]) ? (next.density as number) : defaultDensity
    const shapeFamily = next.shape?.small?.family === "cut" ? "cut" : "rounded"

    return {
        color: {
            primary:
                typeof next.color?.primary === "string" && isValidColor(next.color.primary)
                    ? next.color.primary
                    : defaultPrimary,
        },
        density,
        iconStyle: normalizeIconStyle(next.iconStyle),
        shape: createShapeTheme(shapeFamily),
    }
}

function readPersistedTheme() {
    if (!props.persist) {
        return props.defaultTheme
    }

    try {
        const raw = localStorage.getItem(props.storageKey)
        return raw ? normalizeTheme(JSON.parse(raw)) : props.defaultTheme
    } catch {
        return props.defaultTheme
    }
}

function writePersistedTheme(theme: RTheme) {
    if (!props.persist) {
        return
    }

    try {
        localStorage.setItem(props.storageKey, JSON.stringify(theme))
    } catch {
        // Ignore storage failures.
    }
}

function removePersistedTheme() {
    if (!props.persist) {
        return
    }

    try {
        localStorage.removeItem(props.storageKey)
    } catch {
        // Ignore storage failures.
    }
}

watch(
    inputValue,
    (value) => {
        if (syncSuspended) return

        const trimmed = value.trim()
        if (!isValidColor(trimmed)) return

        const theme = currentTheme()
        applyTheme({ color: { primary: trimmed } })
        writePersistedTheme(theme)
    },
    { flush: "sync" },
)

watch(
    densityValue,
    (value) => {
        if (syncSuspended) return

        const theme = currentTheme()
        applyTheme({ density: value })
        writePersistedTheme(theme)
    },
    { flush: "sync" },
)

watch(
    iconStyleValue,
    (value) => {
        if (syncSuspended) return

        const theme = currentTheme()
        applyTheme({ iconStyle: value })
        writePersistedTheme(theme)
    },
    { flush: "sync" },
)

watch(
    shapeFamilyValue,
    (value) => {
        if (syncSuspended) return

        const theme = currentTheme()
        applyTheme({ shape: createShapeTheme(value) })
        writePersistedTheme(theme)
    },
    { flush: "sync" },
)

function applyResolvedTheme(theme: RTheme) {
    syncSuspended = true
    inputValue.value = theme.color?.primary ?? defaultPrimary
    densityValue.value = theme.density ?? defaultDensity
    iconStyleValue.value = theme.iconStyle ?? defaultIconStyle
    shapeFamilyValue.value = theme.shape?.small?.family ?? defaultShapeFamily
    applyTheme(theme)
    syncSuspended = false
}

function resetPrimaryColor() {
    syncSuspended = true
    inputValue.value = defaultPrimary
    const theme = currentTheme()
    writePersistedTheme(theme)
    applyTheme({ color: { primary: defaultPrimary } })
    syncSuspended = false
}

function resetDensity() {
    syncSuspended = true
    densityValue.value = defaultDensity
    const theme = currentTheme()
    writePersistedTheme(theme)
    applyTheme({ density: defaultDensity })
    syncSuspended = false
}

function resetIconStyle() {
    syncSuspended = true
    iconStyleValue.value = defaultIconStyle
    const theme = currentTheme()
    writePersistedTheme(theme)
    applyTheme({ iconStyle: defaultIconStyle })
    syncSuspended = false
}

function resetShape() {
    syncSuspended = true
    shapeFamilyValue.value = defaultShapeFamily
    const theme = currentTheme()
    writePersistedTheme(theme)
    applyTheme({ shape: createShapeTheme(defaultShapeFamily) })
    syncSuspended = false
}

function resetAll() {
    removePersistedTheme()
    applyResolvedTheme(props.defaultTheme)
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

applyResolvedTheme(readPersistedTheme())
</script>

<template>
    <div class="theme-playground">
        <RButton
            aria-controls="rui-theme-playground-sheet"
            :aria-expanded="open ? 'true' : 'false'"
            aria-haspopup="dialog"
            sentence-case
            variant="text"
            @click="open = true"
        >
            {{ triggerLabel }}
        </RButton>

        <RModalSideSheet id="rui-theme-playground-sheet" v-model="open" :title="title" side="end">
            <div class="theme-playground__content">
                <RTextField v-model="inputValue" label="Primary" placeholder="#6200ee" />
                <div class="theme-playground__preview">
                    <div
                        class="theme-playground__swatch"
                        :style="{
                            background: inputValue || defaultPrimary,
                            '--theme-playground-preview-shape-family': previewShapeFamily,
                        }"
                    />
                </div>

                <label class="theme-playground__field">
                    <span>Density</span>
                    <select v-model.number="densityValue">
                        <option v-for="option in densityOptions" :key="option" :value="option">{{ option }}</option>
                    </select>
                </label>
                <p class="theme-playground__hint">Current density: {{ densityLabel }} ({{ densityValue }})</p>

                <label class="theme-playground__field">
                    <span>Icon style</span>
                    <select v-model="iconStyleValue">
                        <option v-for="style in R_ICON_STYLES" :key="style" :value="style">{{ style }}</option>
                    </select>
                </label>

                <div class="theme-playground__field">
                    <span>Shape</span>
                    <RButtonGroup v-model="shapeFamilyValue" selection="single" aria-label="Shape family">
                        <RButton value="rounded">Rounded</RButton>
                        <RButton value="cut">Cut</RButton>
                    </RButtonGroup>
                </div>

                <RRow gap="8px" wrap class="theme-playground__actions">
                    <RButton sentence-case variant="text" @click="resetPrimaryColor">Reset primary</RButton>
                    <RButton sentence-case variant="text" @click="resetDensity">Reset density</RButton>
                    <RButton sentence-case variant="text" @click="resetIconStyle">Reset icons</RButton>
                    <RButton sentence-case variant="text" @click="resetShape">Reset shape</RButton>
                    <RButton sentence-case variant="contained" @click="resetAll">Reset all</RButton>
                </RRow>
            </div>
        </RModalSideSheet>
    </div>
</template>

<style scoped>
.theme-playground {
    display: contents;
}

.theme-playground__content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.theme-playground__preview {
    display: grid;
    gap: 0.375rem;
}

.theme-playground__swatch {
    width: 100%;
    height: 2rem;
    border: 1px solid #d0d0d0;
    border-start-start-radius: 0.75rem;
    border-start-end-radius: 0.75rem;
    border-end-end-radius: 0.75rem;
    border-end-start-radius: 0.75rem;
    corner-shape: var(--theme-playground-preview-shape-family, round);
}

.theme-playground__field {
    display: grid;
    gap: 0.375rem;
}

.theme-playground__field select {
    padding: 0.375rem 0.5rem;
    border: 1px solid #d0d0d0;
    background: #fff;
}

.theme-playground__hint {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
}

.theme-playground__actions {
    justify-content: flex-end;
}
</style>
