<script setup lang="ts">
import { RIArrowDropDownFilled, RIArrowDropUpFilled } from "@ripple-design/icons"
import { computed, provide, ref, toRaw, useAttrs, useId } from "vue"

import { RIconButton } from "@/components"
import RFieldShell from "@/components/input/RFieldShell.vue"
import RMenu from "@/components/menu/RMenu.vue"
import RMenuGroup from "@/components/menu/RMenuGroup.vue"

import type { RSelectOptionRecord } from "./context"
import type { RSelectFieldProps } from "./types"

import { selectContextKey } from "./context"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<RSelectFieldProps>(), {
    align: "start",
    disabled: false,
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
const labelId = `${controlId.value}-label`
const shellRef = ref<InstanceType<typeof RFieldShell> | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const options = ref<RSelectOptionRecord[]>([])
const activeOptionId = ref<string | null>(null)
const open = ref(false)
const isFocused = ref(false)
const fieldRef = computed(() => shellRef.value?.element ?? null)

const optionMatchesModel = (option: RSelectOptionRecord) => Object.is(toRaw(option.value), toRaw(model.value))
const selectedOption = computed(() => options.value.find(optionMatchesModel))
const hasValue = computed(() => selectedOption.value !== undefined)
const isFloating = computed(() => isFocused.value || open.value || hasValue.value)
const displayText = computed(() => selectedOption.value?.label ?? props.placeholder ?? "")
const hasLabel = computed(() => !!props.label?.trim())

provide(selectContextKey, {
    activeOptionId,
    commit,
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
    const selected = options.value.find((option) => optionMatchesModel(option) && !option.disabled)
    activeOptionId.value = selected?.id ?? options.value.find((option) => !option.disabled)?.id ?? null
}

function openSelect() {
    if (props.disabled) {
        return
    }

    setInitialActiveOption()
    open.value = true
}

function close(restoreFocus = true) {
    open.value = false
    activeOptionId.value = null
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
    close()
}

function handleTriggerKeyDown(event: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    if (event.key === "Tab") {
        close(false)
    }
}
</script>

<template>
    <RFieldShell
        ref="shellRef"
        :label="label"
        :focused="isFocused || open"
        :floating="isFloating"
        :has-value="hasValue"
        :input-id="controlId"
        :label-id="labelId"
        :helper-id="helperId"
        :helper-text="helperText"
        :has-end-icon="true"
        @focus-state-change="isFocused = $event"
    >
        <button
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
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/normalize";
@use "@/styles/typography";

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
