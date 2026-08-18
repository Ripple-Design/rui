<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RNavigationDrawerItemProps } from "./types.ts"

import RIcon from "../../base/icon/RIcon.vue"
import { navigationDrawerGroupKey, navigationDrawerKey } from "./context.ts"

const props = withDefaults(defineProps<RNavigationDrawerItemProps>(), { ripple: true })

const attrs = useAttrs()
const drawer = inject(navigationDrawerKey, null)
const group = inject(navigationDrawerGroupKey, null)
const itemId = Symbol("navigationDrawerItem")
const iconId = Symbol("navigationDrawerItemIcon")
const interactiveRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const selected = computed(() => drawer?.isSelected(props.value) ?? false)
const selectedIcon = computed(() => (selected.value && props.selectedIcon ? props.selectedIcon : props.icon))
const isLink = computed(() => props.href != null)
const hasIcon = computed(() => !!props.icon || !!props.selectedIcon)
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) return { disabled: true, getSurfaceTarget: () => indicatorRef.value }
    if (props.ripple === true || props.ripple == null)
        return { disabled: false, contrast: "low", getSurfaceTarget: () => indicatorRef.value }
    return {
        ...props.ripple,
        disabled: !!props.ripple.disabled,
        contrast: props.ripple.contrast ?? "low",
        getSurfaceTarget: props.ripple.getSurfaceTarget ?? (() => indicatorRef.value),
    }
})
const classes = computed(() => [
    "rui-navigation-drawer-item",
    {
        "rui-navigation-drawer-item--selected": selected.value,
        "rui-navigation-drawer-item--icon-aligned": group?.hasIcon.value,
    },
])

watch(
    [() => props.value, () => attrs.disabled, interactiveRef, () => drawer],
    ([value, disabled, element, nextDrawer]) =>
        nextDrawer?.registerItem(itemId, { value, element, disabled: !!disabled }),
    { immediate: true },
)
watch(hasIcon, (present) => group?.registerIcon(iconId, present), { immediate: true })

onBeforeUnmount(() => {
    drawer?.unregisterItem(itemId)
    group?.unregisterIcon(iconId)
})

function handleClick() {
    if (isLink.value) return
    drawer?.activate(itemId)
}
</script>

<template>
    <component
        :is="isLink ? 'a' : 'button'"
        ref="interactiveRef"
        v-bind="attrs"
        v-ripple="rippleOptions"
        :class="classes"
        :href="props.href"
        :type="isLink ? undefined : 'button'"
        :aria-current="selected ? 'page' : undefined"
        @click="handleClick"
    >
        <span ref="indicatorRef" class="rui-navigation-drawer-item__indicator">
            <span
                v-if="hasIcon || group?.hasIcon.value"
                class="rui-navigation-drawer-item__icon"
                :class="{ 'rui-navigation-drawer-item__icon--empty': !selectedIcon }"
            >
                <RIcon v-if="selectedIcon" :icon="selectedIcon" :size="24" decorative />
            </span>
            <span class="rui-navigation-drawer-item__label"><slot /></span>
        </span>
    </component>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/normalize";
@use "@/styles/shape";
@use "@/styles/typography";

.rui-navigation-drawer-item {
    --rui-comp-navigation-drawer-item-text-color: var(--rui-sys-color-on-surface-high);
    --rui-comp-navigation-drawer-item-icon-color: var(--rui-sys-color-on-surface-medium);
    --rui-comp-navigation-drawer-item-active-color: #{color.$primary};
    --rui-comp-navigation-drawer-item-selected-background: rgb(from var(--rui-sys-color-primary) r g b / 0.12);

    @include normalize.button;
    @include typography.subtitle2("--rui-comp-navigation-drawer-item-label");
    @include shape.apply(
        var(--rui-sys-shape-small-family),
        var(--rui-sys-shape-small-start-start),
        var(--rui-sys-shape-small-start-end),
        var(--rui-sys-shape-small-end-end),
        var(--rui-sys-shape-small-end-start)
    );

    position: relative;
    box-sizing: border-box;
    display: flow-root;
    inline-size: 100%;
    min-block-size: 48px;
    padding: 0;
    color: var(--rui-comp-navigation-drawer-item-text-color);
    background-color: transparent;
    text-align: start;
    text-decoration: none;

    &:disabled {
        color: #{color.$on-surface-low};
        cursor: default;
    }

    &--selected {
        --rui-comp-navigation-drawer-item-text-color: var(--rui-comp-navigation-drawer-item-active-color);
        --rui-comp-navigation-drawer-item-icon-color: var(--rui-comp-navigation-drawer-item-active-color);

        .rui-navigation-drawer-item__indicator {
            background-color: var(--rui-comp-navigation-drawer-item-selected-background);
        }
    }
}

.rui-navigation-drawer-item__indicator {
    @include shape.apply(
        var(--rui-sys-shape-small-family),
        var(--rui-sys-shape-small-start-start),
        var(--rui-sys-shape-small-start-end),
        var(--rui-sys-shape-small-end-end),
        var(--rui-sys-shape-small-end-start)
    );

    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    block-size: 40px;
    margin: 4px 8px;
    padding-inline: 8px;
    overflow: hidden;
    background-color: transparent;
}

.rui-navigation-drawer-item__icon {
    --rui-icon-color-medium: var(--rui-comp-navigation-drawer-item-icon-color);

    display: inline-flex;
    inline-size: 24px;
    block-size: 24px;
    flex: none;
    margin-inline-end: 32px;
    color: currentColor;

    &--empty {
        visibility: hidden;
    }
}

.rui-navigation-drawer-item__label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
