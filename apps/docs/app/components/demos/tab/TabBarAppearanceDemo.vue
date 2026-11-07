<script setup lang="ts">
import { RColumn, RSurface, RTab, RTabBar, RText } from "@ripple-design/rui"
import { ref } from "vue"

const borderless = ref("library")
const onPrimary = ref("listen")
const onSecondary = ref("listen")
</script>

<template>
    <RColumn gap="20px" class="tab-bar-appearance-demo">
        <RColumn gap="12px">
            <RTabBar v-model="borderless" variant="secondary" :divider="false" aria-label="Borderless tabs">
                <RTab value="home">Home</RTab>
                <RTab value="explore">Explore</RTab>
                <RTab value="library">Library</RTab>
            </RTabBar>
            <RText>No divider: {{ borderless }}</RText>
        </RColumn>

        <RSurface class="tab-bar-appearance-demo__surface tab-bar-appearance-demo__surface--primary">
            <RColumn gap="12px">
                <RTabBar v-model="onPrimary" variant="secondary" color="on-primary" aria-label="On primary tabs">
                    <RTab value="listen">Listen</RTab>
                    <RTab value="browse">Browse</RTab>
                    <RTab value="settings">Settings</RTab>
                </RTabBar>
                <RText>On primary: {{ onPrimary }}</RText>
            </RColumn>
        </RSurface>

        <RSurface class="tab-bar-appearance-demo__surface tab-bar-appearance-demo__surface--secondary">
            <RColumn gap="12px">
                <RTabBar v-model="onSecondary" variant="secondary" color="on-secondary" aria-label="On secondary tabs">
                    <RTab value="listen">Listen</RTab>
                    <RTab value="browse">Browse</RTab>
                    <RTab value="settings">Settings</RTab>
                </RTabBar>
                <RText>On secondary: {{ onSecondary }}</RText>
            </RColumn>
        </RSurface>
    </RColumn>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/styles/index" as rui;

.tab-bar-appearance-demo {
    width: 100%;
}

.tab-bar-appearance-demo__surface {
    padding: 16px;
}

.tab-bar-appearance-demo__surface--primary {
    background: rui.$color-primary;
    color: rui.$color-on-primary;
}

.tab-bar-appearance-demo__surface--secondary {
    background: rui.$color-secondary;
    color: rui.$color-on-secondary;
}
</style>
