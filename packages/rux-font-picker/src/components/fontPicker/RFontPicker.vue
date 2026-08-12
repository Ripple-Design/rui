<script setup lang="ts">
import { RSelectField } from "@ripple-design/rui"
import { computed, useAttrs } from "vue"

import type { RFontPickerProps } from "./types"

defineOptions({ inheritAttrs: false })

const props = defineProps<RFontPickerProps>()

const model = defineModel<string | null>()
const attrs = useAttrs()
const fieldProps = computed(() => ({
    ...attrs,
    label: props.label,
    placeholder: props.placeholder,
    disabled: props.disabled,
    align: props.align,
    helperText: props.helperText,
    errorText: props.errorText,
    required: props.required,
}))
</script>

<template>
    <RSelectField v-bind="fieldProps" v-model="model" class="rui-font-picker">
        <slot />
    </RSelectField>
</template>
