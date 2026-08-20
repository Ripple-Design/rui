<script setup lang="ts">
import { computed, useId, useSlots } from "vue"

import type { RSideSheetProps } from "./types.ts"

import RSurface from "../../base/surface/RSurface.vue"

const props = withDefaults(defineProps<RSideSheetProps>(), {
    side: "end",
    width: "320px",
    elevation: 0,
})

const slots = useSlots()
const titleId = useId()
const hasHeader = computed(() => !!slots.header || !!slots.title || !!props.title)
const hasFooter = computed(() => !!slots.footer)
const classes = computed(() => ["rui-side-sheet", `rui-side-sheet--${props.side}`])
const labelledby = computed(() => (hasHeader.value ? titleId : undefined))
const style = computed(() => ({
    "--rui-side-sheet-width": props.width,
}))
</script>

<template>
    <RSurface :class="classes" :style="style" :aria-labelledby="labelledby" variant="elevated" :elevation="elevation">
        <div class="rui-side-sheet__divider" aria-hidden="true" />
        <header v-if="hasHeader" class="rui-side-sheet__header">
            <slot name="header">
                <h2 :id="titleId" class="rui-side-sheet__title">
                    <slot name="title">{{ title }}</slot>
                </h2>
            </slot>
        </header>

        <div class="rui-side-sheet__content">
            <div class="rui-side-sheet__content-body">
                <slot />
            </div>
        </div>

        <footer v-if="hasFooter" class="rui-side-sheet__footer">
            <slot name="footer" />
        </footer>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-side-sheet {
    --rui-comp-side-sheet-divider-color: #{color.$on-surface-outline};
    position: relative;
    inline-size: min(var(--rui-side-sheet-width), 100vw);
    max-inline-size: 100vw;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    --rui-surface-shape-start-start: 0px;
    --rui-surface-shape-start-end: 0px;
    --rui-surface-shape-end-end: 0px;
    --rui-surface-shape-end-start: 0px;
}

.rui-side-sheet__divider {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    inline-size: 1px;
    background-color: var(--rui-comp-side-sheet-divider-color);
    pointer-events: none;
}

.rui-side-sheet--start .rui-side-sheet__divider {
    inset-inline-start: auto;
    inset-inline-end: 0;
}

.rui-side-sheet__header {
    padding-inline: var(--rui-comp-side-sheet-padding-inline, 16px);
}

.rui-side-sheet__content {
    overflow: auto;
    overscroll-behavior: contain;
}

.rui-side-sheet__content-body {
    @include typography.body1("--rui-comp-side-sheet-content");
    margin: 0;
    padding-inline: var(--rui-comp-side-sheet-padding-inline, 16px);
    padding-block-start: calc(36px - 1cap);
    padding-block-end: 28px;
    color: color.$on-surface-medium;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-side-sheet__footer {
    padding: 0 var(--rui-comp-side-sheet-padding-inline, 16px)
        var(--rui-comp-side-sheet-footer-padding-block-end, 16px);
}

.rui-side-sheet__title {
    @include typography.headline6("--rui-comp-side-sheet-title");
    margin: 0;
    padding-block-start: calc(44px - 1cap);
    color: color.$on-surface;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}
</style>
