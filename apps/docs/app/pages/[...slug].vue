<script setup lang="ts">
import type { Ref } from "vue"

import DocsTabBar from "@docs/components/docs/DocsTabBar.vue"
import type { DocsEntry, DocTab, Locale } from "@docs/lib/docs"
import { extractOutline, getTabsForDoc, isDocTab } from "@docs/lib/docs"
import { RSurface } from "@ripple-design/rui"

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const i18n = useI18n()
const locale = i18n.locale as Ref<Locale>
const { t } = i18n

const segments = computed(() => {
    const slug = route.params.slug
    return Array.isArray(slug) ? slug : slug ? [slug] : []
})
const tab = computed(() => segments.value.at(-1) ?? "")
const docSlug = computed(() => segments.value.slice(0, -1).join("/"))

if (!isDocTab(tab.value) || !docSlug.value) {
    throw createError({ statusCode: 404, statusMessage: "Invalid documentation route" })
}

const pageKey = `${locale.value}-${docSlug.value}-${tab.value}`

const { data: entry } = await useAsyncData(`docs-entry-${pageKey}`, () =>
    queryCollection("docs")
        .where("locale", "=", locale.value)
        .where("docSlug", "=", docSlug.value)
        .where("tab", "=", tab.value)
        .first(),
)

if (!entry.value) {
    throw createError({ statusCode: 404, statusMessage: "Documentation page not found" })
}

const { data: renderEntry } = await useAsyncData(`docs-render-${pageKey}`, () => {
    if (locale.value !== "zh-cn" || tab.value !== "implementation") {
        return Promise.resolve(entry.value)
    }

    return queryCollection("docs")
        .where("locale", "=", "en")
        .where("docSlug", "=", docSlug.value)
        .where("tab", "=", "implementation")
        .first()
        .then((fallback) => fallback ?? entry.value)
})

const { data: siblingEntries } = await useAsyncData(`docs-siblings-${locale.value}-${docSlug.value}`, () =>
    queryCollection("docs")
        .where("locale", "=", locale.value)
        .where("docSlug", "=", docSlug.value)
        .select("path", "title", "docSlug", "tab", "locale", "designOrder", "developOrder", "api")
        .all(),
)

const search = computed(() => {
    const params = new URLSearchParams()

    if (route.query.mode) {
        params.set("mode", String(route.query.mode))
    }

    if (route.query.dir) {
        params.set("dir", String(route.query.dir))
    }

    const value = params.toString()
    return value ? `?${value}` : ""
})

const tabs = computed(() =>
    getTabsForDoc((siblingEntries.value ?? []) as DocsEntry[], locale.value, docSlug.value).map(
        (item) => ({
            value: item.tab,
            label: t(item.tab),
            href: `/${locale.value}/${item.docSlug}/${item.tab}${search.value}`,
        }),
    ),
)

const outline = computed(() => extractOutline(entry.value as DocsEntry | null))
const activeTab = computed(() => tab.value as DocTab)

useHead(() => ({
    title: entry.value?.title ?? "Components",
}))
</script>

<template>
    <div class="docs-shell">
        <article class="docs-content">
            <header>
                <h1>{{ entry?.title }}</h1>
                <DocsTabBar :active-tab="activeTab" :tabs="tabs" />
            </header>

            <div class="docs-body">
                <ContentRenderer v-if="renderEntry" :value="renderEntry" />
            </div>
        </article>

        <RSurface as="aside" variant="outlined" class="docs-outline">
            <nav aria-label="Current section outline">
                <h2>{{ t("on-this-page") }}</h2>
                <h3>{{ t(tab) }}</h3>
                <ul>
                    <li v-for="item in outline" :key="item.slug" :data-depth="item.depth">
                        <a :href="`#${item.slug}`">{{ item.text }}</a>
                    </li>
                    <li v-if="outline.length === 0">{{ t("no-subsection-headings") }}</li>
                </ul>
            </nav>
        </RSurface>
    </div>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/styles/index" as rui;

.docs-shell {
    display: grid;
    gap: 1.5rem;
}

.docs-content {
    min-width: 0;
}

.docs-outline {
    padding: 1.25rem;
    color: rui.$color-on-surface;
}

.docs-outline h2 {
    @include rui.typo-headline6;

    margin: 0 0 1rem;
}

.docs-outline h3 {
    @include rui.typo-subtitle2;

    margin: 0 0 0.5rem;
}

.docs-outline a {
    @include rui.typo-body2;

    color: rui.$color-on-surface-high;
}

.docs-outline a:hover,
.docs-outline a:focus-visible {
    color: rui.$color-primary;
}

.docs-body > ul,
.docs-outline ul {
    margin: 0;
    padding-inline-start: 1.25rem;
}

.docs-content header {
    margin-bottom: 1.5rem;
}

.docs-content h1 {
    @include rui.typo-headline1;

    margin: 0;
    color: rui.$color-on-surface;
}

.docs-tabs {
    margin-top: 1rem;
}

.docs-outline ul {
    list-style: none;
    padding-left: 0;
}

.docs-outline li + li {
    margin-top: 0.5rem;
}

.docs-outline li[data-depth="3"] {
    padding-left: 1rem;
}

.docs-outline li[data-depth="4"] {
    padding-left: 2rem;
}

@media (min-width: 1200px) {
    .docs-shell {
        grid-template-columns: minmax(0, 1fr) 14rem;
        align-items: start;
    }

    .docs-outline {
        position: sticky;
        top: 1rem;
    }
}
</style>
