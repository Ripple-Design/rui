<script setup lang="ts">
import { provide, useAttrs } from "vue"

import { selectionModelKey, useSelectionModel } from "@/foundations/selectionModel"

import { navigationRailKey } from "./context"
import type { RNavigationRailProps } from "./types"

const props = withDefaults(defineProps<RNavigationRailProps>(), {
    labelVisibility: "always",
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const selection = useSelectionModel(model)

provide(selectionModelKey, selection)
provide(navigationRailKey, {
    ...selection,
    labelVisibility: props.labelVisibility,
})
</script>

<template>
    <nav v-bind="attrs" class="rui-navigation-rail">
        <div v-if="$slots.top" class="rui-navigation-rail__top">
            <slot name="top" />
        </div>
        <div class="rui-navigation-rail__items">
            <slot />
        </div>
    </nav>
</template>

<style scoped lang="scss">
@use "@/styles/color";

.rui-navigation-rail {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 72px;
    padding-block: 8px;
    overflow-x: hidden;
    overflow-y: hidden;
    background: color.$surface;
    color: color.$on-surface;
}

.rui-navigation-rail__top {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-block-end: 8px;
}

.rui-navigation-rail__items {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>
