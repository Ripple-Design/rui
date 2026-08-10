<script setup lang="ts">
import { RIHomeOutlined, RISettingsOutlined, RIStarOutlined } from "@ripple-design/icons"
import {
    RButton,
    RModalNavigationDrawer,
    RNavigationDrawer,
    RNavigationDrawerGroup,
    RNavigationDrawerItem,
    RScaffold,
} from "@ripple-design/rui"
import { ref } from "vue"

const selected = ref("home")
const modalOpen = ref(false)
const modalSelected = ref("home")
</script>

<template>
    <div class="navigation-drawer-demo">
        <RScaffold class="navigation-drawer-demo__scaffold">
            <template #navigation>
                <RNavigationDrawer v-model="selected" title="Mail" aria-label="Primary navigation">
                    <RNavigationDrawerGroup title="Destinations">
                        <RNavigationDrawerItem value="home" :icon="RIHomeOutlined">Inbox</RNavigationDrawerItem>
                        <RNavigationDrawerItem value="starred" :icon="RIStarOutlined">Starred</RNavigationDrawerItem>
                    </RNavigationDrawerGroup>
                    <RNavigationDrawerGroup>
                        <RNavigationDrawerItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationDrawerItem>
                    </RNavigationDrawerGroup>
                </RNavigationDrawer>
            </template>
            <div class="navigation-drawer-demo__body">
                <RButton @click="modalOpen = true">Open modal drawer</RButton>
            </div>
            <template #modal>
                <RModalNavigationDrawer v-model="modalOpen" v-model:selected="modalSelected" title="Mail" close-on-select aria-label="Modal navigation">
                    <RNavigationDrawerGroup title="Destinations">
                        <RNavigationDrawerItem value="home" :icon="RIHomeOutlined">Inbox</RNavigationDrawerItem>
                        <RNavigationDrawerItem value="starred" :icon="RIStarOutlined">Starred</RNavigationDrawerItem>
                    </RNavigationDrawerGroup>
                    <RNavigationDrawerGroup>
                        <RNavigationDrawerItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationDrawerItem>
                    </RNavigationDrawerGroup>
                </RModalNavigationDrawer>
            </template>
        </RScaffold>
    </div>
</template>

<style scoped lang="scss">
.navigation-drawer-demo {
    inline-size: 100%;
    flex: none;
    block-size: 560px;
    overflow: hidden;
    border: 1px solid var(--rui-sys-color-on-surface-outline);
}

.navigation-drawer-demo__scaffold {
    block-size: 100%;
}

.navigation-drawer-demo__header,
.navigation-drawer-demo__body {
    padding: 24px;
}

.navigation-drawer-demo__header {
    font: var(--rui-sys-typo-subtitle2-size) / var(--rui-sys-typo-subtitle2-line-height) var(--rui-sys-typo-subtitle2-font-family);
    font-weight: var(--rui-sys-typo-subtitle2-weight);
}

.navigation-drawer-demo__body {
    display: grid;
    place-items: center;
    block-size: 100%;
}
</style>
