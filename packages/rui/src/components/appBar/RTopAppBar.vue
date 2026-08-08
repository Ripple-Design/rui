<script setup lang="ts">
import RText from "@/components/text/RText.vue"

import type { RAppBarProps } from "./types"

const props = withDefaults(defineProps<RAppBarProps>(), {
    centered: false,
})
</script>

<template>
    <div
        class="rui-top-app-bar__toolbar"
        :class="{
            'rui-top-app-bar__toolbar--centered': centered,
            'rui-top-app-bar__toolbar--with-navigation': $slots.navigation,
        }"
    >
        <div v-if="$slots.navigation" class="rui-top-app-bar__navigation">
            <slot name="navigation" />
        </div>

        <div v-if="$slots.title || $slots.subtitle" class="rui-top-app-bar__text">
            <RText v-if="$slots.title" as="div" class="rui-top-app-bar__title" variant="headline6" emphasis="high">
                <slot name="title" />
            </RText>
            <RText
                v-if="$slots.subtitle"
                as="div"
                class="rui-top-app-bar__subtitle"
                variant="subtitle1"
                emphasis="medium"
            >
                <slot name="subtitle" />
            </RText>
        </div>

        <div v-if="$slots.actions" class="rui-top-app-bar__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.rui-top-app-bar__toolbar {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    box-sizing: border-box;
    block-size: 100%;
    min-block-size: 0;
    padding-inline: 4px;
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
    margin-inline: 16px;
    justify-self: stretch;
    z-index: 0;
}

.rui-top-app-bar__navigation + .rui-top-app-bar__text {
    margin-inline-start: 20px;
}

.rui-top-app-bar__text :deep(.rui-text) {
    min-inline-size: 0;
    text-box-trim: trim-both;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.rui-top-app-bar__toolbar--centered .rui-top-app-bar__text {
    position: absolute;
    inset-inline: 0;
    inline-size: auto;
    max-inline-size: none;
    text-align: center;
    pointer-events: none;
}
</style>
