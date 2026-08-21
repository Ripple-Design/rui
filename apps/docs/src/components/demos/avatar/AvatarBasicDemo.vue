<script setup lang="ts">
import { RAvatar } from "@ripple-design/rui"
</script>

<template>
    <div class="avatar-demo">
        <RAvatar src="/images/docs/components/tile/coast.svg" alt="Abstract coastal landscape" />
        <RAvatar alt="Ada Lovelace">AL</RAvatar>
        <RAvatar :size="56" alt="Grace Hopper">GH</RAvatar>
    </div>
</template>

<style scoped>
.avatar-demo {
    display: flex;
    align-items: center;
    gap: 16px;
}
</style>
