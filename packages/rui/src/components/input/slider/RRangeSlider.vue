<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RRangeSliderProps, RSliderRangeValue } from "./types.ts"

import RSliderBase from "./RSliderBase.vue"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RRangeSliderProps>(), {
    disabled: false,
    max: 100,
    min: 0,
    showTicks: false,
    step: 0,
})
const model = defineModel<RSliderRangeValue>()
const emit = defineEmits<{
    change: [value: RSliderRangeValue]
}>()
const attrs = useAttrs()
const resolvedModel = computed<RSliderRangeValue>(() => model.value ?? [props.min, props.max])
</script>

<template>
    <RSliderBase
        v-bind="attrs"
        :model-value="resolvedModel"
        mode="range"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        :disabled="disabled"
        :end-aria-label="endAriaLabel"
        :format-value="formatValue"
        :max="max"
        :min="min"
        :show-ticks="showTicks"
        :start-aria-label="startAriaLabel"
        :step="step"
        @update:model-value="model = $event as RSliderRangeValue"
        @change="emit('change', $event as RSliderRangeValue)"
    />
</template>
