<script setup lang="ts">
import { RCard, RGrid } from "@ripple-design/rui"
</script>

<template>
    <RGrid columns="repeat(auto-fit, minmax(12rem, 1fr))" column-gap="24px" row-gap="12px">
        <RCard>Auto-fit cards</RCard>
        <RCard>Cards wrap as space changes</RCard>
        <RCard>Minimum width stays readable</RCard>
        <RCard>Gaps can be controlled independently</RCard>
    </RGrid>
</template>
