<script setup lang="ts">
import { RIMoreVertFilled } from "@ripple-design/icons"
import {
    RButton,
    RIconButton,
    RMenu,
    RMenuItem,
    RNavigationDrawer,
    RNavigationDrawerGroup,
    RNavigationDrawerItem,
    RScaffold,
    RTab,
    RTabBar,
    RTopAppBar,
    vColumnSpan,
} from "@ripple-design/rui"
import {
    createInternationalizationController,
    provideInternationalization,
} from "@ripple-design/rui/foundations/internationalization"
import { computed, onMounted, ref, watch } from "vue"

import type { ComponentsNavigation } from "../../lib/docs"

import ThemeControlSheet from "./ThemeControlSheet.vue"

type DocsDirection = "ltr" | "rtl"

type DocsNavigationItem = {
    label: string
    href: string
    value: string
}

type DocsLocaleLink = {
    code: string
    href: string
}

const props = defineProps<{
    activeNavigation: string
    componentsNavigation?: ComponentsNavigation
    direction: DocsDirection
    locale: string
    localeLinks: DocsLocaleLink[]
    navigation: DocsNavigationItem[]
}>()

const direction = ref<DocsDirection>(props.direction)
const internationalization = createInternationalizationController({}, {}, props.locale)
provideInternationalization(internationalization)
const storedDirection = ref<DocsDirection | null>(null)

watch(
    () => props.locale,
    (locale) => {
        internationalization.setLocale(locale)
    },
)
const resolvedLocaleLinks = computed(() =>
    props.localeLinks.map((item) => {
        const href = new URL(item.href, "http://localhost")

        if (!href.searchParams.has("dir") && storedDirection.value === "rtl") {
            href.searchParams.set("dir", "rtl")
        }

        return {
            ...item,
            href: `${href.pathname}${href.search}`,
        }
    }),
)

function navigate(href: string) {
    window.location.assign(href)
}

function setDirection(value: DocsDirection) {
    const url = new URL(window.location.href)

    direction.value = value
    url.searchParams.set("dir", value)
    localStorage.setItem("rui-docs-dir", value)
    document.documentElement.setAttribute("dir", value)
    history.replaceState({}, "", `${url.pathname}${url.search}`)
}

onMounted(() => {
    storedDirection.value = localStorage.getItem("rui-docs-dir") === "rtl" ? "rtl" : null
})
</script>

<template>
    <RScaffold
        class="docs-scaffold"
        initial-top-inset="var(--docs-shell-app-bar-height)"
        :app-bar="{ color: 'primary', contentAlign: 'full-width' }"
    >
        <template v-if="componentsNavigation" #clipped-navigation>
            <RNavigationDrawer
                class="docs-components-navigation"
                :model-value="componentsNavigation.activeValue"
                title="Components"
                aria-label="Components navigation"
            >
                <RNavigationDrawerGroup
                    v-for="group in componentsNavigation.groups"
                    :key="group.group"
                    :title="group.group"
                >
                    <RNavigationDrawerItem
                        v-for="item in group.items"
                        :key="item.value"
                        :href="item.href"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </RNavigationDrawerItem>
                </RNavigationDrawerGroup>
            </RNavigationDrawer>
        </template>

        <template #app-bar>
            <RTopAppBar aria-label="Site navigation">
                <template #title>Ripple Design</template>

                <template #actions>
                    <div class="docs-toolbar__actions">
                        <div class="docs-toolbar__actions docs-toolbar__actions--wide">
                            <nav class="docs-toolbar__tabs" aria-label="Primary">
                                <RTabBar
                                    :model-value="activeNavigation"
                                    variant="primary"
                                    color="on-primary"
                                    :divider="false"
                                >
                                    <RTab
                                        v-for="item in navigation"
                                        :key="item.value"
                                        :value="item.value"
                                        :href="item.href"
                                        :aria-current="item.value === activeNavigation ? 'page' : undefined"
                                    >
                                        {{ item.label }}
                                    </RTab>
                                </RTabBar>
                            </nav>
                            <nav class="docs-toolbar__locale" aria-label="Language switcher">
                                <RButton
                                    v-for="item in resolvedLocaleLinks"
                                    :key="item.code"
                                    :href="item.href"
                                    :aria-current="item.code === locale ? 'true' : undefined"
                                    variant="text"
                                    sentence-case
                                >
                                    {{ item.code }}
                                </RButton>
                            </nav>
                            <div class="docs-toolbar__direction" aria-label="Direction switcher">
                                <RButton
                                    :aria-pressed="direction === 'ltr' ? 'true' : 'false'"
                                    variant="text"
                                    sentence-case
                                    @click="setDirection('ltr')"
                                >
                                    LTR
                                </RButton>
                                <RButton
                                    :aria-pressed="direction === 'rtl' ? 'true' : 'false'"
                                    variant="text"
                                    sentence-case
                                    @click="setDirection('rtl')"
                                >
                                    RTL
                                </RButton>
                            </div>
                        </div>
                        <ThemeControlSheet />

                        <div class="docs-toolbar__actions docs-toolbar__actions--compact">
                            <RMenu align="end">
                                <template #trigger>
                                    <RIconButton :icon="RIMoreVertFilled" label="More documentation options" />
                                </template>

                                <RMenuItem v-for="item in navigation" :key="item.href" @click="navigate(item.href)">
                                    {{ item.label }}
                                </RMenuItem>
                                <RMenuItem
                                    v-for="item in resolvedLocaleLinks"
                                    :key="item.code"
                                    :aria-current="item.code === locale ? 'true' : undefined"
                                    @click="navigate(item.href)"
                                >
                                    {{ item.code }}
                                </RMenuItem>
                                <RMenuItem @click="setDirection('ltr')">LTR</RMenuItem>
                                <RMenuItem @click="setDirection('rtl')">RTL</RMenuItem>
                            </RMenu>
                        </div>
                    </div>
                </template>
            </RTopAppBar>
        </template>

        <div v-column-span="{ cxs: 4, csm: 8, cmd: 12 }" class="docs-page-shell">
            <slot />
        </div>
    </RScaffold>
</template>

<style scoped lang="scss">
.docs-scaffold {
    --docs-shell-app-bar-height: 56px;

    block-size: 100dvh;
}

.docs-components-navigation {
    display: none;
}

.docs-page-shell {
    inline-size: min(1440px, 100% - 2rem);
    margin-inline: auto;
    padding-block: 1rem 2rem;
}

.docs-toolbar__tabs,
.docs-toolbar__locale,
.docs-toolbar__direction,
.docs-toolbar__actions {
    display: flex;
    align-items: center;
    min-inline-size: 0;
}

.docs-toolbar__actions :deep(.rui-button) {
    --rui-button-color: var(--rui-sys-color-on-primary);
}

.docs-toolbar__actions--compact {
    display: flex;
}

.docs-toolbar__actions--wide {
    display: none;
}

@media (min-width: 720px) {
    .docs-scaffold {
        --docs-shell-app-bar-height: 64px;
    }
}

@media (min-width: 960px) {
    .docs-toolbar__actions--wide {
        display: flex;
    }

    .docs-toolbar__actions--compact {
        display: none;
    }
}
@media (min-width: 1200px) {
    .docs-components-navigation {
        display: block;
    }
}
</style>
