<script setup lang="ts">
import { RIMoreVertFilled } from "@ripple-design/icons"
import { RTile } from "@ripple-design/rui"
</script>

<template>
    <ul class="tile-demo">
        <RTile mode="scrim" position="header">
            <template #title>Driftwood shore</template>
            <template #text>Translucent header scrim</template>
            <img alt="" src="/images/docs/components/tile/coast.svg" />
        </RTile>
        <RTile
            mode="scrim"
            position="footer"
            :action-icon="RIMoreVertFilled"
            action-label="More options"
            @action-click="() => undefined"
        >
            <template #title>Evening tide</template>
            <template #text>Translucent footer scrim</template>
            <img alt="" src="/images/docs/components/tile/coast.svg" />
        </RTile>
        <RTile mode="scrim">
            <template #title>Single-line title</template>
            <img alt="" src="/images/docs/components/tile/coast.svg" />
        </RTile>
        <RTile mode="scrim" @click="() => undefined">
            <img alt="" src="/images/docs/components/tile/coast.svg" />
        </RTile>
    </ul>
</template>

<style scoped>
.tile-demo {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    inline-size: min(100%, 640px);
    margin: 0;
    padding: 0;
    gap: 16px;
}

.tile-demo img {
    aspect-ratio: 4 / 3;
    object-fit: cover;
}
</style>
