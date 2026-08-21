<script setup lang="ts">
import { computed, provide } from "vue"

import { RAvatar, RColumn, RRow } from "@ripple-design/rui"

import { messageGroupKey } from "./context"

import type { RMessageGroupProps } from "./types"

const props = withDefaults(defineProps<RMessageGroupProps>(), {
    sender: "other",
})

provide(messageGroupKey, computed(() => props.sender))

const showAvatar = computed(() => !!props.avatar)
</script>

<template>
    <RRow
        v-if="showAvatar"
        :class="['rux-message-group', `rux-message-group--${props.sender}`]"
        align="flex-end"
        gap="8px"
    >
        <RAvatar v-bind="props.avatar" />
        <RColumn class="rux-message-group__messages" gap="8px">
            <slot />
        </RColumn>
    </RRow>

    <RColumn v-else :class="['rux-message-group', `rux-message-group--${props.sender}`]" gap="8px">
        <slot />
    </RColumn>
</template>

<style scoped>
.rux-message-group :deep(.rux-message)::before {
    display: none;
}

.rux-message-group--self :deep(.rux-message:first-child)::before,
.rux-message-group--other :deep(.rux-message:last-child)::before {
    display: block;
}

.rux-message-group--self :deep(.rux-message:not(:first-child)) {
    border-start-end-radius: var(--rui-surface-shape-start-end);
}

.rux-message-group--other :deep(.rux-message:not(:last-child)) {
    border-end-start-radius: var(--rui-surface-shape-end-start);
}

.rux-message-group--self :deep(.rux-message:not(:first-child) .rui-ripple-surface),
.rux-message-group--other :deep(.rux-message:not(:last-child) .rui-ripple-surface) {
    overflow: hidden;
    border-radius: inherit;
    clip-path: none;
}
</style>
