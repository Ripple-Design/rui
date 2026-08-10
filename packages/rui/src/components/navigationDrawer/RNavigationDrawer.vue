<script setup lang="ts">
import { useAttrs } from "vue"

import RNavigationDrawerPanel from "./RNavigationDrawerPanel.vue"
import type { RNavigationDrawerProps } from "./types"

const props = withDefaults(defineProps<RNavigationDrawerProps>(), {
    side: "start",
    width: "280px",
})

const attrs = useAttrs()
const model = defineModel<unknown>()
</script>

<template>
    <RNavigationDrawerPanel v-bind="attrs" v-model="model" class="rui-navigation-drawer--persistent" :title="title" :side="side" :width="width">
        <template v-if="$slots.title" #title><slot name="title" /></template>
        <template v-if="$slots.header" #header><slot name="header" /></template>
        <slot />
    </RNavigationDrawerPanel>
</template>

<style scoped lang="scss">
.rui-navigation-drawer--persistent::after {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    inline-size: 1px;
    content: "";
    background-color: var(--rui-sys-color-on-surface-outline);
    pointer-events: none;
}
</style>
