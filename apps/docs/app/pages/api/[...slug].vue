<script setup lang="ts">
import type { Ref } from "vue"

import type { ApiEntry, ReadingMode } from "@docs/lib/docs"
import { getModeUrl, getReadingMode, groupApi } from "@docs/lib/docs"
import { RSurface } from "@ripple-design/rui"

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const locale = useI18n().locale as Ref<string>

const slug = computed(() => {
    const value = route.params.slug
    return Array.isArray(value) ? value.join("/") : (value ?? "")
})

const { data: entry } = await useAsyncData(`api-entry-${locale.value}-${slug.value}`, () =>
    queryCollection("api")
        .where("locale", "=", locale.value)
        .where("routeSlug", "=", slug.value)
        .first(),
)

if (!entry.value) {
    throw createError({ statusCode: 404, statusMessage: "API page not found" })
}

const { data: allApi } = await useAsyncData(`api-list-${locale.value}`, () =>
    queryCollection("api")
        .where("locale", "=", locale.value)
        .select("path", "title", "routeSlug", "locale", "docs", "designOrder", "developOrder")
        .all(),
)

const currentUrl = computed(() => new URL(route.fullPath, "http://localhost"))
const mode = computed<ReadingMode>(() => getReadingMode(currentUrl.value))
const apiEntries = computed(() =>
    groupApi((allApi.value ?? []) as ApiEntry[], locale.value, mode.value),
)

useHead(() => ({
    title: entry.value?.title ?? "API",
}))
</script>

<template>
    <div class="api-shell">
        <RSurface as="aside" variant="outlined" class="api-sidebar">
            <nav aria-label="API navigation">
                <h2>API</h2>
                <ol>
                    <li v-for="item in apiEntries" :key="item.routeSlug">
                        <a :href="`/${locale}/api/${item.routeSlug}`">{{ item.title }}</a>
                    </li>
                </ol>
            </nav>
        </RSurface>

        <article class="api-content">
            <header>
                <h1>{{ entry?.title }}</h1>
                <p>Current reading mode: {{ mode }}</p>
                <nav class="api-mode" aria-label="Reading mode">
                    <ul>
                        <li>
                            <a
                                :href="getModeUrl(currentUrl, 'design')"
                                :aria-current="mode === 'design' ? 'true' : undefined"
                            >
                                Design
                            </a>
                        </li>
                        <li>
                            <a
                                :href="getModeUrl(currentUrl, 'develop')"
                                :aria-current="mode === 'develop' ? 'true' : undefined"
                            >
                                Develop
                            </a>
                        </li>
                    </ul>
                </nav>
                <p class="api-links">
                    <a :href="entry?.docs">Back to docs</a>
                </p>
            </header>
            <div class="docs-body">
                <ContentRenderer v-if="entry" :value="entry" />
            </div>
        </article>

        <RSurface as="aside" variant="outlined" class="api-outline">
            <nav aria-label="API page context">
                <h2>Context</h2>
                <ul>
                    <li><a :href="entry?.docs">Docs page</a></li>
                    <li>
                        <a :href="`/${locale}/api/${entry?.routeSlug}`">Current API</a>
                    </li>
                </ul>
            </nav>
        </RSurface>
    </div>
</template>

<style scoped>
.api-shell {
    display: grid;
    gap: 1.5rem;
}

.api-sidebar,
.api-outline {
    padding: 1.25rem;
}

.api-content {
    border: 1px solid #d0d0d0;
    padding: 1rem;
}

.api-sidebar ol,
.api-outline ul {
    margin: 0;
    padding-left: 1.25rem;
}

.api-mode ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

.api-mode,
.api-links {
    margin-top: 1rem;
}

.api-content h1 {
    margin-top: 0;
}

.api-outline ul {
    list-style: none;
    padding-left: 0;
}

.api-outline li + li {
    margin-top: 0.5rem;
}

@media (min-width: 900px) {
    .api-shell {
        grid-template-columns: 16rem minmax(0, 1fr) 14rem;
        align-items: start;
    }

    .api-sidebar,
    .api-outline {
        position: sticky;
        top: 1rem;
    }
}
</style>
