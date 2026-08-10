<script setup lang="ts">
import { computed, useAttrs, useId, useSlots } from "vue"

import RIconButton from "@/components/button/RIconButton.vue"
import RText from "@/components/text/RText.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"

import type { RTileProps, RTileSlots } from "./types"

const props = withDefaults(defineProps<RTileProps>(), {
    action: false,
    disabled: false,
    mode: "outside",
    position: "footer",
    ripple: true,
})
const emit = defineEmits<{
    (e: "action-click", event: MouseEvent): void
    (e: "click", event: MouseEvent): void
}>()
const attrs = useAttrs()
const slots = useSlots() as RTileSlots
const titleId = useId()
const textId = useId()

const hasTitle = computed(() => slots.title != null)
const hasSupporting = computed(() => slots.text != null)
const hasCustomAction = computed(() => slots.action != null)
const hasBuiltInAction = computed(() => !hasCustomAction.value && props.actionIcon != null)
const hasText = computed(() => hasTitle.value || hasSupporting.value)
const labelledBy = computed(() => [hasTitle.value ? titleId : null, hasSupporting.value ? textId : null].filter(Boolean).join(" "))
const isLink = computed(() => props.href != null && !props.disabled)
const isAction = computed(() => (props.action || props.href != null) && !props.disabled)
const surfaceTag = computed(() => {
    if (isLink.value) {
        return "a"
    }

    return isAction.value ? "button" : "span"
})
const rippleOptions = computed<RippleOptions>(() => {
    if (!isAction.value || props.ripple === false) {
        return { disabled: true }
    }

    if (props.ripple === true || props.ripple == null) {
        return { contrast: "low" }
    }

    return {
        ...props.ripple,
        contrast: props.ripple.contrast ?? "low",
        disabled: !!props.ripple.disabled,
        unbounded: props.ripple.unbounded ?? false,
    }
})
const classes = computed(() => [
    "rui-tile",
    `rui-tile--${props.mode}`,
    `rui-tile--${props.position}`,
    {
        "rui-tile--action": isAction.value,
        "rui-tile--disabled": props.disabled,
        "rui-tile--with-text": hasText.value,
        "rui-tile--with-supporting": hasSupporting.value,
    },
])

function handleActionClick(event: MouseEvent) {
    event.stopPropagation()
    emit("action-click", event)
}

function handleClick(event: MouseEvent) {
    if (!isAction.value) {
        event.preventDefault()
        return
    }

    emit("click", event)
}
</script>

<template>
    <li :class="classes">
        <header v-if="hasText && position === 'header'" class="rui-tile__content">
            <span class="rui-tile__copy">
                <RText v-if="$slots.title" :id="titleId" class="rui-tile__title" as="span" variant="subtitle1">
                    <slot name="title" />
                </RText>
                <RText v-if="$slots.text" :id="textId" class="rui-tile__text" as="span" variant="body2">
                    <slot name="text" />
                </RText>
            </span>
            <span v-if="hasCustomAction" class="rui-tile__action"><slot name="action" /></span>
            <RIconButton
                v-else-if="hasBuiltInAction"
                class="rui-tile__action rui-tile__action--built-in"
                :icon="actionIcon!"
                :label="actionLabel ?? ''"
                :disabled="disabled"
                @click="handleActionClick"
            />
        </header>

        <component
            :is="surfaceTag"
            v-bind="attrs"
            v-ripple="rippleOptions"
            class="rui-tile__surface"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-labelledby="isAction && labelledBy ? labelledBy : undefined"
            :href="isLink ? href : undefined"
            :target="isLink ? target : undefined"
            :rel="isLink ? rel : undefined"
            :type="surfaceTag === 'button' ? 'button' : undefined"
            @click="handleClick"
        >
            <span class="rui-tile__media"><slot /></span>
            <span class="rui-tile__scrim" aria-hidden="true" />
        </component>

        <footer v-if="hasText && position === 'footer'" class="rui-tile__content">
            <span class="rui-tile__copy">
                <RText v-if="$slots.title" :id="titleId" class="rui-tile__title" as="span" variant="subtitle1">
                    <slot name="title" />
                </RText>
                <RText v-if="$slots.text" :id="textId" class="rui-tile__text" as="span" variant="body2">
                    <slot name="text" />
                </RText>
            </span>
            <span v-if="hasCustomAction" class="rui-tile__action"><slot name="action" /></span>
            <RIconButton
                v-else-if="hasBuiltInAction"
                class="rui-tile__action rui-tile__action--built-in"
                :icon="actionIcon!"
                :label="actionLabel ?? ''"
                :disabled="disabled"
                @click="handleActionClick"
            />
        </footer>
    </li>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/normalize";

