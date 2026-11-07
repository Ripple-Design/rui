<script setup lang="ts">
import { RIcon, RList, RListItem } from "@ripple-design/rui"
import { RIEmailOutlined, RIFolderOutlined, RIInfoOutlined } from "@ripple-design/icons"
</script>

<template>
    <RList class="list-demo" divider="inset">
        <RListItem :icon="RIEmailOutlined">Inbox</RListItem>
        <RListItem :icon="RIFolderOutlined" action @click="undefined">
            Project files
            <template #supporting>Updated 12 minutes ago</template>
            <template #trailing>24</template>
        </RListItem>
        <RListItem :icon="RIInfoOutlined" lines="3">
            Design system migration notes with a deliberately long title
            <template #supporting>Review the components that changed in the latest release.</template>
            <template #tertiary>Last edited yesterday</template>
            <template #trailing><RIcon :icon="RIInfoOutlined" :size="20" decorative /></template>
        </RListItem>
    </RList>
</template>

<style scoped>
.list-demo {
    inline-size: min(100%, 420px);
    border: 1px solid var(--rui-sys-color-on-surface-outline);
}
</style>
