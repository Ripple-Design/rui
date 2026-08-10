<script setup lang="ts">
import {
    RIArchiveFilled,
    RIArchiveOutlined,
    RIFavoriteBorderFilled,
    RIFavoriteFilled,
    RIHomeFilled,
    RIHomeOutlined,
    RIInboxOutlined,
    RISettingsOutlined,
} from "@ripple-design/icons"
import { RBottomNavigation, RBottomNavigationItem, RDivider, RStack } from "@ripple-design/rui"
import { ref } from "vue"

const surfaceDestination = ref("home")
const primaryDestination = ref("home")
const threeDestinations = ref("home")
const fourDestinations = ref("home")
const labeledDestination = ref("home")
const selectedDestination = ref("home")
const unlabeledDestination = ref("home")
const translatedDestination = ref("home")
</script>

<template>
    <RStack gap="24px" style="inline-size: 100%; min-inline-size: 0;">
        <RBottomNavigation v-model="surfaceDestination" color="surface" aria-label="Surface bottom navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined" :selected-icon="RIHomeFilled">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined" :selected-icon="RIArchiveFilled">Archive</RBottomNavigationItem>
        </RBottomNavigation>

        <RBottomNavigation v-model="primaryDestination" color="primary" aria-label="Primary bottom navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined" :selected-icon="RIHomeFilled">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined" :selected-icon="RIArchiveFilled">Archive</RBottomNavigationItem>
        </RBottomNavigation>

        <RDivider />

        <RBottomNavigation v-model="fourDestinations" aria-label="Four destination navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined" :selected-icon="RIHomeFilled">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined">Archive</RBottomNavigationItem>
            <RBottomNavigationItem value="favorites" :icon="RIFavoriteBorderFilled" :selected-icon="RIFavoriteFilled">Favorites</RBottomNavigationItem>
        </RBottomNavigation>

        <RDivider />

        <RBottomNavigation v-model="labeledDestination" label-visibility="labeled" aria-label="Labeled navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined">Archive</RBottomNavigationItem>
            <RBottomNavigationItem value="favorites" :icon="RIFavoriteBorderFilled">Favorites</RBottomNavigationItem>
        </RBottomNavigation>

        <RDivider />

        <RBottomNavigation v-model="selectedDestination" label-visibility="selected" aria-label="Selected label navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined">Archive</RBottomNavigationItem>
            <RBottomNavigationItem value="settings" :icon="RISettingsOutlined" disabled>Settings</RBottomNavigationItem>
        </RBottomNavigation>

        <RDivider />

        <RBottomNavigation v-model="unlabeledDestination" label-visibility="unlabeled" aria-label="Unlabeled navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined">Archive</RBottomNavigationItem>
            <RBottomNavigationItem value="favorites" :icon="RIFavoriteBorderFilled">Favorites</RBottomNavigationItem>
        </RBottomNavigation>

        <RDivider />

        <RBottomNavigation v-model="translatedDestination" horizontal-translation aria-label="Translated navigation">
            <RBottomNavigationItem value="home" :icon="RIHomeOutlined">Home</RBottomNavigationItem>
            <RBottomNavigationItem value="inbox" :icon="RIInboxOutlined">Inbox</RBottomNavigationItem>
            <RBottomNavigationItem value="archive" :icon="RIArchiveOutlined">Archive</RBottomNavigationItem>
            <RBottomNavigationItem value="favorites" :icon="RIFavoriteBorderFilled">Favorites</RBottomNavigationItem>
        </RBottomNavigation>
    </RStack>
</template>
