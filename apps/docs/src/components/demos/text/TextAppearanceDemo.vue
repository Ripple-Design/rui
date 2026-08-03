<script setup lang="ts">
import { RColumn, RRow, RText } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="16px" class="text-appearance-demo">
        <RColumn gap="8px">
            <RText variant="subtitle1">Emphasis</RText>
            <RText emphasis="high">High emphasis</RText>
            <RText emphasis="medium">Medium emphasis</RText>
            <RText emphasis="low">Low emphasis</RText>
            <RText emphasis="high" disabled>Disabled text always uses low emphasis</RText>
        </RColumn>

        <RColumn gap="8px">
            <RText variant="subtitle1">Semantic colors</RText>
            <RRow gap="16px" wrap>
                <RText color="primary">Primary</RText>
                <RText color="secondary">Secondary</RText>
                <RText color="onsurface">On surface</RText>
            </RRow>
        </RColumn>
    </RColumn>
</template>

<style scoped lang="scss">
.text-appearance-demo {
    width: 100%;
}
</style>
