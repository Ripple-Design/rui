<script setup lang="ts">
import type { Ref } from "vue"

import DocsScaffoldShell from "@docs/components/docs/DocsScaffoldShell.vue"
import type { ComponentsNavigation, DocsEntry, Locale, ReadingMode } from "@docs/lib/docs"
import { getDirectionMode, getLocaleUrl, getReadingMode, groupDocs, isDocTab, locales } from "@docs/lib/docs"
import { createDocsThemeBootstrapScript } from "@docs/lib/theme"

const route = useRoute()
const i18n = useI18n()
const locale = i18n.locale as Ref<Locale>
const { t } = i18n

const currentUrl = computed(() => new URL(route.fullPath, "http://localhost"))
const direction = computed(() => getDirectionMode(currentUrl.value))
const readingMode = computed<ReadingMode>(() => getReadingMode(currentUrl.value))

const pathSegments = computed(() => route.path.split("/").filter(Boolean))
const isApiPage = computed(() => route.path.startsWith(`/${locale.value}/api/`))
const isIconsPage = computed(() => route.path.startsWith(`/${locale.value}/icons`))
const isDocsPage = computed(() => {
    const segments = pathSegments.value
    return (
        !isApiPage.value &&
        !isIconsPage.value &&
        segments.length >= 2 &&
        isDocTab(segments.at(-1) ?? "")
    )
})

const { data: allDocs } = await useAsyncData(
    () => `docs-navigation-${locale.value}`,
    () =>
        queryCollection("docs")
            .where("locale", "=", locale.value)
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

const componentsNavigation = computed<ComponentsNavigation | undefined>(() => {
    if (!isDocsPage.value) {
        return undefined
    }

    const activeValue = pathSegments.value.slice(1, -1).join("/")
    const groups = groupDocs((allDocs.value ?? []) as DocsEntry[], locale.value, readingMode.value)

    return {
        activeValue,
        groups: groups.map(({ group, items }) => ({
            group,
            items: items.map((item) => ({
                href: `/${locale.value}/${item.docSlug}/${item.tab}${search.value}`,
                label: item.title,
                value: item.docSlug,
            })),
        })),
    }
})

const navigation = computed(() => [
    { label: t("components"), href: `/${locale.value}/getting-started/spec`, value: "components" },
    { label: t("icons"), href: `/${locale.value}/icons`, value: "icons" },
    { label: "API", href: `/${locale.value}/api/text-field`, value: "api" },
])

const activeNavigation = computed(() => {
    if (isIconsPage.value) {
        return "icons"
    }

    if (isApiPage.value) {
        return "api"
    }

    return "components"
})

const localeLinks = computed(() =>
    locales.map((code) => ({
        code,
        href: getLocaleUrl(currentUrl.value, code),
    })),
)

const docsThemeBootstrapScript = createDocsThemeBootstrapScript()
const localeHead = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
})

useHead(() => ({
    title: "Ripple Design",
    htmlAttrs: {
        ...localeHead.value.htmlAttrs,
        lang: locale.value,
        dir: direction.value,
    },
    link: localeHead.value.link,
    meta: localeHead.value.meta,
    script: [
        {
            innerHTML: docsThemeBootstrapScript,
            tagPosition: "head",
        },
    ],
}))
</script>

<template>
    <DocsScaffoldShell
        :active-navigation="activeNavigation"
        :components-navigation="componentsNavigation"
        :direction="direction"
        :locale="locale"
        :locale-links="localeLinks"
        :navigation="navigation"
    >
        <slot />
    </DocsScaffoldShell>
</template>
