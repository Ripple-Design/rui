<script setup lang="ts">
import { computed, useId, useSlots } from "vue"

import RSurface from "@/components/surface/RSurface.vue"

import type { RBottomSheetProps } from "./types"

const props = withDefaults(defineProps<RBottomSheetProps>(), {
    maxWidth: "640px",
    maxHeight: "100dvh",
    elevation: 8,
})

const slots = useSlots()
const titleId = useId()
const hasHeader = computed(() => !!slots.header || !!slots.title || !!props.title)
const hasFooter = computed(() => !!slots.footer)
const labelledby = computed(() => (hasHeader.value ? titleId : undefined))
const style = computed(() => ({
    "--rui-comp-bottom-sheet-max-width": props.maxWidth,
    "--rui-comp-bottom-sheet-max-height": props.maxHeight,
}))
</script>

<template>
    <RSurface
        class="rui-bottom-sheet"
        :style="style"
        :aria-labelledby="labelledby"
        variant="elevated"
        :elevation="props.elevation"
    >
        <header v-if="hasHeader" class="rui-bottom-sheet__header">
            <slot name="header">
                <h2 :id="titleId" class="rui-bottom-sheet__title">
                    <slot name="title">{{ title }}</slot>
                </h2>
            </slot>
        </header>

        <div class="rui-bottom-sheet__content" data-rui-modal-scrollable>
            <div class="rui-bottom-sheet__content-body">
                <slot />
            </div>
        </div>

        <footer v-if="hasFooter" class="rui-bottom-sheet__footer">
            <slot name="footer" />
        </footer>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-bottom-sheet {
    inline-size: 100%;
    max-inline-size: min(var(--rui-comp-bottom-sheet-max-width), 100vw);
    max-block-size: min(var(--rui-comp-bottom-sheet-max-height), 100dvh);
    margin-inline: auto;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    --rui-surface-shape-start-start: 8px;
    --rui-surface-shape-start-end: 8px;
    --rui-surface-shape-end-end: 0px;
    --rui-surface-shape-end-start: 0px;
}

.rui-bottom-sheet__header {
    padding-inline: 24px;
}

.rui-bottom-sheet__content {
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
}

.rui-bottom-sheet__content-body {
    @include typography.body1("--rui-comp-bottom-sheet-content");
    margin: 0;
    padding-inline: 24px;
    padding-block-start: calc(36px - 1cap);
    padding-block-end: 28px;
    color: color.$on-surface-medium;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-bottom-sheet__footer {
    padding: 0 24px 24px;
}

.rui-bottom-sheet__title {
    @include typography.headline6("--rui-comp-bottom-sheet-title");
    margin: 0;
    padding-block-start: calc(44px - 1cap);
    color: color.$on-surface;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}
</style>
