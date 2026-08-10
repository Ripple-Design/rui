<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId, useSlots } from "vue"

import RSurface from "@/components/surface/RSurface.vue"
import { selectionModelKey, useSelectionModel } from "@/foundations/selectionModel"

import { navigationDrawerKey } from "./context"
import type { RNavigationDrawerProps } from "./types"

const props = withDefaults(defineProps<RNavigationDrawerProps>(), {
    side: "start",
    width: "280px",
})

const attrs = useAttrs()
const slots = useSlots()
const titleId = useId()
const emit = defineEmits<{ (e: "select", value: unknown): void }>()
const model = defineModel<unknown>()
const selection = useSelectionModel(model)
const hasHeader = computed(() => !!slots.header || !!slots.title || !!props.title)
const labelledby = computed(() => (hasHeader.value ? titleId : undefined))
const style = computed(() => ({ "--rui-comp-navigation-drawer-width": props.width }))
const surfaceRef = ref<InstanceType<typeof RSurface> | null>(null)

function activate(id: symbol) {
    const item = selection.items.value.find((candidate) => candidate.id === id)
    if (!item || item.state.disabled || selection.isSelected(item.state.value)) return

    selection.activate(id)
    emit("select", item.state.value)
}

provide(selectionModelKey, selection)
provide(navigationDrawerKey, { ...selection, hasHeader, activate })

defineExpose({
    element: computed(() => surfaceRef.value?.$el as HTMLElement | null),
})
</script>

<template>
    <RSurface
        ref="surfaceRef"
        v-bind="attrs"
        :class="['rui-navigation-drawer', `rui-navigation-drawer--${side}`]"
        :style="[attrs.style, style]"
        :aria-labelledby="labelledby"
        as="nav"
        color="surface"
        variant="elevated"
        :elevation="16"
    >
        <header v-if="hasHeader" class="rui-navigation-drawer__header">
            <slot name="header">
                <h2 :id="titleId" class="rui-navigation-drawer__title">
                    <slot name="title">{{ title }}</slot>
                </h2>
            </slot>
        </header>
        <div class="rui-navigation-drawer__content" :class="{ 'rui-navigation-drawer__content--headerless': !hasHeader }" data-rui-modal-scrollable>
            <slot />
        </div>
    </RSurface>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/typography";

.rui-navigation-drawer {
    inline-size: min(var(--rui-comp-navigation-drawer-width), 100vw);
    max-inline-size: 280px;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    --rui-surface-shape-start-start: 0;
    --rui-surface-shape-start-end: 0;
    --rui-surface-shape-end-start: 0;
    --rui-surface-shape-end-end: 0;
}

.rui-navigation-drawer__header {
    padding-inline: 16px;
}

.rui-navigation-drawer__title {
    @include typography.headline6("--rui-comp-side-sheet-title");
    margin: 0;
    padding-block-start: calc(44px - 1cap);
    padding-block-end: calc(36px - 1cap);
    color: color.$on-surface;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-navigation-drawer__content {
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
    padding-block-end: env(safe-area-inset-bottom);
}

.rui-navigation-drawer__content--headerless {
    padding-block-start: env(safe-area-inset-top);
}
</style>
