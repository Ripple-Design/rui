<script setup lang="ts">
import { RSelectOption } from "@ripple-design/rui"
import { computed, useAttrs } from "vue"

import type { RFontOptionProps } from "./types"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RFontOptionProps>(), {
    disabled: false,
})

const attrs = useAttrs()
const labelStyle = computed(() => ({ fontFamily: props.fontFamily }))
</script>

<template>
    <RSelectOption
        v-bind="attrs"
        :value="value"
        :label="label"
        :disabled="disabled"
    >
        <span :style="labelStyle">{{ label }}</span>
    </RSelectOption>
</template>
