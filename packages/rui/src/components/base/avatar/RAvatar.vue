<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue"

import type { RAvatarProps } from "./types.ts"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RAvatarProps>(), {
    size: 40,
})
const emit = defineEmits<{
    load: [event: Event]
    error: [event: Event]
}>()
const attrs = useAttrs()
const isImageFailed = ref(false)
const imageAttributeNames = new Set([
    "srcset",
    "sizes",
    "loading",
    "decoding",
    "width",
    "height",
    "crossorigin",
    "referrerpolicy",
    "fetchpriority",
    "usemap",
    "ismap",
])

const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([name]) => !imageAttributeNames.has(name))),
)
const imageAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([name]) => imageAttributeNames.has(name))),
)
const hasImage = computed(() => !!props.src && !isImageFailed.value)
const style = computed(() => ({
    "--rui-comp-avatar-size": typeof props.size === "number" ? `${props.size}px` : props.size,
}))

watch(
    () => [props.src, attrs.srcset],
    () => {
        isImageFailed.value = false
    },
)

function handleLoad(event: Event) {
    emit("load", event)
}

function handleError(event: Event) {
    isImageFailed.value = true
    emit("error", event)
}
</script>

<template>
    <span
        v-bind="rootAttrs"
        class="rui-avatar"
        :class="{ 'rui-avatar--fallback': !hasImage }"
        :style="[attrs.style, style]"
        :role="!hasImage && props.alt ? 'img' : undefined"
        :aria-label="!hasImage && props.alt ? props.alt : undefined"
        :aria-hidden="!hasImage && !props.alt ? 'true' : undefined"
    >
        <img
            v-if="hasImage"
            v-bind="imageAttrs"
            class="rui-avatar__image"
            :src="props.src"
            :alt="props.alt"
            @load="handleLoad"
            @error="handleError"
        />
        <slot v-else />
    </span>
</template>

<style scoped lang="scss">
@use "@/styles/shape";

.rui-avatar {
    /* @cssvar Avatar diameter. */
    --rui-comp-avatar-size: 40px;
    /* @cssvar Shape family. */
    --rui-comp-avatar-shape-family: var(--rui-sys-shape-icon-family);
    /* @cssvar Start-start corner radius. */
    --rui-comp-avatar-shape-start-start: var(--rui-sys-shape-icon-start-start);
    /* @cssvar Start-end corner radius. */
    --rui-comp-avatar-shape-start-end: var(--rui-sys-shape-icon-start-end);
    /* @cssvar End-end corner radius. */
    --rui-comp-avatar-shape-end-end: var(--rui-sys-shape-icon-end-end);
    /* @cssvar End-start corner radius. */
    --rui-comp-avatar-shape-end-start: var(--rui-sys-shape-icon-end-start);
    /* @cssvar Fallback background color. */
    --rui-comp-avatar-background: var(--rui-sys-color-secondary);
    /* @cssvar Fallback content color. */
    --rui-comp-avatar-content-color: var(--rui-sys-color-on-secondary);
    /* @cssvar Fallback content size. */
    --rui-comp-avatar-content-size: calc(var(--rui-comp-avatar-size) * 0.4);

    display: inline-flex;
    box-sizing: border-box;
    position: relative;
    inline-size: var(--rui-comp-avatar-size);
    block-size: var(--rui-comp-avatar-size);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @include shape.apply(
        var(--rui-comp-avatar-shape-family),
        var(--rui-comp-avatar-shape-start-start),
        var(--rui-comp-avatar-shape-start-end),
        var(--rui-comp-avatar-shape-end-end),
        var(--rui-comp-avatar-shape-end-start)
    );

    &--fallback {
        background-color: var(--rui-comp-avatar-background);
        color: var(--rui-comp-avatar-content-color);
        font-size: var(--rui-comp-avatar-content-size);
        font-weight: 500;
        line-height: 1;
    }

    &__image {
        display: block;
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
    }
}
</style>
