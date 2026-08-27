<script setup lang="ts">
import { useAttrs } from "vue"

import type { RRowProps } from "./types.ts"

import RStack from "./RStack.vue"

defineOptions({ inheritAttrs: false })

const props = defineProps<RRowProps>()
const attrs = useAttrs()
</script>

<template>
    <RStack v-bind="{ ...attrs, ...props }" direction="row">
        <slot />
    </RStack>
</template>
