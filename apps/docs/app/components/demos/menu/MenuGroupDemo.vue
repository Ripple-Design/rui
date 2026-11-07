<script setup lang="ts">
import { RButton, RColumn, RMenu, RMenuGroup, RMenuItem } from "@ripple-design/rui"
import { ref } from "vue"

const selectedSort = ref("recent")
const selectedTheme = ref("system")
</script>

<template>
    <RColumn gap="16px" align="start">
        <RMenu>
            <template #trigger>
                <RButton variant="outlined">Sort by</RButton>
            </template>

            <RMenuGroup v-model="selectedSort" indicator="overlay">
                <RMenuItem value="recent">Most recent</RMenuItem>
                <RMenuItem value="popular">Most popular</RMenuItem>
                <RMenuItem value="name">Name</RMenuItem>
            </RMenuGroup>
        </RMenu>

        <RMenu>
            <template #trigger>
                <RButton variant="outlined">Preferences</RButton>
            </template>

            <RMenuGroup v-model="selectedTheme" indicator="check">
                <RMenuItem value="system">Follow system</RMenuItem>
                <RMenuItem value="light">Light</RMenuItem>
                <RMenuItem value="dark">Dark</RMenuItem>
            </RMenuGroup>
            <RMenuGroup>
                <RMenuItem>Manage themes</RMenuItem>
                <RMenuItem>Open settings</RMenuItem>
            </RMenuGroup>
        </RMenu>
    </RColumn>
</template>
