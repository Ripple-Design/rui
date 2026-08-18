<script setup lang="ts">
import { useAttrs } from "vue"

import RAppBarContainer from "@/components/navigation/appBar/RAppBarContainer.vue"

import type { RScaffoldProps } from "./types.ts"

import RScaffoldLayout from "./RScaffoldLayout.vue"

defineOptions({ inheritAttrs: false })

defineProps<RScaffoldProps>()
const attrs = useAttrs()
</script>

<template>
    <RScaffoldLayout
        v-bind="attrs"
        :scroll-direction="scrollDirection"
        :fab-placement="fabPlacement"
        :initial-top-inset="initialTopInset"
        :bottom-bar-hide-on-scroll="bottomBarHideOnScroll"
    >
        <template v-if="$slots.navigation" #navigation>
            <slot name="navigation" />
        </template>

        <template v-if="$slots['clipped-navigation']" #clipped-navigation>
            <slot name="clipped-navigation" />
        </template>

        <template v-if="$slots['app-bar'] && appBar" #app-bar>
            <RAppBarContainer v-bind="appBar">
                <slot name="app-bar" />
            </RAppBarContainer>
        </template>

        <template v-else-if="$slots['app-bar']" #app-bar>
            <slot name="app-bar" />
        </template>

        <slot />

        <template v-if="$slots['bottom-bar']" #bottom-bar>
            <slot name="bottom-bar" />
        </template>

        <template v-if="$slots.fab" #fab>
            <slot name="fab" />
        </template>

        <template v-if="$slots['side-sheet']" #side-sheet>
            <slot name="side-sheet" />
        </template>

        <template v-if="$slots['clipped-side-sheet']" #clipped-side-sheet>
            <slot name="clipped-side-sheet" />
        </template>

        <template v-if="$slots.modal" #modal>
            <slot name="modal" />
        </template>
    </RScaffoldLayout>
</template>
