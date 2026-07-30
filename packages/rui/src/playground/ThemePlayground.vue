<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"

import type { RIconStyle } from "@/foundations/icon"
import type { RShapeFamily, RTheme, RThemeModePreference, RThemePatch } from "@/foundations/theme"

import { RButton, RButtonGroup, RRow, RTextField, RModalSideSheet } from "@/components"
import { R_ICON_STYLES } from "@/foundations/icon"
import {
    applyTheme,
    defaultDayNightTheme,
    defaultLightTheme,
    mergeTheme,
    resolveDayNightTheme,
    resolveThemeMode,
} from "@/foundations/theme"

const props = withDefaults(
    defineProps<{
        defaultTheme?: RThemePatch
        initialOpen?: boolean
        persist?: boolean
        restoreOnMounted?: boolean
        storageKey?: string
        modeStorageKey?: string
        triggerLabel?: string
        title?: string
    }>(),
    {
        defaultTheme: () => defaultDayNightTheme,
        initialOpen: false,
        persist: false,
        restoreOnMounted: true,
        storageKey: "rui-theme-playground",
        modeStorageKey: "rui-theme-playground-mode",
        triggerLabel: "Theme",
        title: "Theme",
    },
)

const open = ref(props.initialOpen)
const densityOptions = [0, -1, -2, -3] as const
const baseThemes = resolveDayNightTheme(defaultDayNightTheme, props.defaultTheme)
const defaultPrimary = baseThemes.day.color?.primary ?? defaultLightTheme.color?.primary ?? "#6200ee"
const defaultDensity = baseThemes.day.density ?? densityOptions[0]
const defaultIconStyle = baseThemes.day.iconStyle ?? R_ICON_STYLES[0]
const defaultShapeFamily = baseThemes.day.shape?.small?.family ?? "rounded"
const inputValue = ref(defaultPrimary)
const densityValue = ref<number>(defaultDensity)
const iconStyleValue = ref<RIconStyle>(defaultIconStyle)
const shapeFamilyValue = ref<RShapeFamily>(defaultShapeFamily)
const modeValue = ref<RThemeModePreference>("system")
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
    return typeof value === "string" && R_ICON_STYLES.includes(value as RIconStyle)
        ? (value as RIconStyle)
        : defaultIconStyle
}

function normalizeMode(value: unknown): RThemeModePreference {
    return value === "day" || value === "night" || value === "system" ? value : "system"
}

function currentSharedPatch(): RThemePatch {
    return {
        density: densityValue.value,
        iconStyle: iconStyleValue.value,
        shape: createShapeTheme(shapeFamilyValue.value),
    }
}

function currentModePatch(): Partial<RTheme> {
    return {
        color: {
            primary: inputValue.value.trim() || defaultPrimary,
        },
    }
}

function currentPatch(): RThemePatch {
    const mode = resolveThemeMode(modeValue.value)
    const modeKey = mode === "night" ? "night" : "day"

    return {
        ...currentSharedPatch(),
        [modeKey]: currentModePatch(),
    }
}

function normalizeThemePatch(theme: unknown): RThemePatch {
    const next = typeof theme === "object" && theme != null ? (theme as RThemePatch) : {}
    const density = densityOptions.includes((next.density ?? NaN) as (typeof densityOptions)[number])
        ? (next.density as number)
        : defaultDensity
    const iconStyle = normalizeIconStyle(next.iconStyle)
    const shapeFamily = next.shape?.small?.family === "cut" ? "cut" : defaultShapeFamily

    return {
        density,
        iconStyle,
        shape: createShapeTheme(shapeFamily),
        day: {
            color: {
                primary:
                    typeof next.day?.color?.primary === "string" && isValidColor(next.day.color.primary)
                        ? next.day.color.primary
                        : undefined,
            },
        },
        night: {
            color: {
                primary:
                    typeof next.night?.color?.primary === "string" && isValidColor(next.night.color.primary)
                        ? next.night.color.primary
                        : undefined,
            },
        },
    }
}

function resolvePatchedThemes(patch: RThemePatch) {
    return resolveDayNightTheme(baseThemes, patch)
}

function readPersistedPatch() {
    if (!props.persist) {
        return props.defaultTheme
    }

    try {
        const raw = localStorage.getItem(props.storageKey)
        return raw ? normalizeThemePatch(JSON.parse(raw)) : props.defaultTheme
    } catch {
        return props.defaultTheme
    }
}

function readPersistedMode() {
    if (!props.persist) {
        return "system" as RThemeModePreference
    }

    try {
        return normalizeMode(localStorage.getItem(props.modeStorageKey))
    } catch {
        return "system"
    }
}

function writePersistedPatch(theme: RThemePatch) {
    if (!props.persist) {
        return
    }

    try {
        localStorage.setItem(props.storageKey, JSON.stringify(theme))
    } catch {
        // Ignore storage failures.
    }
}

function writePersistedMode(mode: RThemeModePreference) {
    if (!props.persist) {
        return
    }

    try {
        localStorage.setItem(props.modeStorageKey, mode)
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
        localStorage.removeItem(props.modeStorageKey)
    } catch {
        // Ignore storage failures.
    }
}

