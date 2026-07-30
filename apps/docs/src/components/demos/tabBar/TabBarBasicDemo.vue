<script setup lang="ts">
import { RIHomeOutlined, RIPlayCircleOutlined, RISettingsOutlined } from "@ripple-design/icons"
import { RColumn, RTab, RTabBar, RText } from "@ripple-design/rui"
import { ref } from "vue"

const active = ref("home")
const primary = ref("overview")
const primaryOverflow = ref("recommendations")
const secondaryOverflow = ref("details")
const vertical = ref("listen")
const horizontal = ref("listen")
</script>

<template>
    <RColumn gap="20px" class="tab-bar-demo">
        <RColumn gap="12px">
            <RTabBar v-model="primary" variant="primary" aria-label="Primary tabs">
                <RTab value="overview">Overview</RTab>
                <RTab value="activity">Activity</RTab>
                <RTab value="settings">Settings</RTab>
            </RTabBar>
            <RText>Primary: {{ primary }}</RText>
        </RColumn>

        <RColumn gap="12px" class="tab-bar-demo__overflow">
            <RTabBar v-model="primaryOverflow" variant="primary" aria-label="Primary overflow tabs">
                <RTab value="overview">Overview</RTab>
                <RTab value="activity">Activity</RTab>
                <RTab value="recommendations">Recommendations</RTab>
                <RTab value="analytics">Analytics</RTab>
                <RTab value="integrations">Integrations</RTab>
                <RTab value="permissions">Permissions</RTab>
            </RTabBar>
            <RText>Primary overflow: {{ primaryOverflow }}</RText>
        </RColumn>

        <RColumn gap="12px">
            <RTabBar v-model="active" variant="secondary" aria-label="Library sections">
                <RTab value="home">Home</RTab>
                <RTab value="explore">Explore</RTab>
                <RTab value="library">Library</RTab>
                <RTab value="disabled" disabled>Disabled</RTab>
            </RTabBar>
            <RText>Secondary: {{ active }}</RText>
        </RColumn>

        <RColumn gap="12px" class="tab-bar-demo__overflow">
            <RTabBar v-model="secondaryOverflow" variant="secondary" aria-label="Secondary overflow tabs">
                <RTab value="summary">Summary</RTab>
                <RTab value="details">Details</RTab>
                <RTab value="timeline">Timeline</RTab>
                <RTab value="comments">Comments</RTab>
                <RTab value="attachments">Attachments</RTab>
                <RTab value="history">History</RTab>
            </RTabBar>
            <RText>Secondary overflow: {{ secondaryOverflow }}</RText>
        </RColumn>

        <RColumn gap="12px">
            <RTabBar v-model="vertical" variant="secondary" full-width aria-label="Media destinations">
                <RTab value="listen" :icon="RIPlayCircleOutlined">Listen</RTab>
                <RTab value="browse" :icon="RIHomeOutlined">Browse</RTab>
                <RTab value="settings" :icon="RISettingsOutlined">Settings</RTab>
            </RTabBar>
            <RText>Vertical: {{ vertical }}</RText>
        </RColumn>

        <RColumn gap="12px">
            <RTabBar
                v-model="horizontal"
                variant="secondary"
                full-width
                icon-layout="horizontal"
                aria-label="Media destinations horizontal"
            >
                <RTab value="listen" :icon="RIPlayCircleOutlined">Listen</RTab>
                <RTab value="browse" :icon="RIHomeOutlined">Browse</RTab>
                <RTab value="settings" :icon="RISettingsOutlined">Settings</RTab>
            </RTabBar>
            <RText>Horizontal: {{ horizontal }}</RText>
        </RColumn>
    </RColumn>
</template>

<style scoped lang="scss">
.tab-bar-demo {
    width: 100%;
}

.tab-bar-demo__overflow {
    max-width: 360px;
}
</style>
