<script setup lang="ts">
import { RI1kPlusOutlined, RIAccountBalanceFilled } from "@ripple-design/icons"
import { RButton, RColumn, RRow } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="20px" class="button-demo">
        <RRow gap="16px" wrap align="center">
            <RButton variant="text">Text</RButton>
            <RButton variant="outlined">Outlined</RButton>
            <RButton variant="unelevated">Unelevated</RButton>
            <RButton variant="contained">Contained</RButton>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButton variant="contained" :icon="RIAccountBalanceFilled">Leading icon</RButton>
            <RButton variant="text" :end-icon="RI1kPlusOutlined">Trailing icon</RButton>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButton disabled>Disabled</RButton>
            <RButton href="https://example.com" target="_blank" rel="noreferrer" variant="outlined">Link</RButton>
        </RRow>

        <RButton full-width variant="contained" :icon="RIAccountBalanceFilled">Full-width</RButton>
    </RColumn>
</template>

<style scoped lang="scss">
.button-demo {
    width: 100%;
}
</style>
