<script setup lang="ts">
import {
    RIFavoriteBorderFilled,
    RIFavoriteFilled,
    RIHomeOutlined,
    RIPlayCircleOutlined,
    RISettingsOutlined,
} from "@ripple-design/icons"
import { RColumn, RNavigationRail, RNavigationRailItem, RRow, RText } from "@ripple-design/rui"
import { ref } from "vue"

const active = ref("home")
const compact = ref("listen")
const selectedOnly = ref("settings")
</script>

<template>
    <div class="navigation-rail-demo">
        <RRow gap="24px">
            <RNavigationRail v-model="active" aria-label="Primary navigation rail">
                <template #top>
                    <RText variant="button">App</RText>
                </template>

                <RNavigationRailItem value="home" :icon="RIHomeOutlined">Home</RNavigationRailItem>
                <RNavigationRailItem value="listen" :icon="RIPlayCircleOutlined">Listen</RNavigationRailItem>
                <RNavigationRailItem value="favorites" :icon="RIFavoriteBorderFilled" :selected-icon="RIFavoriteFilled"
                    >Favorites</RNavigationRailItem
                >
                <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
            </RNavigationRail>

            <RNavigationRail
                v-model="selectedOnly"
                label-visibility="selected"
                aria-label="Selected label navigation rail"
            >
                <RNavigationRailItem value="home" :icon="RIHomeOutlined">Home</RNavigationRailItem>
                <RNavigationRailItem value="listen" :icon="RIPlayCircleOutlined">Listen</RNavigationRailItem>
                <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
            </RNavigationRail>

            <RNavigationRail v-model="compact" compact aria-label="Compact navigation rail">
                <RNavigationRailItem value="home" :icon="RIHomeOutlined">Home</RNavigationRailItem>
                <RNavigationRailItem value="listen" :icon="RIPlayCircleOutlined">Listen</RNavigationRailItem>
                <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
            </RNavigationRail>
        </RRow>
    </div>
</template>

<style scoped lang="scss">
.navigation-rail-demo {
    display: inline-flex;
}
</style>
