<script setup lang="ts">
import { RColumn, RSurface, RText } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="16px" class="text-surface-demo">
        <RSurface>
            <RColumn gap="8px" class="text-surface-demo__content">
                <RText>Inherited surface content color</RText>
                <RText emphasis="medium">Inherited medium emphasis</RText>
            </RColumn>
        </RSurface>

        <RSurface color="primary">
            <RColumn gap="8px" class="text-surface-demo__content">
                <RText>Inherited primary-surface content color</RText>
                <RText emphasis="medium">Inherited primary-surface medium emphasis</RText>
            </RColumn>
        </RSurface>

        <RSurface color="secondary">
            <RColumn gap="8px" class="text-surface-demo__content">
                <RText>Inherited secondary-surface content color</RText>
                <RText emphasis="low">Inherited secondary-surface low emphasis</RText>
            </RColumn>
        </RSurface>
    </RColumn>
</template>

<style scoped lang="scss">
.text-surface-demo {
    width: 100%;
}

.text-surface-demo__content {
    padding: 16px;
}
</style>
