<script setup lang="ts">
import { RIHomeOutlined, RIPlayCircleOutlined, RISettingsOutlined } from "@ripple-design/icons"
import { RColumn, RTab, RTabBar, RText } from "@ripple-design/rui"
import { ref } from "vue"

const vertical = ref("listen")
const horizontal = ref("listen")
</script>

<template>
    <RColumn gap="20px" class="tab-bar-icon-layout-demo">
        <RColumn gap="12px">
            <RTabBar v-model="vertical" variant="secondary" full-width aria-label="Vertical icon tabs">
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
                aria-label="Horizontal icon tabs"
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
.tab-bar-icon-layout-demo {
    width: 100%;
}
</style>
