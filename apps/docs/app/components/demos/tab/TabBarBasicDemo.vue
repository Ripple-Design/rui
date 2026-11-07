<script setup lang="ts">
import { RColumn, RTab, RTabBar, RText } from "@ripple-design/rui"
import { ref } from "vue"

const primary = ref("overview")
const secondary = ref("home")
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

        <RColumn gap="12px">
            <RTabBar v-model="secondary" variant="secondary" aria-label="Secondary tabs">
                <RTab value="home">Home</RTab>
                <RTab value="explore">Explore</RTab>
                <RTab value="library">Library</RTab>
            </RTabBar>
            <RText>Secondary: {{ secondary }}</RText>
        </RColumn>
    </RColumn>
</template>

<style scoped lang="scss">
.tab-bar-demo {
    width: 100%;
}
</style>
