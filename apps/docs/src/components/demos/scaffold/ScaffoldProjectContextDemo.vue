<script setup lang="ts">
import { RIHomeOutlined, RIMoreVertFilled } from "@ripple-design/icons"
import {
    RAppBarContainer,
    RCard,
    RChip,
    RIconButton,
    RResponsiveGrid,
    RScaffold,
    RSideSheet,
    RTopAppBar,
    vColumnSpan,
} from "@ripple-design/rui"
import { computed, ref } from "vue"

type Project = {
    id: string
    name: string
    status: string
    owner: string
    summary: string
}

const projects: Project[] = [
    {
        id: "mobile",
        name: "Mobile refresh",
        status: "In review",
        owner: "Avery",
        summary: "Validate the updated navigation patterns before the beta milestone.",
    },
    {
        id: "onboarding",
        name: "Onboarding flow",
        status: "On track",
        owner: "Morgan",
        summary: "Prepare the guided setup flow for the next cohort of new teams.",
    },
    {
        id: "tokens",
        name: "Design tokens",
        status: "Blocked",
        owner: "Jordan",
        summary: "Resolve the remaining semantic color decisions with the accessibility review.",
    },
    {
        id: "reporting",
        name: "Usage reporting",
        status: "Planning",
        owner: "Taylor",
        summary: "Turn the research findings into a lightweight reporting surface.",
    },
]

const selectedId = ref(projects[0].id)
const selectedProject = computed(() => projects.find((project) => project.id === selectedId.value) ?? projects[0])
</script>

<template>
    <RScaffold class="scaffold-project-context-demo">
        <template #app-bar>
            <RAppBarContainer content-align="body">
                <RTopAppBar>
                    <template #navigation>
                        <RIconButton :icon="RIHomeOutlined" label="Open workspace" />
                    </template>
                    <template #title>Projects</template>
                    <template #subtitle>Spring planning</template>
                    <template #actions>
                        <RIconButton :icon="RIMoreVertFilled" label="Project actions" />
                    </template>
                </RTopAppBar>
            </RAppBarContainer>
        </template>

        <div class="scaffold-project-context-demo__content">
            <RResponsiveGrid mode="full-width" gap="12px">
                <RCard
                    v-for="project in projects"
                    :key="project.id"
                    clickable
                    selectable
                    :selected="selectedId === project.id"
                    class="scaffold-project-context-demo__card"
                    v-column-span="{ csm: 4, cmd: 4, clg: 6 }"
                    @click="selectedId = project.id"
                >
                    <RChip variant="outlined">{{ project.status }}</RChip>
                    <h3>{{ project.name }}</h3>
                    <p>{{ project.summary }}</p>
                    <span>Owner · {{ project.owner }}</span>
                </RCard>
            </RResponsiveGrid>
        </div>

        <template #side-sheet>
            <RSideSheet :title="selectedProject.name" width="272px">
                <div class="scaffold-project-context-demo__details">
                    <RChip>{{ selectedProject.status }}</RChip>
                    <p>{{ selectedProject.summary }}</p>
                    <dl>
                        <div>
                            <dt>Owner</dt>
                            <dd>{{ selectedProject.owner }}</dd>
                        </div>
                        <div>
                            <dt>Next milestone</dt>
                            <dd>Friday review</dd>
                        </div>
                    </dl>
                </div>
            </RSideSheet>
        </template>
    </RScaffold>
</template>

<style scoped>
.scaffold-project-context-demo {
    block-size: min(62vh, 500px);
    min-block-size: 380px;
    overflow: hidden;
    border: 1px solid var(--rui-sys-color-on-surface-outline);
    border-radius: 12px;
}

.scaffold-project-context-demo__content {
    padding: 16px;
}

.scaffold-project-context-demo__card {
    display: grid;
    gap: 12px;
    min-block-size: 190px;
    padding: 16px;
}

.scaffold-project-context-demo__card h3,
.scaffold-project-context-demo__card p,
.scaffold-project-context-demo__details p {
    margin: 0;
}

.scaffold-project-context-demo__card p,
.scaffold-project-context-demo__card span,
.scaffold-project-context-demo__details p,
.scaffold-project-context-demo__details dt {
    color: var(--rui-sys-color-on-surface-medium);
}

.scaffold-project-context-demo__details {
    display: grid;
    gap: 20px;
}

.scaffold-project-context-demo__details dl {
    display: grid;
    gap: 16px;
    margin: 0;
}

.scaffold-project-context-demo__details dl div {
    display: grid;
    gap: 4px;
}

.scaffold-project-context-demo__details dt,
.scaffold-project-context-demo__details dd {
    margin: 0;
}
</style>
