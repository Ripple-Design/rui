import { computed, ref, toRaw } from "vue"

import type { RListBoxContext, RListBoxOptionRecord, UseListBoxSelectionOptions } from "./types.ts"

export function useListBoxSelection({
    isOptionVisible = () => true,
    model,
    onCommit,
    onOptionsChange,
}: UseListBoxSelectionOptions) {
    const options = ref<RListBoxOptionRecord[]>([])
    const activeOptionId = ref<string | null>(null)
    const optionMatchesModel = (option: RListBoxOptionRecord) => Object.is(toRaw(option.value), toRaw(model.value))
    const selectedOption = computed(() => options.value.find(optionMatchesModel))
    const visibleOptions = computed(() => options.value.filter((option) => isOptionVisible(option.label)))

    function setInitialActiveOption() {
        const selected = visibleOptions.value.find((option) => optionMatchesModel(option) && !option.disabled)
        activeOptionId.value = selected?.id ?? visibleOptions.value.find((option) => !option.disabled)?.id ?? null
    }

    function register(option: RListBoxOptionRecord) {
        const index = options.value.findIndex((item) => item.id === option.id)
        if (index === -1) {
            options.value.push(option)
        } else {
            options.value[index] = option
        }

        if (activeOptionId.value == null) {
            setInitialActiveOption()
        }

        onOptionsChange?.()
    }

    function unregister(id: string) {
        options.value = options.value.filter((option) => option.id !== id)
        if (activeOptionId.value === id) {
            activeOptionId.value = null
        }

        onOptionsChange?.()
    }

    const context: RListBoxContext = {
        activeOptionId,
        commit: onCommit,
        isOptionVisible,
        isSelected(value) {
            return Object.is(toRaw(value), toRaw(model.value))
        },
        register,
        unregister,
    }

    return {
        activeOptionId,
        context,
        options,
        selectedOption,
        setInitialActiveOption,
        visibleOptions,
    }
}
