<script setup lang="ts">
import { RIInfoFilled, RIMoreVertFilled } from "@ripple-design/icons"
import { RButton, RColumn, RIconButton, RPlainTooltip, RRow } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="20px" class="plain-tooltip-demo">
        <RRow gap="16px" wrap align="center">
            <RPlainTooltip text="Show additional information">
                <RIconButton :icon="RIInfoFilled" label="More info" />
            </RPlainTooltip>

            <RPlainTooltip text="Open more actions">
                <RIconButton :icon="RIMoreVertFilled" label="More actions" />
            </RPlainTooltip>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RPlainTooltip text="Create a new item">
                <RButton variant="outlined">Add item</RButton>
            </RPlainTooltip>

            <RPlainTooltip text="Disabled tooltips stay inactive" disabled>
                <RButton variant="outlined">Disabled tooltip</RButton>
            </RPlainTooltip>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.plain-tooltip-demo {
    width: 100%;
}
</style>
