<script setup lang="ts">
import { RTile } from "@ripple-design/rui"
</script>

<template>
    <ul class="tile-demo">
        <RTile position="header">
            <template #title>Morning coast</template>
            <template #text>Header outside the image</template>
            <img alt="" src="/images/docs/components/tile/coast.svg" />
        </RTile>
        <RTile position="footer">
            <template #title>Quiet valley</template>
            <template #text>Footer outside the image</template>
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
