<script setup lang="ts">
import { RIArrowDropDownFilled, RIArrowDropUpFilled } from "@ripple-design/icons"
import { computed, nextTick, onBeforeUnmount, provide, ref, toRef, unref, useAttrs, useId, watch } from "vue"

import type { RippleOptions } from "@/foundations/ripple"

import { RIconButton } from "@/components"
import RFieldShell from "@/components/internal/input/RFieldShell.vue"
import { useFormField } from "@/components/layout/form/useFormField.ts"
import RMenu from "@/components/overlays/menu/RMenu.vue"
import RMenuGroup from "@/components/overlays/menu/RMenuGroup.vue"

import type { RListBoxOptionRecord } from "@/components/internal/listBox/types.ts"
import type { RSelectFieldProps } from "./types.ts"

import { useListBoxSelection } from "@/components/internal/listBox/useListBoxSelection.ts"
import { listBoxContextKey } from "@/components/internal/listBox/types.ts"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RSelectFieldProps>(), {
    align: "start",
    disabled: false,
    filterable: false,
})

const attrs = useAttrs()
const localModel = defineModel<unknown>()
const name = computed(() => (typeof attrs.name === "string" ? attrs.name : undefined))
const formField = useFormField({
    defaultValue: null,
    model: localModel,
    name,
    required: toRef(props, "required"),
})
const model = formField.model
const triggerAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "name")))
const listboxId = useId()
const generatedId = useId()
const controlId = computed(() => (typeof attrs.id === "string" ? attrs.id : generatedId))
const helperId = computed(() => `${controlId.value}-helper`)
const externalErrorText = computed(() => unref(props.errorText))
const errorText = computed(() => externalErrorText.value ?? formField.errorText.value)
const error = computed(() => !!errorText.value?.trim())
const required = formField.required
const describedBy = computed(() => {
    const external = typeof attrs["aria-describedby"] === "string" ? attrs["aria-describedby"] : ""
    const ids = [
        external,
        errorText.value?.trim() || props.helperText?.trim() || formField.helperIndicator.value ? helperId.value : "",
    ]
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
    return [...new Set(ids)].join(" ") || undefined
})
const labelId = `${controlId.value}-label`
const shellRef = ref<InstanceType<typeof RFieldShell> | null>(null)
const menuRef = ref<InstanceType<typeof RMenu> | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const open = ref(false)
const restoreMenuFocus = ref(true)
const isFocused = ref(false)
const filterText = ref("")
const fieldRef = computed(() => shellRef.value?.element ?? null)
const matchMenuWidth = ref(false)
const menuWidth = ref<number | null>(null)
let measureFrame = 0
let measurementGeneration = 0

const normalizedFilterText = computed(() => filterText.value.trim().toLocaleLowerCase())
const listBox = useListBoxSelection({
    isOptionVisible(label) {
        return !props.filterable || !normalizedFilterText.value || label.toLocaleLowerCase().includes(normalizedFilterText.value)
    },
    model,
    onCommit: commit,
    onOptionsChange: scheduleMenuWidthMeasurement,
})
const { activeOptionId, selectedOption, visibleOptions: filteredOptions } = listBox
const hasValue = computed(() => selectedOption.value !== undefined || (props.filterable && !!filterText.value))
const isFloating = computed(() => isFocused.value || open.value || hasValue.value)
const displayText = computed(() =>
    props.filterable ? filterText.value : (selectedOption.value?.label ?? props.placeholder ?? ""),
)
const hasLabel = computed(() => !!props.label?.trim())
const rippleOptions = computed<RippleOptions>(() => ({
    disabled: props.disabled || props.filterable,
    contrast: "low",
}))

provide(listBoxContextKey, listBox.context)

function openSelect() {
    console.log("[RSelectField] open", { disabled: props.disabled })
    if (props.disabled) {
        return
    }

    restoreMenuFocus.value = true
    listBox.setInitialActiveOption()
    ++measurementGeneration
    cancelAnimationFrame(measureFrame)
    measureFrame = 0
    menuWidth.value = null
    matchMenuWidth.value = false
    open.value = true
    void measureMenuWidth()
}

