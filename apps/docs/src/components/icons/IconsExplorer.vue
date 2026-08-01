<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue"

import { RIcon, RTextField, vRipple } from "@ripple-design/rui"

import {
    getIconCount,
    getIconExportName,
    getIconPath,
    groupIconsByCategory,
    ICON_STYLES,
    type IconVariant,
} from "../../lib/icons"
import type { IconRecord } from "../../lib/icons"

type Props = {
    locale: string
    currentStyle: IconVariant
    currentDir?: string | null
}

const props = defineProps<Props>()
const query = ref("")
const copiedIconName = ref<string | null>(null)
let copiedResetTimer: ReturnType<typeof setTimeout> | null = null

const allGroups = groupIconsByCategory()
const totalCount = getIconCount()

const filteredGroups = computed(() => {
    const normalizedQuery = query.value.trim().toLocaleLowerCase()

    if (!normalizedQuery) {
        return allGroups
    }

    return allGroups
        .map(({ category, items }) => ({
            category,
            items: items.filter((item) => matchesQuery(item, normalizedQuery)),
        }))
        .filter(({ items }) => items.length > 0)
})

const filteredCount = computed(() => filteredGroups.value.reduce((count, group) => count + group.items.length, 0))
const hasQuery = computed(() => query.value.trim().length > 0)

function matchesQuery(item: IconRecord, normalizedQuery: string) {
    return [item.name, ...item.categories, ...item.tags].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery),
    )
}

function getStyleHref(style: IconVariant) {
    const pathname = style === ICON_STYLES[0] ? `/${props.locale}/icons` : `/${props.locale}/icons/${style}`
    return props.currentDir ? `${pathname}?dir=${encodeURIComponent(props.currentDir)}` : pathname
}

async function copyIconName(name: string) {
    const exportName = getIconExportName(name, props.currentStyle)

    try {
        await navigator.clipboard.writeText(exportName)
    } catch {
        return
    }

    copiedIconName.value = exportName

    if (copiedResetTimer != null) {
        clearTimeout(copiedResetTimer)
    }

    copiedResetTimer = setTimeout(() => {
        copiedIconName.value = null
        copiedResetTimer = null
    }, 1200)
}

onBeforeUnmount(() => {
    if (copiedResetTimer != null) {
        clearTimeout(copiedResetTimer)
    }
})
</script>

<template>
    <section class="icons-page">
        <header>
            <h1>Icons</h1>
            <p class="icons-count" aria-live="polite">
                {{ hasQuery ? `${filteredCount} matching icons.` : `${totalCount} icons from data.json.` }}
            </p>
            <div class="icons-controls">
                <RTextField v-model="query" label="Search icons" placeholder="Search by name, category, or tag" />
                <nav class="icons-toolbar" aria-label="Icon styles">
                    <span>Style:</span>
                    <ul>
                        <li v-for="style in ICON_STYLES" :key="style">
                            <a
                                :href="getStyleHref(style)"
                                :aria-current="style === currentStyle ? 'page' : undefined"
                            >
                                {{ style }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

        <template v-if="filteredGroups.length > 0">
            <section v-for="group in filteredGroups" :key="group.category" class="icons-group">
                <h2>{{ group.category }}</h2>
                <div class="icons-grid">
                    <article
                        v-for="item in group.items"
                        :key="item.name"
                        v-ripple.unbounded
                        class="icon-item"
                        role="button"
                        tabindex="0"
                        :aria-label="`Copy ${getIconExportName(item.name, currentStyle)}`"
                        @click="copyIconName(item.name)"
                        @keydown.enter.prevent="copyIconName(item.name)"
                        @keydown.space.prevent="copyIconName(item.name)"
                    >
                        <div class="icon-item__glyph" aria-hidden="true">
                            <RIcon :icon="getIconPath(item.name, currentStyle)" decorative size="2rem" />
                        </div>
                        <strong>{{ item.name }}</strong>
                    </article>
                </div>
            </section>
        </template>
        <p v-else class="icons-empty" role="status">No icons match “{{ query }}”.</p>
        <p v-if="copiedIconName" class="icons-copied" role="status">Copied {{ copiedIconName }}</p>
    </section>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/rui" as rui;

.icons-page {
    display: grid;
    gap: 1.5rem;
}

.icons-page header {
    display: grid;
    gap: 0.75rem;
}

.icons-page h1 {
    @include rui.typo-headline4;

    margin: 0;
}

.icons-page h2 {
    @include rui.typo-headline6;

    margin: 0;
    text-transform: capitalize;
}

.icons-controls {
    display: grid;
    gap: 1rem;
}

.icons-controls :deep(.rui-field-shell) {
    max-inline-size: 32rem;
}

.icons-toolbar {
    @include rui.typo-body2;

    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
}

.icons-toolbar ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

.icons-toolbar a {
    @include rui.typo-body2;

    display: inline-flex;
    padding: 0.35rem 0.75rem;
    border: 1px solid rui.$color-on-surface-outline;
    border-radius: 999px;
    color: inherit;
    text-decoration: none;
}

.icons-toolbar a[aria-current="page"] {
    background: rui.$color-primary;
    color: rui.$color-on-primary;
    border-color: rui.$color-primary;
}

.icons-group {
    display: grid;
    gap: 1rem;
}

.icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: 0.5rem;
}

.icon-item {
    @include rui.typo-body2;

    position: relative;
    display: flex;
    min-block-size: 6rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 0.5rem;
    color: rui.$color-on-surface-medium;
    cursor: pointer;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.icon-item strong {
    overflow: hidden;
    max-inline-size: 100%;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icons-count,
.icons-empty {
    @include rui.typo-body2;

    color: rui.$color-on-surface-medium;
}

.icons-copied {
    @include rui.typo-body2;

    color: rui.$color-primary;
}
</style>
