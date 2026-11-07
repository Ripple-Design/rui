<script setup lang="ts">
import { RGrid, RSurface, RText } from "@ripple-design/rui"

const levels = [1, 2, 4, 8, 16, 24] as const
</script>

<template>
    <RGrid class="elevation-demo__grid" columns="repeat(auto-fit, minmax(120px, 1fr))" gap="20px">
        <RSurface v-for="level in levels" :key="level" class="elevation-demo__tile" :elevation="level">
            <RText variant="overline">Level</RText>
            <RText variant="headline6">{{ level }}</RText>
        </RSurface>
    </RGrid>
</template>

<style scoped lang="scss">
.elevation-demo {
    width: 100%;

    &__grid {
        width: 100%;
    }

    &__tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 120px;
        padding: 16px;
    }
}
</style>
