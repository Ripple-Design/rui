<script setup lang="ts">
import { RChip, RRow } from "@ripple-design/rui"
</script>

<template>
    <RRow gap="8px" wrap align="center">
        <RChip type="choice" href="/en/components/chip/spec">Spec</RChip>
        <RChip type="choice" href="/en/components/chip/guidelines">Guidelines</RChip>
        <RChip type="choice" href="/en/components/chip/implementation" :model-value="true">
            Implementation
        </RChip>
    </RRow>
</template>
