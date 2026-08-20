<script setup lang="ts">
import { useAttrs } from "vue"

import type { RSliderProps } from "./types.ts"

import RSliderBase from "./RSliderBase.vue"

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<RSliderProps>(), {
    disabled: false,
    max: 100,
    min: 0,
    showTicks: false,
    step: 0,
})
const model = defineModel<number>({ default: 0 })
const emit = defineEmits<{
    change: [value: number]
}>()
const attrs = useAttrs()
</script>

<template>
    <RSliderBase
        v-bind="attrs"
        v-model="model"
        mode="single"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        :disabled="disabled"
        :format-value="formatValue"
        :max="max"
        :min="min"
        :show-ticks="showTicks"
        :step="step"
        @change="emit('change', $event as number)"
    />
</template>
