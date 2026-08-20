<script setup lang="ts">
import RButtonRow from "@/components/actions/button/RButtonRow.vue"
import RText from "@/components/base/text/RText.vue"

import type { RCardHeaderProps } from "./types.ts"

defineProps<RCardHeaderProps>()
</script>

<template>
    <header class="rui-card-header">
        <span v-if="title || text" class="rui-card-header__copy">
            <RText v-if="title" as="h6" class="rui-card-header__title" variant="headline6">{{ title }}</RText>
            <RText v-if="text" as="p" class="rui-card-header__text" variant="body2" emphasis="medium">{{ text }}</RText>
        </span>
        <RButtonRow v-if="$slots.actions" class="rui-card-header__actions"><slot name="actions" /></RButtonRow>
    </header>
</template>

<style scoped lang="scss">
.rui-card-header {
    display: flex;
    align-items: flex-start;
    padding: 0;
}

.rui-card-header__copy {
    display: block;
    flex: 1;
    min-inline-size: 0;
    margin-inline: 16px;
    margin-block-end: 16px;
}

.rui-card-header__title,
.rui-card-header__text {
    margin: 0;
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
}

.rui-card-header__title {
    margin-block-start: calc(34px - 1cap);
}

.rui-card-header__text {
    margin-block-start: calc(22px - 1cap);
}

.rui-card-header__actions {
    flex: 0 0 auto;
    align-self: center;
}
</style>
