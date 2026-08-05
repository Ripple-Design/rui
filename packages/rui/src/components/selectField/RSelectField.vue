<script setup lang="ts">
import { RIArrowDropDownFilled, RIArrowDropUpFilled } from "@ripple-design/icons"
import { computed, provide, ref, toRaw, useAttrs, useId, watch } from "vue"

import { RIconButton } from "@/components"
import RFieldShell from "@/components/input/RFieldShell.vue"
import RMenu from "@/components/menu/RMenu.vue"
import RMenuGroup from "@/components/menu/RMenuGroup.vue"

import type { RippleOptions } from "@/foundations/ripple"
import type { RSelectOptionRecord } from "./context"
import type { RSelectFieldProps } from "./types"

import { selectContextKey } from "./context"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RSelectFieldProps>(), {
    align: "start",
    disabled: false,
    filterable: false,
})

const attrs = useAttrs()
const model = defineModel<unknown>()
const listboxId = useId()
const generatedId = useId()
const controlId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const helperId = computed(() => `${controlId.value}-helper`)
const describedBy = computed(() => {
    const external = typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : ""
    const ids = [external, props.helperText?.trim() ? helperId.value : ""]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const error = computed(() => !!props.errorText?.trim())
const labelId = `${controlId.value}-label`
const shellRef = ref<InstanceType<typeof RFieldShell> | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const options = ref<RSelectOptionRecord[]>([])
const activeOptionId = ref<string | null>(null)
const open = ref(false)
const isFocused = ref(false)
const filterText = ref("")
const fieldRef = computed(() => shellRef.value?.element ?? null)

const optionMatchesModel = (option: RSelectOptionRecord) => Object.is(toRaw(option.value), toRaw(model.value))
const selectedOption = computed(() => options.value.find(optionMatchesModel))
const normalizedFilterText = computed(() => filterText.value.trim().toLocaleLowerCase())
const filteredOptions = computed(() => {
    if (!props.filterable || !normalizedFilterText.value) {
        return options.value
    }

    return options.value.filter((option) => option.label.toLocaleLowerCase().includes(normalizedFilterText.value))
})
const hasValue = computed(() => selectedOption.value !== undefined || (props.filterable && !!filterText.value))
const isFloating = computed(() => isFocused.value || open.value || hasValue.value)
const displayText = computed(() => (props.filterable ? filterText.value : selectedOption.value?.label ?? props.placeholder ?? ""))
const hasLabel = computed(() => !!props.label?.trim())
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: props.disabled || props.filterable,
    contrast: "low",
}))

provide(selectContextKey, {
    activeOptionId,
    commit,
    isOptionVisible(label) {
        return !props.filterable || !normalizedFilterText.value || label.toLocaleLowerCase().includes(normalizedFilterText.value)
    },
    isSelected(value) {
        return Object.is(toRaw(value), toRaw(model.value))
    },
    register(option) {
        const index = options.value.findIndex((item) => item.id === option.id)
        if (index === -1) {
            options.value.push(option)
        } else {
            options.value[index] = option
        }

        if (open.value && activeOptionId.value == null) {
            setInitialActiveOption()
        }
    },
    unregister(id) {
        options.value = options.value.filter((option) => option.id !== id)
        if (activeOptionId.value === id) {
            activeOptionId.value = null
        }
    },
})

function setInitialActiveOption() {
    const selected = filteredOptions.value.find((option) => optionMatchesModel(option) && !option.disabled)
    activeOptionId.value = selected?.id ?? filteredOptions.value.find((option) => !option.disabled)?.id ?? null
}

function openSelect() {
    if (props.disabled) {
        return
    }

    setInitialActiveOption()
    open.value = true
}

function restoreFilterText() {
    filterText.value = selectedOption.value?.label ?? ""
}

function close(restoreFocus = true) {
    open.value = false
    activeOptionId.value = null
    if (props.filterable) {
        restoreFilterText()
    }
    if (restoreFocus) {
        triggerRef.value?.focus()
    }
}

function handleTriggerClick() {
    handleMenuOpenUpdate(!open.value)
}

function handleIconClick() {
    handleMenuOpenUpdate(!open.value)
}

function handleMenuOpenUpdate(value: boolean) {
    if (value) {
        openSelect()
    } else {
        close()
    }
}

function commit(option: RSelectOptionRecord) {
    if (option.disabled) {
        return
    }

    model.value = option.value
    if (props.filterable) {
        filterText.value = option.label
    }
    close()
}

function handleFilterInput() {
    if (props.disabled) {
        return
    }

    openSelect()
}

