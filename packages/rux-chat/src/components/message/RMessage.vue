<script setup lang="ts">
import { RCard } from "@ripple-design/rui"
import { computed, inject, ref, useAttrs } from "vue"

import { messageGroupKey } from "./context"

import type { RMessageProps } from "./types"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RMessageProps>(), {
    elevation: 1,
    hoverElevation: 4,
})
const group = inject(messageGroupKey, null)
const sender = computed(() => group?.value ?? props.sender ?? "other")
const attrs = useAttrs()
const hovered = ref(false)
const elevation = computed(() => (props.dragged || hovered.value ? props.hoverElevation : props.elevation))
const cardStyle = computed(() => ({
    boxShadow: "none",
    filter: `var(--rui-sys-elevation-filter-shadow-${elevation.value})`,
}))
const cardProps = computed(() => {
    const { sender: _sender, color, ...rest } = props
    const { style, ...restAttrs } = attrs

    return {
        ...rest,
        ...restAttrs,
        variant: "elevated",
        color: color ?? attrs.color ?? (sender.value === "self" ? "primary" : "surface"),
        style: [style, cardStyle.value],
    }
})
</script>

<template>
    <div v-if="sender === 'assistant'" :class="['rux-message', 'rux-message--assistant']" v-bind="attrs">
        <slot />
    </div>

    <RCard
        v-else
        :class="['rux-message', `rux-message--${sender}`]"
        v-bind="cardProps"
        @pointerenter="hovered = true"
        @pointerleave="hovered = false"
    >
        <slot />
    </RCard>
</template>

<style scoped>
.rux-message {
    --rui-comp-message-tail-size: 8px;

    padding: 8px;
    transition: filter var(--rui-sys-elevation-duration) var(--rui-sys-motion-easing-standard);
}

.rux-message::before {
    content: "";
    position: absolute;
    z-index: 0;
    inline-size: calc(var(--rui-comp-message-tail-size) + 1px);
    block-size: var(--rui-comp-message-tail-size);
    background-color: var(--rui-comp-surface-background);
    pointer-events: none;
}

.rux-message--assistant {
    padding: 0;
    filter: none;
}

.rux-message--assistant::before {
    content: none;
}

.rux-message--self {
    border-start-end-radius: 0;
}

.rux-message--self::before {
    inset-block-start: 0;
    inset-inline-end: calc(var(--rui-comp-message-tail-size) * -1);
    clip-path: polygon(0 0, 0 100%, 100% 0);
}

.rux-message--other {
    border-end-start-radius: 0;
}

.rux-message--other::before {
    inset-block-end: 0;
    inset-inline-start: calc(var(--rui-comp-message-tail-size) * -1);
    clip-path: polygon(0 100%, 100% 0, 100% 100%);
}

.rux-message :deep(.rui-ripple-surface) {
    overflow: visible;
}

.rux-message--self :deep(.rui-ripple-surface) {
    clip-path: polygon(
        0 0,
        calc(100% + var(--rui-comp-message-tail-size)) 0,
        100% var(--rui-comp-message-tail-size),
        100% 100%,
        0 100%
    );
}

.rux-message--self :deep(.rui-ripple-surface)::before,
.rux-message--self :deep(.rui-ripple-surface)::after {
    inset-block-start: calc(var(--rui-comp-message-tail-size) * -1);
    inset-inline-end: calc(var(--rui-comp-message-tail-size) * -1);
}

.rux-message--other :deep(.rui-ripple-surface) {
    clip-path: polygon(
        0 0,
        100% 0,
        100% 100%,
        calc(var(--rui-comp-message-tail-size) * -1) 100%,
        0 calc(100% - var(--rui-comp-message-tail-size))
    );
}

.rux-message--other :deep(.rui-ripple-surface)::before,
.rux-message--other :deep(.rui-ripple-surface)::after {
    inset-block-end: calc(var(--rui-comp-message-tail-size) * -1);
    inset-inline-start: calc(var(--rui-comp-message-tail-size) * -1);
}
</style>
