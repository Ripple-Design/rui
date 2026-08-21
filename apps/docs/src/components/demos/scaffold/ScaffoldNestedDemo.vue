<script setup lang="ts">
import {
    RIArchiveOutlined,
    RIHomeOutlined,
    RIInboxOutlined,
    RIMoreVertFilled,
    RINotificationsOutlined,
    RISettingsOutlined,
} from "@ripple-design/icons"
import {
    RIconButton,
    RList,
    RListItem,
    RNavigationRail,
    RNavigationRailItem,
    RScaffold,
    RTopAppBar,
    vColumnSpan,
} from "@ripple-design/rui"
import { ref } from "vue"

const primaryDestination = ref("inbox")

const messages = [
    { sender: "Product team", subject: "Design review notes", detail: "Three new comments" },
    { sender: "Avery Chen", subject: "Prototype feedback", detail: "Updated 18 minutes ago" },
    { sender: "Research", subject: "Interview highlights", detail: "Updated yesterday" },
    { sender: "Customer success", subject: "Launch readiness", detail: "Updated Thursday" },
    { sender: "Jordan Kim", subject: "Token naming proposal", detail: "Updated Wednesday" },
]
</script>

<template>
    <RScaffold class="scaffold-nested-demo" scroll-direction="none" :app-bar="{}">
        <template #navigation>
            <RNavigationRail v-model="primaryDestination" class="scaffold-nested-demo__navigation-rail" aria-label="Application navigation">
                <template #top>Mail</template>
                <RNavigationRailItem value="inbox" :icon="RIInboxOutlined">Inbox</RNavigationRailItem>
                <RNavigationRailItem value="archive" :icon="RIArchiveOutlined">Archive</RNavigationRailItem>
                <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
            </RNavigationRail>
        </template>

        <template #app-bar>
                <RTopAppBar>
                    <template #title>Mail workspace</template>
                    <template #actions>
                        <RIconButton :icon="RINotificationsOutlined" label="Notifications" />
                        <RIconButton :icon="RIMoreVertFilled" label="More workspace options" />
                    </template>
                </RTopAppBar>
        </template>

        <RScaffold
            v-column-span="{ xs: 4, sm: 8, md: 12 }"
            class="scaffold-nested-demo__inner" scroll-direction="vertical" bottom-bar-hide-on-scroll :app-bar="{ color: 'primary' }">
            <template #app-bar>
                    <RTopAppBar>
                        <template #title>Inbox triage</template>
                        <template #subtitle>5 conversations</template>
                        <template #actions>
                            <RIconButton :icon="RIHomeOutlined" label="Open inbox home" />
                        </template>
                    </RTopAppBar>
                </template>

            <div v-column-span="{ xs: 4, sm: 8, md: 12 }" class="scaffold-nested-demo__inner-content">
                <section class="scaffold-nested-demo__summary">
                    <strong>Today’s queue</strong>
                    <span>2 items need a reply before 3:00 PM</span>
                </section>

                <RList divider="inset">
                    <RListItem v-for="message in messages" :key="message.subject" :icon="RIInboxOutlined" action :lines="2">
                        {{ message.sender }} · {{ message.subject }}
                        <template #supporting>{{ message.detail }}</template>
                    </RListItem>
                </RList>
            </div>
        </RScaffold>
    </RScaffold>
</template>

<style scoped>
.scaffold-nested-demo {
    block-size: min(72vh, 660px);
    min-block-size: 520px;
    overflow: hidden;
}

.scaffold-nested-demo__navigation-rail {
    block-size: 100%;
}

.scaffold-nested-demo__inner-content {
    padding-block-end: 24px;
}

.scaffold-nested-demo__summary {
    display: grid;
    gap: 4px;
    margin: 16px;
}

.scaffold-nested-demo__summary span {
    color: var(--rui-sys-color-on-surface-medium);
}

:global(.demo-preview:fullscreen .scaffold-nested-demo) {
    block-size: 100%;
    min-block-size: 0;
}
</style>
