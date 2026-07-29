<script setup lang="ts">
import { RIInfoFilled, RIMoreVertFilled } from "@ripple-design/icons"
import { RButton, RColumn, RIconButton, RRow, vTooltip } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="20px" class="plain-tooltip-demo">
        <RRow gap="16px" wrap align="center">
            <RIconButton v-tooltip="'Show additional information'" :icon="RIInfoFilled" label="More info" />
            <RIconButton v-tooltip="'Open more actions'" :icon="RIMoreVertFilled" label="More actions" />
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButton v-tooltip="'Create a new item'" variant="outlined">Add item</RButton>
            <RButton v-tooltip="{ text: 'Disabled tooltips stay inactive', disabled: true }" variant="outlined">Disabled tooltip</RButton>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.plain-tooltip-demo {
    width: 100%;
}
</style>
