<script setup lang="ts">
import { RImage } from "@ripple-design/rui"
</script>

<template>
    <RImage
        class="image-demo"
        src="/images/docs/components/tile/coast.svg"
        alt="Abstract coastal landscape"
        aspect-ratio="4 / 3"
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
    />
</template>

<style scoped>
.image-demo {
    display: block;
    inline-size: min(100%, 480px);
    block-size: auto;
}
</style>
