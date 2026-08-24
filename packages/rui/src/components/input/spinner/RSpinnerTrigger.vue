<script setup lang="ts">
import { RIArrowDropDownFilled, RIArrowDropUpFilled } from "@ripple-design/icons"
import { computed, useAttrs } from "vue"

import type { RTextEmphasis, RTextVariant } from "@/components/base/text/types.ts"

import RIcon from "@/components/base/icon/RIcon.vue"
import RText from "@/components/base/text/RText.vue"
import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        activeOptionId?: string | null
        disabled?: boolean
        emphasis?: RTextEmphasis
        label?: string
        menu?: boolean
        open?: boolean
        variant?: RTextVariant
    }>(),
    {
        activeOptionId: null,
        disabled: false,
        emphasis: "medium",
        label: "",
        menu: true,
        open: false,
        variant: "body2",
    },
)

const attrs = useAttrs()
const triggerIcon = computed(() => (props.open ? RIArrowDropUpFilled : RIArrowDropDownFilled))
const rippleOptions = computed<RippleOptions>(() => ({
    contrast: "low",
    disabled: props.disabled,
}))
</script>

<template>
    <RTouchTargetWrapper :class="['rui-spinner__touch-target-wrapper', attrs.class]">
        <button
            v-bind="attrs"
            v-ripple="rippleOptions"
            class="rui-spinner rui-spinner__trigger"
            type="button"
            :role="menu ? 'combobox' : undefined"
            data-rui-touch-target-anchor
            :disabled="disabled"
            :aria-activedescendant="menu ? (activeOptionId ?? undefined) : undefined"
            :aria-required="menu ? 'true' : undefined"
        >
            <span
                class="rui-touch-target rui-touch-target--vertical rui-touch-target--interactive"
                aria-hidden="true"
            />
            <RText
                as="span"
                class="rui-spinner__value"
                :disabled="disabled"
                ellipsize="end"
                :emphasis="emphasis"
                :variant="variant"
            >
                {{ label }}
            </RText>
            <RIcon
                class="rui-spinner__icon"
                :icon="triggerIcon"
                :size="24"
                :emphasis="disabled ? 'low' : emphasis"
                decorative
            />
        </button>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/color";
@use "@/styles/density";
@use "@/styles/normalize";

.rui-spinner__touch-target-wrapper {
    @include density.touchTargetEnabled();

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-top: calc(6px * var(--rui-touch-target-enabled, 1));
    padding-bottom: calc(6px * var(--rui-touch-target-enabled, 1));
    vertical-align: middle;
}

.rui-spinner__trigger {
    --rui-spinner-density: #{density.$scale};
    --rui-spinner-height: #{density.withDecrement(36px, --rui-spinner-density)};

    @include normalize.button;

    position: relative;
    display: inline-flex;
    justify-content: end;
    align-items: center;
    min-inline-size: 64px;
    min-block-size: var(--rui-spinner-height);
    padding-block: 4px;
    padding-inline: 12px 8px;
    border-radius: 4px;
    text-align: start;

    &:focus-visible {
        outline: 2px solid color.$primary;
        outline-offset: 2px;
    }

    &:disabled {
        color: color.$on-surface-low;
        cursor: default;
    }
}
</style>
