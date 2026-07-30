<script setup lang="ts">
import { RColumn, RTab, RTabBar, RText } from "@ripple-design/rui"
import { ref } from "vue"

const primaryOverflow = ref("recommendations")
const secondaryOverflow = ref("details")
</script>

<template>
    <RColumn gap="20px" class="tab-bar-overflow-demo">
        <RColumn gap="12px" class="tab-bar-overflow-demo__narrow">
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

        <RColumn gap="12px" class="tab-bar-overflow-demo__narrow">
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
    </RColumn>
</template>

<style scoped lang="scss">
.tab-bar-overflow-demo {
    width: 100%;
}

.tab-bar-overflow-demo__narrow {
    max-width: 360px;
}
</style>
