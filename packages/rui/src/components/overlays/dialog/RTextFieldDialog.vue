<script setup lang="ts">
import { computed, useAttrs } from "vue"

import type { RModalCloseDetail } from "@/primitives/modal/types.ts"

import RTextField from "@/components/input/textField/RTextField.vue"

import type { RTextFieldDialogProps } from "./types.ts"

import RDialog from "./RDialog.vue"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Omit<RTextFieldDialogProps, "modelValue" | "value">>(), {
    closeOnEscape: true,
    closeOnBackdrop: true,
    returnFocus: true,
    role: "dialog",
    width: "auto",
    height: "auto",
})
const open = defineModel<boolean>({ default: false })
const value = defineModel<string>("value")
const attrs = useAttrs()
const initialFocus = computed(() => props.initialFocus ?? ".rui-input")

const emit = defineEmits<{
    (e: "before-open"): void
    (e: "open"): void
    (e: "before-close", detail: RModalCloseDetail): void
    (e: "close", detail: RModalCloseDetail): void
    (e: "after-close"): void
}>()
</script>

<template>
    <RDialog
        :model-value="open"
        :close-on-escape="closeOnEscape"
        :close-on-backdrop="closeOnBackdrop"
        :return-focus="returnFocus"
        :initial-focus="initialFocus"
        :role="role"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="ariaDescribedBy"
        :width="width"
        :height="height"
        :title="title"
        :positive="positive"
        :negative="negative"
        class="rui-text-field-dialog"
        @update:model-value="open = $event"
        @before-open="emit('before-open')"
        @open="emit('open')"
        @before-close="emit('before-close', $event)"
        @close="emit('close', $event)"
        @after-close="emit('after-close')"
    >
        <div class="rui-text-field-dialog__content">
            <RTextField
                v-bind="attrs"
                v-model="value"
                :label="label"
                :text-area="textArea"
                :placeholder="placeholder"
                :start-icon="startIcon"
                :end-icon="endIcon"
                :clearable="clearable"
                :clear-label="clearLabel"
                :helper-text="helperText"
                :error-text="errorText"
                :required="required"
            />
        </div>
    </RDialog>
</template>

<style scoped lang="scss">
.rui-text-field-dialog__content {
    padding-block-end: 20px;
}

:global(.rui-dialog:not(.rui-dialog--with-header)) .rui-text-field-dialog__content {
    padding-block-start: 24px;
}
</style>
