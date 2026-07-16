<script setup lang="ts">
import type { RColumnProps } from "./types"

import RStack from "./RStack.vue"

const props = defineProps<RColumnProps>()
</script>

<template>
    <RStack v-bind="props" direction="column">
        <slot />
    </RStack>
</template>
