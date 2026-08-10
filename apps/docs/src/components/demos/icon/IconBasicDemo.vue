<script setup lang="ts">
import { RIAccountBalanceFilled } from "@ripple-design/icons"
import { RIcon, RRow, RSurface, RText } from "@ripple-design/rui"
</script>

<template>
    <RRow gap="16px" wrap align="center">
        <RIcon :icon="RIAccountBalanceFilled" />

        <RIcon :icon="RIAccountBalanceFilled" :size="16" />

        <RIcon :icon="RIAccountBalanceFilled" size="2rem" />

        <span>
            <RIcon :icon="RIAccountBalanceFilled" decorative />
            Decorative inline icon
        </span>

        <RIcon :icon="RIAccountBalanceFilled" label="Favorite" />

        <RSurface color="primary" class="icon-demo__surface">
            <RRow gap="16px" align="center">
                <RIcon :icon="RIAccountBalanceFilled" emphasis="high" decorative />
                <RIcon :icon="RIAccountBalanceFilled" decorative />
                <RIcon :icon="RIAccountBalanceFilled" emphasis="low" decorative />
            </RRow>
        </RSurface>

        <RIcon :size="20" decorative>
            <RText variant="button" as="span">★</RText>
        </RIcon>
    </RRow>
</template>

<style scoped>
.icon-demo__surface {
    padding: 8px;
}
</style>
