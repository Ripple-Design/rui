<script setup lang="ts">
import {
    RIAddFilled,
    RIArchiveOutlined,
    RIHomeOutlined,
    RIInboxOutlined,
    RINotificationsOutlined,
} from "@ripple-design/icons"
import {
    RAppBarContainer,
    RFab,
    RIconButton,
    RList,
    RListItem,
    RScaffold,
    RBottomNavigation,
    RBottomNavigationItem,
    RTopAppBar,
} from "@ripple-design/rui"
import { computed, ref } from "vue"

type Activity = {
    id: number
    type: "updates" | "tasks" | "saved"
    title: string
    detail: string
}

const destination = ref("updates")
const activities: Activity[] = [
    { id: 1, type: "updates", title: "Avery approved the release checklist", detail: "5 minutes ago" },
    { id: 2, type: "tasks", title: "Review navigation prototypes", detail: "Due today" },
    { id: 3, type: "updates", title: "Morgan shared research notes", detail: "24 minutes ago" },
    { id: 4, type: "saved", title: "Save the accessibility audit", detail: "Yesterday" },
    { id: 5, type: "tasks", title: "Prepare the design critique", detail: "Tomorrow" },
    { id: 6, type: "updates", title: "Jordan started the token review", detail: "Yesterday" },
    { id: 7, type: "saved", title: "Save the launch checklist", detail: "Friday" },
    { id: 8, type: "updates", title: "Taylor published the project brief", detail: "Friday" },
    { id: 9, type: "tasks", title: "Confirm beta participants", detail: "Next week" },
    { id: 10, type: "updates", title: "A new comment was added to onboarding", detail: "Next week" },
]

const feed = computed(() => activities.filter((activity) => activity.type === destination.value || destination.value === "updates"))
const heading = computed(() => ({ updates: "Latest updates", tasks: "Assigned tasks", saved: "Saved items" })[destination.value])
</script>

<template>
    <RScaffold
        class="scaffold-activity-demo"
        scroll-direction="vertical"
        fab-placement="viewport"
        bottom-bar-hide-on-scroll
    >
        <template #app-bar>
            <RAppBarContainer>
                <RTopAppBar>
                    <template #title>Activity</template>
                    <template #subtitle>{{ heading }}</template>
                    <template #actions>
                        <RIconButton :icon="RINotificationsOutlined" label="Notifications" />
                    </template>
                </RTopAppBar>
            </RAppBarContainer>
        </template>

        <div class="scaffold-activity-demo__content">
            <h3>{{ heading }}</h3>
            <RList divider="inset">
                <RListItem
                    v-for="activity in feed"
                    :key="activity.id"
                    :icon="activity.type === 'tasks' ? RIInboxOutlined : activity.type === 'saved' ? RIArchiveOutlined : RIHomeOutlined"
                    action
                    :lines="2"
                    @click="undefined"
                >
                    {{ activity.title }}
                    <template #supporting>{{ activity.detail }}</template>
                </RListItem>
            </RList>
        </div>

        <template #bottom-bar>
            <RBottomNavigation v-model="destination" aria-label="Activity destinations">
                <RBottomNavigationItem value="updates" :icon="RIHomeOutlined">Updates</RBottomNavigationItem>
                <RBottomNavigationItem value="tasks" :icon="RIInboxOutlined">Tasks</RBottomNavigationItem>
                <RBottomNavigationItem value="saved" :icon="RIArchiveOutlined">Saved</RBottomNavigationItem>
            </RBottomNavigation>
        </template>

        <template #fab>
            <RFab :icon="RIAddFilled" label="Add activity" />
        </template>
    </RScaffold>
</template>

<style scoped>
.scaffold-activity-demo {
    block-size: min(62vh, 520px);
    min-block-size: 400px;
    overflow: hidden;
}

.scaffold-activity-demo__content {
    padding-block: 12px 96px;
}

.scaffold-activity-demo__content h3 {
    margin: 0;
    padding: 12px 16px;
}

:global(.demo-preview:fullscreen .scaffold-activity-demo) {
    block-size: 100%;
    min-block-size: 0;
}
</style>