function handleTriggerKeyDown(event: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    if (event.key === "Tab") {
        close(false)
        return
    }

    if (event.key === "Escape" && open.value) {
        event.preventDefault()
        close()
        return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        openSelect()
    }
}

watch(
    () => model.value,
    () => {
        if (props.filterable && !open.value) {
            restoreFilterText()
        }
    },
    { immediate: true },
)

watch(filteredOptions, () => {
    if (open.value) {
        setInitialActiveOption()
    }
})
</script>

<template>
    <div class="rui-select-field">
        <RFieldShell
            ref="shellRef"
            :ripple="rippleOptions"
            :label="label"
            :focused="isFocused || open"
            :floating="isFloating"
            :has-value="hasValue"
            :input-id="controlId"
            :label-id="labelId"
            :helper-id="helperId"
            :helper-text="helperText"
            :error-text="errorText"
            :error="error"
            :required="required"
            :has-end-icon="!filterable"
            @focus-state-change="isFocused = $event"
        >
            <input
                v-if="filterable"
                :id="controlId"
                ref="triggerRef"
                v-bind="attrs"
                v-model="filterText"
                class="rui-select-field__trigger rui-select-field__trigger--filterable"
                type="text"
                role="combobox"
                :disabled="disabled"
                aria-autocomplete="list"
                :aria-haspopup="'listbox'"
                :aria-expanded="open ? 'true' : 'false'"
                :aria-controls="listboxId"
                :aria-labelledby="hasLabel ? labelId : undefined"
                :aria-describedby="describedBy"
                :aria-invalid="error ? 'true' : undefined"
                :aria-activedescendant="open && activeOptionId ? activeOptionId : undefined"
                :placeholder="placeholder"
                @input="handleFilterInput"
                @focus="isFocused = true"
                @keydown="handleTriggerKeyDown"
                @blur="isFocused = false"
            />
            <button
                v-else
                :id="controlId"
                ref="triggerRef"
                v-bind="attrs"
                class="rui-select-field__trigger"
                type="button"
                role="combobox"
                :disabled="disabled"
                :aria-haspopup="'listbox'"
                :aria-expanded="open ? 'true' : 'false'"
                :aria-controls="listboxId"
                :aria-labelledby="hasLabel ? labelId : undefined"
                :aria-describedby="describedBy"
                :aria-invalid="error ? 'true' : undefined"
                :required="required"
                :aria-activedescendant="open && activeOptionId ? activeOptionId : undefined"
                @click="handleTriggerClick"
                @focus="isFocused = true"
                @keydown="handleTriggerKeyDown"
                @blur="isFocused = false"
            >
                <span class="rui-select-field__value" :class="{ 'rui-select-field__value--placeholder': !hasValue }">
                    {{ displayText }}
                </span>
            </button>

        <template #end-icon>
            <RIconButton
                v-if="!filterable"
                :icon="open ? RIArrowDropUpFilled : RIArrowDropDownFilled"
                :label="open ? 'Close options' : 'Open options'"
                :pressed="open"
                :disabled="disabled"
                :style="{
                    '--rui-icon-button-color':
                        isFocused || open ? 'var(--rui-sys-color-primary)' : 'var(--rui-sys-color-on-surface-medium)',
                }"
                @click.stop="handleIconClick"
            />
        </template>
        </RFieldShell>

        <RMenu
            mode="listbox"
            :id="listboxId"
            :open="open"
            :disabled="disabled"
            :match-width="true"
            :reference="fieldRef"
            :align="align"
            @update:open="handleMenuOpenUpdate"
        >
            <RMenuGroup>
                <slot />
            </RMenuGroup>
        </RMenu>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/normalize";
@use "@/styles/typography";

.rui-select-field {
    min-inline-size: 0;
}

.rui-select-field__trigger {
    @include normalize.button;
    @include typography.subtitle1("--rui-comp-select-field-trigger-text");

    --rui-comp-select-field-trigger-color: #{color.$on-surface-high};
    --rui-comp-select-field-placeholder-color: #{color.$on-surface-medium};

    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-inline-size: 0;
    block-size: density.withDecrement(56px, --rui-comp-text-field-density);
    padding-inline: 16px 4px;
    color: var(--rui-comp-select-field-trigger-color);
    text-align: start;

    &--filterable {
        @include normalize.input;

        cursor: text;
    }

    &::placeholder {
        color: var(--rui-comp-select-field-placeholder-color);
    }
}

.rui-select-field__value {
    @include typography.overflowEllipsis;

    min-inline-size: 0;
    flex: 1 1 auto;

    &--placeholder {
        color: var(--rui-comp-select-field-placeholder-color);
    }
}
</style>
