<script setup lang="ts">
import { RButton, RColumn, RList, RListItem, RText } from "@ripple-design/rui"
import { RIAddOutlined, RIKeyboardOutlined, RILinkOutlined } from "@ripple-design/icons"

function announce(message: string) {
    window.alert(message)
}
</script>

<template>
    <RColumn gap="16px" align="start">
        <RList class="list-state-demo" divider="full-bleed">
            <RListItem :icon="RIAddOutlined" action @click="announce('Item action')">Pointer, touch, and keyboard ripple</RListItem>
            <RListItem :icon="RIKeyboardOutlined" action :ripple="false">Action without ripple</RListItem>
            <RListItem :icon="RILinkOutlined" href="https://material.io" target="_blank" rel="noreferrer">
                Native link action
            </RListItem>
            <RListItem :icon="RIAddOutlined" action disabled>Disabled action</RListItem>
            <RListItem :icon="RILinkOutlined" href="https://material.io" disabled>Disabled link</RListItem>
        </RList>
        <RText variant="body2">Tab to an action and press Enter or Space to inspect native keyboard activation and the bounded state layer.</RText>
        <RButton variant="text" @click="announce('Standalone action')">Verify focus returns here</RButton>
    </RColumn>
</template>

<style scoped>
.list-state-demo {
    inline-size: min(100%, 420px);
    border: 1px solid var(--rui-sys-color-on-surface-outline);
}
</style>
