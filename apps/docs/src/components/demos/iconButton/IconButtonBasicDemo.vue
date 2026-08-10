<script setup lang="ts">
import {
    RICloseFilled,
    RIFavoriteBorderFilled,
    RIFavoriteFilled,
    RIMoreVertFilled,
    RIOpenInNewFilled,
} from "@ripple-design/icons"
import { RColumn, RIconButton, RRow, RSurface } from "@ripple-design/rui"
import { ref } from "vue"

const favorite = ref(false)
</script>

<template>
    <RColumn gap="20px" class="icon-button-demo">
        <RRow gap="16px" wrap align="center">
            <RIconButton :icon="RICloseFilled" label="Close" />
            <RIconButton :icon="RIMoreVertFilled" label="More actions" />
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RSurface color="primary" class="icon-button-demo__surface">
                <RRow gap="8px" align="center">
                    <RIconButton :icon="RICloseFilled" label="High emphasis" emphasis="high" />
                    <RIconButton :icon="RIMoreVertFilled" label="Medium emphasis" />
                    <RIconButton :icon="RIOpenInNewFilled" label="Low emphasis" emphasis="low" />
                </RRow>
            </RSurface>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RIconButton
                v-model="favorite"
                :icon="RIFavoriteBorderFilled"
                :active-icon="RIFavoriteFilled"
                label="Add to favorites"
                active-label="Remove from favorites"
            />
            <RIconButton :icon="RICloseFilled" label="Disabled close action" disabled />
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RIconButton
                :icon="RIOpenInNewFilled"
                label="Open example.com in a new tab"
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
            />
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.icon-button-demo {
    width: 100%;
}

.icon-button-demo__surface {
    padding: 4px;
}
</style>
