<script setup lang="ts">
import { ref, useAttrs, watch } from "vue"

import type { RImageProps } from "./types.ts"

defineOptions({ inheritAttrs: false })

const props = defineProps<RImageProps>()
const attrs = useAttrs()
const isLoading = ref(true)
const isLoaded = ref(false)

watch(
    () => [props.src, attrs.srcset],
    () => {
        isLoading.value = true
        isLoaded.value = false
    },
)

function handleLoad() {
    isLoading.value = false
    isLoaded.value = true
}

function handleError() {
    isLoading.value = false
    isLoaded.value = false
}
</script>

<template>
    <img
        v-bind="attrs"
        :src="props.src"
        :alt="props.alt"
        :class="{ 'rui-image--loading': isLoading, 'rui-image--loaded': isLoaded }"
        :style="[attrs.style, props.aspectRatio !== undefined ? { aspectRatio: props.aspectRatio } : undefined]"
        @load="handleLoad"
        @error="handleError"
    />
</template>

<style scoped lang="scss">
@use "@/styles/motion";

.rui-image--loading {
    background-color: #bdbdbd;
    background-image: linear-gradient(90deg, #bdbdbd 0%, #d9d9d9 50%, #bdbdbd 100%);
    background-size: 200% 100%;
    animation: rui-image-shimmer 1500ms ease-in-out infinite;
}

.rui-image--loaded {
    animation:
        rui-image-opacity-in 1s motion.$easing-standard both,
        rui-image-saturation-in 2s motion.$easing-standard both;
}

@media (prefers-reduced-motion: reduce) {
    .rui-image--loading,
    .rui-image--loaded {
        animation: none;
    }
}

@keyframes rui-image-shimmer {
    from {
        background-position: 200% 0;
    }

    to {
        background-position: -200% 0;
    }
}

@keyframes rui-image-opacity-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes rui-image-saturation-in {
    from {
        filter: saturate(20%);
    }

    to {
        filter: saturate(100%);
    }
}
</style>
