<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, useAttrs, watch } from "vue"

import { listBoxContextKey } from "@/components/internal/listBox/types.ts"
import { useListBoxSelection } from "@/components/internal/listBox/useListBoxSelection.ts"
import RMenu from "@/components/overlays/menu/RMenu.vue"
import RMenuGroup from "@/components/overlays/menu/RMenuGroup.vue"

import type { RSpinnerProps } from "./types.ts"

import RSpinnerTrigger from "./RSpinnerTrigger.vue"

const props = withDefaults(defineProps<RSpinnerProps>(), {
    align: "start",
    disabled: false,
    emphasis: "medium",
    variant: "body2",
})

const model = defineModel<unknown>({ required: true })
const attrs = useAttrs()
const open = ref(false)
const validationReady = ref(false)
const listBox = useListBoxSelection({
    model,
    onCommit(option) {
        if (!option.disabled) {
            model.value = option.value
        }
    },
    onOptionsChange: validateSelection,
})
const { activeOptionId, selectedOption } = listBox
const displayLabel = computed(() => selectedOption.value?.label ?? "")

provide(listBoxContextKey, listBox.context)

function validateSelection() {
    if (!validationReady.value) {
        return
    }

    if (model.value == null || selectedOption.value == null) {
        throw new Error("RSpinner requires the model value to match a registered option.")
    }
}

function handleOpenUpdate(value: boolean) {
    open.value = value
    if (value) {
        listBox.setInitialActiveOption()
    }
}

onMounted(async () => {
    await nextTick()
    validationReady.value = true
    validateSelection()
})

watch(() => model.value, validateSelection, { flush: "post" })
</script>

<template>
    <RMenu
        mode="listbox"
        :align="align"
        :disabled="disabled"
        :match-width="true"
        :open="open"
        @update:open="handleOpenUpdate"
    >
        <template #trigger>
            <RSpinnerTrigger
                v-bind="attrs"
                :active-option-id="open ? activeOptionId : null"
                :disabled="disabled"
                :emphasis="emphasis"
                :label="displayLabel"
                :open="open"
                :variant="variant"
            />
        </template>

        <RMenuGroup>
            <slot />
        </RMenuGroup>
    </RMenu>
</template>
