<script setup lang="ts">
import { RI1kPlusOutlined, RIAccountBalanceFilled } from "@ripple-design/icons"
import { RButton, RColumn, RIcon, RRow } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="20px" class="button-demo">
        <RRow gap="16px" wrap align="center">
            <RButton>Text button</RButton>
            <RButton variant="outlined">Outlined button</RButton>
            <RButton variant="contained">Contained button</RButton>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButton variant="contained">
                <template #leading>
                    <RIcon :icon="RIAccountBalanceFilled" decorative />
                </template>
                Leading icon
            </RButton>

            <RButton variant="text">
                Trailing icon
                <template #trailing>
                    <RIcon :icon="RI1kPlusOutlined" decorative />
                </template>
            </RButton>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButton disabled>Disabled button</RButton>
            <RButton href="https://example.com" target="_blank" rel="noreferrer" variant="outlined"
                >Link button</RButton
            >
            <RButton :ripple="{ contrast: 'high' }" variant="contained">High contrast ripple</RButton>
        </RRow>

        <RButton full-width variant="contained">
            <template #leading>
                <RIcon :icon="RIAccountBalanceFilled" decorative />
            </template>
            Full width button
        </RButton>
    </RColumn>
</template>

<style scoped lang="scss">
.button-demo {
    width: 100%;
}
</style>
