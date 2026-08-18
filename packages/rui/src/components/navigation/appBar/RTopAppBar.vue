<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RTopAppBarProps } from "./types.ts"

import RText from "../../base/text/RText.vue"

const props = withDefaults(defineProps<RTopAppBarProps>(), {
    centered: false,
})
const attrs = useAttrs()
const classes = computed(() => ({
    "rui-top-app-bar__toolbar--centered": props.centered,
}))
</script>

<template>
    <div
        v-bind="attrs"
        class="rui-top-app-bar__toolbar"
        :class="classes"
        role="toolbar"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
    >
        <div v-if="$slots.navigation" class="rui-top-app-bar__navigation">
            <slot name="navigation" />
        </div>

        <div v-if="$slots.title || title || $slots.subtitle || subtitle" class="rui-top-app-bar__text">
            <RText
                v-if="$slots.title || title"
                as="div"
                class="rui-top-app-bar__title"
                variant="headline6"
                emphasis="high"
            >
                <slot name="title">{{ title }}</slot>
            </RText>
            <RText
                v-if="$slots.subtitle || subtitle"
                as="div"
                class="rui-top-app-bar__subtitle"
                variant="subtitle1"
                emphasis="medium"
            >
                <slot name="subtitle">{{ subtitle }}</slot>
            </RText>
        </div>

        <div v-if="$slots.actions" class="rui-top-app-bar__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.rui-top-app-bar__toolbar {
    --rui-comp-app-bar-toolbar-padding-inline: 4px;
    --rui-comp-app-bar-title-margin-inline: 16px;
    --rui-comp-app-bar-title-navigation-gap: 20px;
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    box-sizing: border-box;
    block-size: 100%;
    min-block-size: var(--rui-comp-app-bar-collapsed-height, 56px);
    padding-inline: var(--rui-comp-app-bar-toolbar-padding-inline);
    color: var(--rui-comp-app-bar-content-color, inherit);
}

.rui-top-app-bar__navigation,
.rui-top-app-bar__actions {
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0;
    min-inline-size: 0;
}

.rui-top-app-bar__navigation {
    grid-column: 1;
    justify-self: start;
}

.rui-top-app-bar__actions {
    grid-column: 3;
    justify-self: end;
}

.rui-top-app-bar__text {
    grid-column: 2;
    grid-row: 1;
    display: grid;
    gap: 0;
    min-inline-size: 0;
    max-inline-size: 100%;
    margin-inline: var(--rui-comp-app-bar-title-margin-inline);
    justify-self: stretch;
    z-index: 0;
}

.rui-top-app-bar__navigation + .rui-top-app-bar__text {
    margin-inline-start: var(--rui-comp-app-bar-title-navigation-gap);
}

.rui-top-app-bar__text :deep(.rui-text) {
    min-inline-size: 0;
    text-box-trim: trim-both;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.rui-top-app-bar__toolbar--centered .rui-top-app-bar__text {
    position: absolute;
    grid-column: 1 / -1;
    inset-inline: 0;
    inline-size: auto;
    max-inline-size: calc(100% - 112px);
    margin-inline: auto;
    text-align: center;
    pointer-events: none;
}
</style>
