<script setup lang="ts">
import {
    RIFavoriteBorderFilled,
    RIHomeOutlined,
    RIPlayCircleOutlined,
    RISettingsOutlined,
} from "@ripple-design/icons"
import {
    RCard,
    RIconButton,
    RNavigationRail,
    RNavigationRailItem,
    RScaffold,
    RTopAppBar,
} from "@ripple-design/rui"
import { computed, ref } from "vue"

const destination = ref("overview")

const workspace = computed(() => {
    const destinations = {
        overview: {
            title: "Team overview",
            subtitle: "This week",
            cards: ["Design review", "Release readiness", "Customer feedback"],
        },
        projects: {
            title: "Active projects",
            subtitle: "12 projects in progress",
            cards: ["Mobile refresh", "Onboarding", "Design system"],
        },
        favorites: {
            title: "Saved work",
            subtitle: "Recently viewed",
            cards: ["Launch checklist", "Research notes", "Sprint plan"],
        },
        settings: {
            title: "Workspace settings",
            subtitle: "Team preferences",
            cards: ["Members", "Notifications", "Billing"],
        },
    }

    return destinations[destination.value as keyof typeof destinations]
})
</script>

<template>
    <RScaffold class="scaffold-workspace-demo" :app-bar="{ contentAlign: 'body' }">
        <template #navigation>
            <RNavigationRail v-model="destination" aria-label="Workspace navigation">
                <template #top>Studio</template>
                <RNavigationRailItem value="overview" :icon="RIHomeOutlined">Overview</RNavigationRailItem>
                <RNavigationRailItem value="projects" :icon="RIPlayCircleOutlined">Projects</RNavigationRailItem>
                <RNavigationRailItem value="favorites" :icon="RIFavoriteBorderFilled">Saved</RNavigationRailItem>
                <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
            </RNavigationRail>
        </template>

        <template #app-bar>
                <RTopAppBar>
                    <template #title>{{ workspace.title }}</template>
                    <template #subtitle>{{ workspace.subtitle }}</template>
                    <template #actions>
                        <RIconButton :icon="RISettingsOutlined" label="Workspace settings" />
                    </template>
                </RTopAppBar>
        </template>

        <div class="scaffold-workspace-demo__content">
            <section class="scaffold-workspace-demo__summary" aria-label="Workspace summary">
                <span>24</span>
                <p>Open items assigned to the team</p>
            </section>

            <div class="scaffold-workspace-demo__cards">
                <RCard v-for="card in workspace.cards" :key="card" class="scaffold-workspace-demo__card">
                    <h3>{{ card }}</h3>
                    <p>Updated today · Shared with the product team</p>
                </RCard>
            </div>
        </div>
    </RScaffold>
</template>

<style scoped>
.scaffold-workspace-demo {
    block-size: min(62vh, 480px);
    min-block-size: 360px;
    overflow: hidden;
}

.scaffold-workspace-demo__content {
    display: grid;
    gap: 16px;
    padding: 20px;
}

.scaffold-workspace-demo__summary {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 20px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--rui-sys-color-primary) 12%, var(--rui-sys-color-surface));
}

.scaffold-workspace-demo__summary span {
    color: var(--rui-sys-color-primary);
    font-size: 2rem;
    font-weight: 700;
}

.scaffold-workspace-demo__summary p,
.scaffold-workspace-demo__card h3,
.scaffold-workspace-demo__card p {
    margin: 0;
}

.scaffold-workspace-demo__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.scaffold-workspace-demo__card {
    min-block-size: 132px;
    padding: 16px;
}

.scaffold-workspace-demo__card p {
    margin-block-start: 8px;
    color: var(--rui-sys-color-on-surface-medium);
}

:global(.demo-preview:fullscreen .scaffold-workspace-demo) {
    block-size: 100%;
    min-block-size: 0;
}
</style>
