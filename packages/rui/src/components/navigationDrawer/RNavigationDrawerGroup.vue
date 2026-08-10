<script setup lang="ts">
import { computed, provide, ref } from "vue"

import RNavigationDrawerDivider from "./RNavigationDrawerDivider.vue"
import { navigationDrawerGroupKey } from "./context"
import type { RNavigationDrawerGroupProps } from "./types"

const props = defineProps<RNavigationDrawerGroupProps>()
const icons = new Map<symbol, boolean>()
const hasIcon = ref(false)

function publishIcons() {
    hasIcon.value = Array.from(icons.values()).some(Boolean)
}

function registerIcon(id: symbol, present: boolean) {
    icons.set(id, present)
    publishIcons()
}

function unregisterIcon(id: symbol) {
    icons.delete(id)
    publishIcons()
}

provide(navigationDrawerGroupKey, { hasIcon, registerIcon, unregisterIcon })
const hasTitle = computed(() => !!props.title)
</script>

<template>
    <section class="rui-navigation-drawer-group">
        <RNavigationDrawerDivider />
        <h2 v-if="hasTitle" class="rui-navigation-drawer-group__title">{{ title }}</h2>
        <slot />
    </section>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-navigation-drawer-group {
    min-inline-size: 0;
}

.rui-navigation-drawer-group:first-child > .rui-navigation-drawer-divider {
    display: none;
}

.rui-navigation-drawer-group__title {
    @include typography.subtitle2("--rui-comp-navigation-drawer-group-title");
    margin: 0;
    padding-block-start: calc(20px - 1cap);
    padding-block-end: 12px;
    padding-inline: 16px;
    color: #{color.$on-surface-medium};
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}
</style>