async function measureMenuWidth() {
    const generation = ++measurementGeneration
    console.log("[RSelectField] measurement start", { generation, open: open.value })
    if (!open.value) {
        return
    }

    if (matchMenuWidth.value) {
        matchMenuWidth.value = false
        menuWidth.value = null
        await nextTick()
        if (!open.value || generation !== measurementGeneration) {
            return
        }
    }

    await nextTick()
    if (!open.value || generation !== measurementGeneration) {
        return
    }

    await menuRef.value?.updatePosition()
    if (!open.value || generation !== measurementGeneration) {
        return
    }

    const menuElement = menuRef.value?.element
    const fieldElement = fieldRef.value
    console.log("[RSelectField] measurement elements", { fieldElement, menuElement })
    if (!(menuElement instanceof HTMLElement) || !(fieldElement instanceof HTMLElement)) {
        console.log("[RSelectField] measurement aborted: missing element")
        return
    }

    const measuredWidth = menuElement.getBoundingClientRect().width
    const fieldWidth = fieldElement.getBoundingClientRect().width
    console.log("[RSelectField] natural widths", { fieldWidth, measuredWidth })

    if (measuredWidth <= fieldWidth + 0.5) {
        menuWidth.value = null
    } else {
        menuWidth.value = Math.ceil(measuredWidth)
    }

    matchMenuWidth.value = true
    await nextTick()
    if (!open.value || generation !== measurementGeneration) {
        return
    }

    await menuRef.value?.updatePosition()
}

function scheduleMenuWidthMeasurement() {
    if (!open.value || typeof requestAnimationFrame === "undefined") {
        return
    }

    cancelAnimationFrame(measureFrame)
    measureFrame = requestAnimationFrame(() => {
        measureFrame = 0
        void measureMenuWidth()
    })
}

function restoreFilterText() {
    filterText.value = selectedOption.value?.label ?? ""
}

function close(restoreFocus = true) {
    ++measurementGeneration
    cancelAnimationFrame(measureFrame)
    measureFrame = 0
    open.value = false
    matchMenuWidth.value = false
    menuWidth.value = null
    activeOptionId.value = null
    if (props.filterable) {
        restoreFilterText()
    }
    if (restoreFocus) {
        triggerRef.value?.focus()
    } else {
        triggerRef.value?.blur()
    }
}

function handleMenuReady() {
    console.log("[RSelectField] menu ready", { open: open.value })
    if (open.value) {
        void measureMenuWidth()
    }
}

function handleFocusStateChange(focused: boolean) {
    isFocused.value = focused

    if (!focused) {
        formField.onBlur()
    }
}

function handleTriggerClick() {
    handleMenuOpenUpdate(!open.value)
}

function handleMenuOpenUpdate(value: boolean) {
    if (value) {
        openSelect()
    } else {
        close()
    }
}

function commit(option: RListBoxOptionRecord) {
    if (option.disabled) {
        return
    }

    formField.setValue(option.value, "change")
    if (props.filterable) {
        filterText.value = option.label
    }
    restoreMenuFocus.value = false
    close(false)
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
        listBox.setInitialActiveOption()
        scheduleMenuWidthMeasurement()
    }
})

onBeforeUnmount(() => {
    ++measurementGeneration
    cancelAnimationFrame(measureFrame)
})
</script>

<template>
    <div
        class="rui-select-field"
        :style="{ '--rui-comp-select-field-menu-width': menuWidth ? `${menuWidth}px` : undefined }"
    >
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
            :helper-indicator="formField.helperIndicator.value"
            :error-text="errorText"
            :error="error"
            :required="required"
            :label-suffix="formField.labelSuffix.value"
            :has-end-icon="true"
            @focus-state-change="handleFocusStateChange"
        >
            <input
                v-if="filterable"
                :id="controlId"
                ref="triggerRef"
                v-bind="triggerAttrs"
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
                :aria-required="required ? 'true' : undefined"
                :aria-activedescendant="open && activeOptionId ? activeOptionId : undefined"
                :placeholder="placeholder"
                @click="openSelect"
                @input="handleFilterInput"
                @focus="isFocused = true"
                @keydown="handleTriggerKeyDown"
                @blur="isFocused = false"
            />
            <button
                v-else
                :id="controlId"
                ref="triggerRef"
                v-bind="triggerAttrs"
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
                :aria-required="required ? 'true' : undefined"
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
                    :model-value="open"
                    :icon="RIArrowDropDownFilled"
                    :active-icon="RIArrowDropUpFilled"
                    :label="open ? 'Close options' : 'Open options'"
                    :disabled="disabled"
                    :style="{
                        '--rui-icon-button-color': error
                            ? 'var(--rui-sys-color-error)'
                            : isFocused || open
                              ? 'var(--rui-sys-color-primary)'
                              : 'var(--rui-sys-color-on-surface-medium)',
                    }"
                    @update:model-value="handleMenuOpenUpdate"
                    @click.stop
                />
            </template>
        </RFieldShell>

        <RMenu
            mode="listbox"
            :id="listboxId"
            :open="open"
            :disabled="disabled"
            :match-width="matchMenuWidth"
            :reference="fieldRef"
            :restore-focus="restoreMenuFocus"
            :align="align"
            @ready="handleMenuReady"
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
    min-inline-size: max(112px, var(--rui-comp-select-field-menu-width, 0px));
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
