<script setup lang="ts">
import type { RRowProps } from "./types"

import RStack from "./RStack.vue"

const props = defineProps<RRowProps>()
</script>

<template>
    <RStack v-bind="props" direction="row">
        <slot />
    </RStack>
</template>