function applyResolvedTheme(theme: RTheme, shouldApply = true) {
    syncSuspended = true
    inputValue.value = theme.color?.primary ?? defaultPrimary
    densityValue.value = theme.density ?? defaultDensity
    iconStyleValue.value = theme.iconStyle ?? defaultIconStyle
    shapeFamilyValue.value = theme.shape?.small?.family ?? defaultShapeFamily
    if (shouldApply) {
        applyTheme(theme)
    }
    syncSuspended = false
}

function applyPatch(patch: RThemePatch) {
    const resolvedMode = resolveThemeMode(modeValue.value)
    const themes = resolvePatchedThemes(patch)
    document.documentElement.dataset.ruiTheme = resolvedMode
    document.documentElement.style.colorScheme = resolvedMode === "night" ? "dark" : "light"
    applyResolvedTheme(themes[resolvedMode])
    writePersistedPatch(patch)
}

watch(
    inputValue,
    (value) => {
        if (syncSuspended) return

        const trimmed = value.trim()
        if (!isValidColor(trimmed)) return

        applyPatch(currentPatch())
    },
    { flush: "sync" },
)

watch(
    densityValue,
    () => {
        if (syncSuspended) return
        applyPatch(currentPatch())
    },
    { flush: "sync" },
)

watch(
    iconStyleValue,
    () => {
        if (syncSuspended) return
        applyPatch(currentPatch())
    },
    { flush: "sync" },
)

watch(
    shapeFamilyValue,
    () => {
        if (syncSuspended) return
        applyPatch(currentPatch())
    },
    { flush: "sync" },
)

watch(
    modeValue,
    (value) => {
        if (syncSuspended) return

        const patch = readPersistedPatch()
        const resolvedMode = resolveThemeMode(value)
        const themes = resolvePatchedThemes(patch)
        document.documentElement.dataset.ruiTheme = resolvedMode
        document.documentElement.style.colorScheme = resolvedMode === "night" ? "dark" : "light"
        applyResolvedTheme(themes[resolvedMode])
        writePersistedMode(value)
    },
    { flush: "sync" },
)

function resetPrimaryColor() {
    const patch = readPersistedPatch()
    const mode = resolveThemeMode(modeValue.value)
    const modeKey = mode === "night" ? "night" : "day"
    const resolvedTheme = resolvePatchedThemes(props.defaultTheme)[mode]

    applyPatch({
        ...patch,
        [modeKey]: mergeTheme(patch[modeKey] ?? {}, {
            color: {
                primary: resolvedTheme.color?.primary ?? defaultPrimary,
            },
        }),
    })
}

function resetDensity() {
    const patch = readPersistedPatch()
    applyPatch({
        ...patch,
        density: baseThemes.day.density ?? defaultDensity,
    })
}

function resetIconStyle() {
    const patch = readPersistedPatch()
    applyPatch({
        ...patch,
        iconStyle: baseThemes.day.iconStyle ?? defaultIconStyle,
    })
}

function resetShape() {
    const patch = readPersistedPatch()
    applyPatch({
        ...patch,
        shape: createShapeTheme(baseThemes.day.shape?.small?.family ?? defaultShapeFamily),
    })
}

function resetAll() {
    removePersistedTheme()
    modeValue.value = "system"
    const resolvedMode = resolveThemeMode("system")
    const themes = resolvePatchedThemes(props.defaultTheme)
    document.documentElement.dataset.ruiTheme = resolvedMode
    document.documentElement.style.colorScheme = resolvedMode === "night" ? "dark" : "light"
    applyResolvedTheme(themes[resolvedMode])
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

onMounted(() => {
    modeValue.value = readPersistedMode()
    const patch = readPersistedPatch()
    const resolvedMode = resolveThemeMode(modeValue.value)
    const themes = resolvePatchedThemes(patch)

    if (props.restoreOnMounted) {
        document.documentElement.dataset.ruiTheme = resolvedMode
        document.documentElement.style.colorScheme = resolvedMode === "night" ? "dark" : "light"
    }

    applyResolvedTheme(themes[resolvedMode], props.restoreOnMounted)
})
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
                <label class="theme-playground__field">
                    <span>Mode</span>
                    <select v-model="modeValue">
                        <option value="system">System</option>
                        <option value="day">Day</option>
                        <option value="night">Night</option>
                    </select>
                </label>

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

                <label class="theme-playground__field">
                    <span>Icon style</span>
                    <select v-model="iconStyleValue">
                        <option v-for="style in R_ICON_STYLES" :key="style" :value="style">{{ style }}</option>
                    </select>
                </label>

                <div class="theme-playground__field">
                    <span>Shape</span>
                    <RButtonGroup v-model="shapeFamilyValue" selection="single" aria-label="Shape family" full-width>
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
}

.theme-playground__field {
    display: grid;
    gap: 0.375rem;
}

.theme-playground__field select {
    padding: 0.375rem 0.5rem;
}

.theme-playground__actions {
    justify-content: flex-end;
}
</style>
