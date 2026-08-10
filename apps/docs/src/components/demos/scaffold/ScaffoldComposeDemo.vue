<script setup lang="ts">
import { RIAddFilled, RIEmailOutlined, RIMoreVertFilled, RISearchOutlined } from "@ripple-design/icons"
import {
    RAppBarContainer,
    RButton,
    RDialog,
    RFab,
    RIconButton,
    RList,
    RListItem,
    RScaffold,
    RTopAppBar,
} from "@ripple-design/rui"
import { ref } from "vue"

const composeOpen = ref(false)

const messages = [
    { sender: "Product team", subject: "Design review notes", time: "9:42" },
    { sender: "Avery Chen", subject: "Prototype feedback", time: "8:18" },
    { sender: "Research", subject: "Interview highlights", time: "Yesterday" },
    { sender: "Morgan Lee", subject: "Sprint planning", time: "Yesterday" },
    { sender: "Customer success", subject: "Launch readiness", time: "Thu" },
    { sender: "Jordan Kim", subject: "Token naming proposal", time: "Wed" },
]
</script>

<template>
    <RScaffold class="scaffold-compose-demo" scroll-direction="vertical" fab-placement="app-bar-seam">
        <template #app-bar>
            <RAppBarContainer>
                <RTopAppBar>
                    <template #title>Inbox</template>
                    <template #subtitle>6 unread messages</template>
                    <template #actions>
                        <RIconButton :icon="RISearchOutlined" label="Search messages" />
                        <RIconButton :icon="RIMoreVertFilled" label="More inbox options" />
                    </template>
                </RTopAppBar>
            </RAppBarContainer>
        </template>

        <div class="scaffold-compose-demo__content">
            <RList divider="inset">
                <RListItem v-for="message in messages" :key="message.subject" :icon="RIEmailOutlined" action :lines="2" @click="undefined">
                    {{ message.sender }} · {{ message.subject }}
                    <template #supporting>{{ message.time }}</template>
                </RListItem>
            </RList>
        </div>

        <template #fab>
            <RFab variant="extended" :icon="RIAddFilled" label="Compose message" @click="composeOpen = true">
                Compose
            </RFab>
        </template>

        <template #modal>
            <RDialog v-model="composeOpen" title="New message">
                <p>Start a conversation with your project team.</p>
                <template #actions="{ close }">
                    <RButton variant="text" @click="close('cancel')">Cancel</RButton>
                    <RButton variant="text" @click="close('confirm')">Save draft</RButton>
                </template>
            </RDialog>
        </template>
    </RScaffold>
</template>

<style scoped>
.scaffold-compose-demo {
    block-size: min(62vh, 480px);
    min-block-size: 360px;
    overflow: hidden;
}

.scaffold-compose-demo__content {
    padding-block: 32px 16px;
}

.scaffold-compose-demo p {
    margin: 0;
}

:global(.demo-preview:fullscreen .scaffold-compose-demo) {
    block-size: 100%;
    min-block-size: 0;
}
</style>
