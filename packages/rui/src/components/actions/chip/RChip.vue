<script setup lang="ts">
import {
    RICancelFilled,
    RICancelOutlined,
    RICancelRounded,
    RICancelSharp,
    RICancelTwoTone,
    RICheckFilled,
    RICheckOutlined,
    RICheckRounded,
    RICheckSharp,
    RICheckTwoTone,
} from "@ripple-design/icons"
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from "vue"

import { RIcon } from "@/components"
import { createIconFamily } from "@/components/base/icon/family.ts"
import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RChipProps } from "./types.ts"

import { chipGroupKey } from "./groupContext.ts"

const props = withDefaults(defineProps<RChipProps>(), {
    disabled: false,
    removable: false,
    removeLabel: "Remove",
    ripple: true,
})

const emit = defineEmits<{
    remove: [event: MouseEvent]
}>()

const model = defineModel<boolean>({ default: false })
const attrs = useAttrs()
const primaryRef = ref<HTMLElement | null>(null)
const group = inject(chipGroupKey, null)
const chipId = Symbol("rChip")
const checkIcon = createIconFamily(RICheckFilled, RICheckOutlined, RICheckRounded, RICheckSharp, RICheckTwoTone)
const cancelIcon = createIconFamily(RICancelFilled, RICancelOutlined, RICancelRounded, RICancelSharp, RICancelTwoTone)
let warnedMissingValue = false

const resolvedVariant = computed(() => props.variant ?? group?.variant.value ?? "plain")
const resolvedType = computed(() => props.type ?? group?.type.value ?? "action")
const isCheckable = computed(() => resolvedType.value !== "action")
const hasSelectionValue = computed(() => props.value !== undefined)
const selectionMode = computed(() => group?.selection.value)
const isInSelectableGroup = computed(() => selectionMode.value != null && isCheckable.value)
const isSelectableInGroup = computed(() => isInSelectableGroup.value && hasSelectionValue.value)
const selected = computed(() => {
    if (isSelectableInGroup.value) {
        return group?.isSelected(props.value) ?? false
    }

    return isCheckable.value && !isInSelectableGroup.value && model.value
})
const showSelectedIcon = computed(
    () => selected.value && (resolvedType.value === "filter" || resolvedType.value === "input"),
)
const showLeadingIcon = computed(() => {
    if (resolvedType.value === "filter" || resolvedType.value === "choice") {
        return showSelectedIcon.value
    }

    return showSelectedIcon.value || !!props.icon
})
const showRemove = computed(() => resolvedType.value === "input" && props.removable)
const showEndIcon = computed(() => !!props.endIcon && !showRemove.value)
const resolvedRole = computed(() => {
    if (selectionMode.value === "single" && isSelectableInGroup.value) {
        return "radio"
    }

    return undefined
})
const resolvedAriaChecked = computed(() => {
    if (selectionMode.value === "single" && isSelectableInGroup.value) {
        return selected.value ? "true" : "false"
    }

    return undefined
})
const resolvedAriaPressed = computed(() => {
    if (
        (selectionMode.value === "multiple" && isSelectableInGroup.value) ||
        (!isInSelectableGroup.value && isCheckable.value)
    ) {
        return selected.value ? "true" : "false"
    }

    return undefined
})
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true }
    }

    const options = props.ripple === true ? {} : props.ripple

    return {
        ...options,
        color: options?.color ?? "var(--rui-comp-chip-state-layer-color)",
        contrast: options?.contrast ?? "low",
        disabled: props.disabled || !!options?.disabled,
        selected: false,
    }
})
const classes = computed(() => [
    "rui-chip",
    `rui-chip--${resolvedVariant.value}`,
    `rui-chip--${resolvedType.value}`,
    {
        "rui-chip--selected": selected.value,
        "rui-chip--disabled": props.disabled,
        "rui-chip--removable": showRemove.value,
        "rui-chip--with-end-icon": showEndIcon.value,
        "rui-chip--with-leading": showLeadingIcon.value,
        "rui-chip--with-input-check": showSelectedIcon.value && resolvedType.value === "input",
    },
])

watch(
    [() => props.disabled, () => props.value, hasSelectionValue, isCheckable, primaryRef],
    ([disabled, value, hasValue, checkable, element]) => {
        if (!group) {
            return
        }

        if (!checkable) {
            group.unregisterItem(chipId)
            return
        }

        group.registerItem(chipId, {
            disabled,
            element,
            hasValue,
            value,
        })
    },
    { immediate: true },
)

