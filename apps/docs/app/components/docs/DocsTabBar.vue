<script setup lang="ts">
import {
    RIDesignServicesOutlined,
    RIIntegrationInstructionsOutlined,
    RIStyleOutlined,
} from "@ripple-design/icons"
import { RTab, RTabBar } from "@ripple-design/rui"

import type { DocTab } from "../../lib/docs"

export type DocsTabLink = {
    value: DocTab
    label: string
    href: string
}

const iconByTab: Record<DocTab, string> = {
    spec: RIStyleOutlined,
    guidelines: RIDesignServicesOutlined,
    implementation: RIIntegrationInstructionsOutlined,
}

withDefaults(
    defineProps<{
        activeTab: DocTab
        tabs: DocsTabLink[]
        ariaLabel?: string
    }>(),
    {
        ariaLabel: "Page sections",
    },
)
</script>

<template>
    <nav :aria-label="ariaLabel" class="docs-tabs">
        <RTabBar :model-value="activeTab" icon-layout="horizontal" full-width>
            <RTab
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :href="tab.href"
                :icon="iconByTab[tab.value]"
                :aria-current="tab.value === activeTab ? 'page' : undefined"
            >
                {{ tab.label }}
            </RTab>
        </RTabBar>
    </nav>
</template>
