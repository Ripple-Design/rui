<script setup lang="ts">
import { RColumn, RGrid, RText } from "@ripple-design/rui"

const levels = [1, 2, 4, 8, 16, 24] as const
</script>

<template>
    <RColumn gap="20px" class="elevation-demo">
        <RText variant="body2" class="elevation-demo__intro">
            Elevation levels use the shared three-layer shadow model and a 100ms default transition token.
        </RText>

        <RGrid class="elevation-demo__grid" cols="repeat(auto-fit, minmax(120px, 1fr))" gap="20px">
            <div v-for="level in levels" :key="level" class="elevation-demo__tile" :class="`elevation-demo__tile--${level}`">
                <RText variant="overline">Level</RText>
                <RText variant="headline6">{{ level }}</RText>
            </div>
        </RGrid>
    </RColumn>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/rui" as rui;

.elevation-demo {
    width: 100%;

    &__intro {
        color: var(--rui-sys-color-on-surface-medium);
    }

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
        border-radius: 12px;
        background: var(--rui-sys-color-surface);
        color: var(--rui-sys-color-on-surface-high);

        &--1 {
            @include rui.elevation-level(1);
        }

        &--2 {
            @include rui.elevation-level(2);
        }

        &--4 {
            @include rui.elevation-level(4);
        }

        &--8 {
            @include rui.elevation-level(8);
        }

        &--16 {
            @include rui.elevation-level(16);
        }

        &--24 {
            @include rui.elevation-level(24);
        }
    }
}
</style>
