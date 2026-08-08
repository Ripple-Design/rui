<script setup lang="ts">
import { RIcon, RList, RListGroup, RListItem } from "@ripple-design/rui"
import { RIArchiveOutlined, RIEditOutlined, RIInboxOutlined } from "@ripple-design/icons"
</script>

<template>
    <RList class="list-group-demo" divider="inset">
        <RListGroup label="Mailbox">
            <RListItem :icon="RIInboxOutlined" action @click="undefined">Inbox</RListItem>
            <RListItem :icon="RIArchiveOutlined" action @click="undefined">Archive</RListItem>
        </RListGroup>
        <RListGroup divider>
            <template #header>
                <span>Drafts <small>(custom header)</small></span>
            </template>
            <RListItem action @click="undefined">
                Team planning
                <template #supporting>Three collaborators have updated this draft.</template>
                <template #trailing><RIcon :icon="RIEditOutlined" :size="20" decorative /></template>
            </RListItem>
            <RListItem action @click="undefined">Release checklist</RListItem>
        </RListGroup>
    </RList>
</template>

<style scoped>
.list-group-demo {
    inline-size: min(100%, 420px);
    border: 1px solid var(--rui-sys-color-on-surface-outline);
}

small {
    color: var(--rui-sys-color-on-surface-medium);
}
</style>