.rui-tile {
    --rui-comp-tile-content-padding: 16px;
    --rui-comp-tile-content-gap: 0;
    --rui-comp-tile-scrim-height: 48px;
    --rui-comp-tile-content-color: #{color.$on-surface-high};
    --rui-comp-tile-text-color: #{color.$on-surface-medium};
    --rui-comp-tile-overlay-content-color: var(--rui-sys-color-on-primary);
    --rui-comp-tile-overlay-text-color: var(--rui-sys-color-on-primary-medium);
    --rui-comp-surface-content-color: var(--rui-sys-color-on-surface);
    --rui-comp-surface-content-color-high: var(--rui-sys-color-on-surface-high);
    --rui-comp-surface-content-color-medium: var(--rui-sys-color-on-surface-medium);
    --rui-comp-surface-content-color-low: var(--rui-sys-color-on-surface-low);
    --rui-comp-tile-scrim-color: rgb(from var(--rui-sys-color-on-surface) r g b / 30%);
    --rui-comp-tile-gradient-start: transparent;
    --rui-comp-tile-gradient-end: rgb(0 0 0 / 30%);
    --rui-comp-tile-scrim-duration: var(--rui-sys-motion-duration-small-out);
    --rui-comp-tile-scrim-easing: var(--rui-sys-motion-easing-standard);

    position: relative;
    display: grid;
    box-sizing: border-box;
    list-style: none;
    border: 0;
    border-radius: 0;
    box-shadow: none;
}

.rui-tile__surface {
    position: relative;
    display: block;
    box-sizing: border-box;
    inline-size: 100%;
    overflow: hidden;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: var(--rui-comp-tile-content-color);
    text-align: start;
    text-decoration: none;

    .rui-tile--action & {
        @include normalize.button;

        inline-size: 100%;
        touch-action: manipulation;
    }

    .rui-tile--disabled & {
        cursor: default;
        opacity: 0.38;
    }

    &:focus-visible {
        z-index: 3;
        outline: 2px solid currentcolor;
        outline-offset: -2px;
    }
}

.rui-tile__media {
    position: relative;
    z-index: 0;
    display: block;
    min-inline-size: 0;

    :deep(img),
    :deep(picture),
    :deep(video) {
        display: block;
        max-inline-size: 100%;
    }

    :deep(img),
    :deep(video) {
        inline-size: 100%;
    }
}

.rui-tile__scrim {
    position: absolute;
    z-index: 1;
    display: none;
    opacity: 0;
    pointer-events: none;
    transition:
        display var(--rui-comp-tile-scrim-duration) var(--rui-comp-tile-scrim-easing) allow-discrete,
        opacity var(--rui-comp-tile-scrim-duration) var(--rui-comp-tile-scrim-easing);
    transition-behavior: allow-discrete;
}

.rui-tile__content {
    display: grid;
    z-index: 2;
    box-sizing: border-box;
    grid-template-columns: minmax(0, 1fr) auto;
    align-content: center;
    gap: var(--rui-comp-tile-content-gap);
    min-block-size: var(--rui-comp-tile-scrim-height);
    padding-inline-start: 16px;
    color: var(--rui-comp-tile-content-color);
}