watch(
    [selectionMode, isCheckable, hasSelectionValue],
    ([mode, checkable, hasValue]) => {
        if (mode == null || !checkable || hasValue || warnedMissingValue) {
            return
        }

        warnedMissingValue = true
        if (import.meta.env.DEV) {
            console.warn(
                "[RChipGroup] Selectable groups require every checkable RChip child to provide a unique `value`.",
            )
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    group?.unregisterItem(chipId)
})

function handlePrimaryClick() {
    if (isInSelectableGroup.value) {
        if (isSelectableInGroup.value) {
            group?.activate(chipId)
        }

        return
    }

    if (isCheckable.value) {
        model.value = !model.value
    }
}

function handleRemove(event: MouseEvent) {
    event.stopPropagation()
    emit("remove", event)
}
</script>

<template>
    <RTouchTargetWrapper class="rui-chip__touch-target-wrapper">
        <span :class="classes" v-ripple="rippleOptions">
            <button
                ref="primaryRef"
                v-bind="attrs"
                class="rui-chip__primary"
                type="button"
                :disabled="disabled"
                :role="resolvedRole"
                :aria-checked="resolvedAriaChecked"
                :aria-pressed="resolvedAriaPressed"
                @click="handlePrimaryClick"
            >
                <span
                    class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                    aria-hidden="true"
                />

                <span v-if="showLeadingIcon" class="rui-chip__leading" aria-hidden="true">
                    <span v-if="showSelectedIcon && resolvedType === 'input'" class="rui-chip__input-check">
                        <RIcon :icon="checkIcon" :size="18" emphasis="inherit" decorative />
                    </span>
                    <RIcon v-else-if="showSelectedIcon" :icon="checkIcon" :size="18" emphasis="inherit" decorative />
                    <RIcon v-else-if="icon" :icon="icon" :size="18" emphasis="inherit" decorative />
                </span>

                <span class="rui-chip__label">
                    <slot />
                </span>
            </button>

            <span v-if="showEndIcon" class="rui-chip__end-icon" aria-hidden="true">
                <RIcon :icon="endIcon" :size="18" emphasis="inherit" decorative />
            </span>

            <button
                v-if="showRemove"
                class="rui-chip__remove"
                type="button"
                :disabled="disabled"
                :aria-label="removeLabel"
                @click="handleRemove"
            >
                <span
                    class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                    aria-hidden="true"
                />
                <RIcon :icon="removeIcon ?? cancelIcon" :size="18" emphasis="inherit" decorative />
            </button>
        </span>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/elevations";
@use "@/styles/motion";
@use "@/styles/normalize";
@use "@/styles/shape";
@use "@/styles/typography";

.rui-chip__touch-target-wrapper {
    @include density.touchTargetEnabled();

    position: relative;
    display: inline-flex;
    align-items: center;
    padding-block: calc(4px * var(--rui-touch-target-enabled, 1));
    vertical-align: middle;
}

.rui-chip {
    --rui-comp-chip-surface-color-default: #{color.$surface};
    --rui-comp-chip-container-color-default: color-mix(
        in srgb,
        #{color.$on-surface} 10%,
        var(--rui-comp-chip-surface-color, var(--rui-comp-chip-surface-color-default))
    );
    --rui-comp-chip-selected-container-color-default: color-mix(
        in srgb,
        #{color.$on-surface} 18%,
        var(--rui-comp-chip-surface-color, var(--rui-comp-chip-surface-color-default))
    );
    --rui-comp-chip-disabled-container-color-default: color-mix(
        in srgb,
        #{color.$on-surface} 12%,
        var(--rui-comp-chip-surface-color, var(--rui-comp-chip-surface-color-default))
    );
    --rui-comp-chip-label-color: #{color.$on-surface-high};
    --rui-comp-chip-disabled-label-color: rgb(from #{color.$on-surface} r g b / 0.33);
    --rui-comp-chip-selected-label-color: #{color.$on-surface-high};
    --rui-comp-chip-leading-icon-color: #{color.$on-surface-medium};
    --rui-comp-chip-icon-color: #{color.$on-surface-medium};
    --rui-comp-chip-disabled-icon-color: rgb(from #{color.$on-surface} r g b / 0.33);
    --rui-comp-chip-close-icon-color: #{color.$on-surface-medium};
    --rui-comp-chip-disabled-close-icon-color: #{color.$on-surface-low};
    --rui-comp-chip-outline-color: #{color.$on-surface-outline};
    --rui-comp-chip-state-layer-color: #{color.$on-surface};
    --rui-comp-chip-height: #{density.withDecrement(32px, --rui-comp-chip-density)};
    --rui-comp-chip-density: #{density.$scale};
    --rui-comp-chip-shape-family: var(--rui-sys-shape-full-family);
    --rui-comp-chip-shape-start-start: var(--rui-sys-shape-full-start-start);
    --rui-comp-chip-shape-start-end: var(--rui-sys-shape-full-start-end);
    --rui-comp-chip-shape-end-end: var(--rui-sys-shape-full-end-end);
    --rui-comp-chip-shape-end-start: var(--rui-sys-shape-full-end-start);
    --rui-comp-chip-pressed-elevation: #{elevations.shadow(3)};

    @include shape.apply(
        var(--rui-comp-chip-shape-family),
        var(--rui-comp-chip-shape-start-start),
        var(--rui-comp-chip-shape-start-end),
        var(--rui-comp-chip-shape-end-end),
        var(--rui-comp-chip-shape-end-start)
    );

    position: relative;
    display: inline-flex;
    align-items: stretch;
    block-size: var(--rui-comp-chip-height);
    max-inline-size: 100%;
    overflow: visible;
    background-color: var(--rui-comp-chip-container-color, var(--rui-comp-chip-container-color-default));
    color: var(--rui-comp-chip-label-color);
    isolation: isolate;
    transition: box-shadow 100ms #{motion.$easing-standard};

    &--outlined {
        outline: 1px solid var(--rui-comp-chip-outline-color);
        outline-offset: -1px;
    }

    &--outlined:not(.rui-chip--selected):not(.rui-chip--disabled) {
        background-color: transparent;
    }

    &--selected {
        background-color: var(
            --rui-comp-chip-selected-container-color,
            var(--rui-comp-chip-selected-container-color-default)
        );
        color: var(--rui-comp-chip-selected-label-color);
    }

    &--choice {
        --rui-comp-chip-selected-container-color-default: color-mix(
            in srgb,
            #{color.$primary} 24%,
            var(--rui-comp-chip-surface-color, var(--rui-comp-chip-surface-color-default))
        );
        --rui-comp-chip-selected-label-color: #{color.$primary};
    }

    &--choice#{&}--selected {
        --rui-comp-chip-state-layer-color: #{color.$primary};
    }

    &--choice#{&}--outlined#{&}--selected {
        --rui-comp-chip-outline-color: #{color.$primary};
    }

    &--disabled {
        background-color: var(
            --rui-comp-chip-disabled-container-color,
            var(--rui-comp-chip-disabled-container-color-default)
        );
        --rui-comp-chip-label-color: var(--rui-comp-chip-disabled-label-color);
        --rui-comp-chip-selected-label-color: var(--rui-comp-chip-disabled-label-color);
        --rui-comp-chip-icon-color: var(--rui-comp-chip-disabled-icon-color);
        --rui-comp-chip-close-icon-color: var(--rui-comp-chip-disabled-close-icon-color);

        box-shadow: none;
        cursor: default;
    }

    &:has(.rui-chip__primary:active:not(:disabled)) {
        box-shadow: var(--rui-comp-chip-pressed-elevation);
    }
}

.rui-chip__primary,
.rui-chip__remove {
    @include normalize.button;

    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    color: inherit;

    &:focus-visible {
        z-index: 2;
        outline: 2px solid #{color.$primary};
        outline-offset: -2px;
    }

    &:disabled {
        cursor: default;
    }
}

.rui-chip__primary {
    @include typography.body2("--rui-comp-chip-label");

    flex: 1 1 auto;
    padding-inline-start: 4px;
    padding-inline-end: 6px;
    text-align: start;
}

.rui-chip__leading {
    display: inline-flex;
    flex: 0 0 18px;
    align-items: center;
    justify-content: center;
    color: var(--rui-comp-chip-leading-icon-color);
}

.rui-chip--with-leading .rui-chip__primary {
    padding-inline-start: 8px;
}

.rui-chip--removable .rui-chip__primary,
.rui-chip--with-end-icon .rui-chip__primary {
    padding-inline-end: 0;
}

.rui-chip--with-input-check .rui-chip__primary {
    padding-inline-start: 4px;
}

.rui-chip--with-input-check .rui-chip__leading {
    flex-basis: 24px;
}

.rui-chip__input-check {
    display: inline-flex;
    inline-size: 24px;
    block-size: 24px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgb(25 25 25 / 50%);
    color: #fff;
}

.rui-chip__label {
    @include typography.overflowEllipsis;

    min-inline-size: 0;
    padding-inline-start: 8px;
    padding-inline-end: 6px;
}

.rui-chip--with-leading .rui-chip__label {
    padding-inline-start: 8px;
}

.rui-chip--with-input-check .rui-chip__label {
    padding-inline-start: 8px;
}

.rui-chip__end-icon,
.rui-chip__remove {
    flex: 0 0 28px;
    justify-content: flex-start;
    padding-inline-start: 2px;
}

.rui-chip__end-icon {
    display: inline-flex;
    align-items: center;
    color: var(--rui-comp-chip-icon-color);
}

.rui-chip__remove {
    color: var(--rui-comp-chip-close-icon-color);

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled),
    &:active:not(:disabled) {
        --rui-comp-chip-close-icon-color: #{color.$on-surface-medium};
    }
}

.rui-chip--filter:not(.rui-chip--selected) .rui-chip__leading,
.rui-chip--choice .rui-chip__leading {
    display: none;
}

.rui-chip--filter.rui-chip--selected .rui-chip__leading {
    color: var(--rui-comp-chip-leading-icon-color);
}

@media (prefers-reduced-motion: reduce) {
    .rui-chip {
        transition-duration: 0ms !important;
    }
}
</style>