.rui-tile__copy {
    display: grid;
    min-inline-size: 0;
    align-self: center;
}

.rui-tile__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
}

.rui-tile__action--built-in {
    margin-inline-end: 4px;
}

.rui-tile__title,
.rui-tile__text {
    min-inline-size: 0;
    color: inherit;
}

.rui-tile__title {
    --rui-comp-text-color: var(--rui-comp-tile-content-color);
    line-height: 24px;
}

.rui-tile__text {
    --rui-comp-text-color: var(--rui-comp-tile-text-color);
    line-height: 16px;
    color: var(--rui-comp-tile-text-color);
}

.rui-tile--scrim .rui-tile__title,
.rui-tile--gradient .rui-tile__title {
    --rui-comp-text-color: var(--rui-comp-tile-overlay-content-color);
}

.rui-tile--scrim .rui-tile__text,
.rui-tile--gradient .rui-tile__text {
    --rui-comp-text-color: var(--rui-comp-tile-overlay-text-color);
}

.rui-tile--scrim,
.rui-tile--gradient {
    --rui-comp-surface-content-color: var(--rui-sys-color-on-primary);
    --rui-comp-surface-content-color-high: var(--rui-sys-color-on-primary-high);
    --rui-comp-surface-content-color-medium: var(--rui-sys-color-on-primary-medium);
    --rui-comp-surface-content-color-low: var(--rui-sys-color-on-primary-low);
}

.rui-tile--scrim .rui-tile__scrim {
    display: block;
    opacity: 1;
    inset-inline: 0;
    block-size: var(--rui-comp-tile-scrim-height);
    background: var(--rui-comp-tile-scrim-color);

    @starting-style {
        opacity: 0;
    }
}

.rui-tile--with-supporting {
    --rui-comp-tile-scrim-height: 68px;
}

.rui-tile--scrim.rui-tile--header .rui-tile__scrim {
    inset-block-start: 0;
}

.rui-tile--scrim.rui-tile--footer .rui-tile__scrim {
    inset-block-end: 0;
}

.rui-tile--scrim .rui-tile__content,
.rui-tile--gradient .rui-tile__content {
    position: absolute;
    inset-inline: 0;
    color: var(--rui-comp-tile-overlay-content-color);
}

.rui-tile--scrim .rui-tile__text,
.rui-tile--gradient .rui-tile__text {
    color: var(--rui-comp-tile-overlay-text-color);
}

.rui-tile--header.rui-tile--scrim .rui-tile__content,
.rui-tile--header.rui-tile--gradient .rui-tile__content {
    inset-block-start: 0;
}

.rui-tile--footer.rui-tile--scrim .rui-tile__content,
.rui-tile--footer.rui-tile--gradient .rui-tile__content {
    inset-block-end: 0;
}

.rui-tile--gradient .rui-tile__scrim {
    display: block;
    opacity: 1;
    inset-inline: 0;
    block-size: calc(var(--rui-comp-tile-scrim-height) * 2);

    @starting-style {
        opacity: 0;
    }
}

.rui-tile--gradient.rui-tile--header .rui-tile__scrim {
    inset-block-start: 0;
    background: linear-gradient(
        to bottom,
        var(--rui-comp-tile-gradient-end) 0%,
        color-mix(in srgb, var(--rui-comp-tile-gradient-end) 50%, transparent) 30%,
        transparent 100%
    );
}

.rui-tile--gradient.rui-tile--footer .rui-tile__scrim {
    inset-block-end: 0;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        color-mix(in srgb, var(--rui-comp-tile-gradient-end) 50%, transparent) 70%,
        var(--rui-comp-tile-gradient-end) 100%
    );
}

@media (prefers-reduced-motion: reduce) {
    .rui-tile__scrim {
        transition-duration: 0ms !important;
    }
}
</style>
