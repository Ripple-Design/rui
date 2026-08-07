<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs, watch } from "vue"

import { vRipple, type RippleOptions } from "@/foundations/ripple"
import { RTouchTargetWrapper } from "@/foundations/touchTarget"

import type { RCheckboxProps } from "./types"

const props = withDefaults(defineProps<RCheckboxProps>(), {
    disabled: false,
    indeterminate: false,
    ripple: true,
})

const model = defineModel<boolean>({ default: false })
const attrs = useAttrs()
const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const dotLottie = shallowRef<any>(null)
const playerComponent = shallowRef<any>(null)
const playerReady = ref(false)
const playerFailed = ref(false)
const mounted = ref(false)
type CheckboxFrameTarget = "start" | "end"
type CheckboxActionMode = "static" | "transition"
type CheckboxPendingAction = {
    animationId: string
    frameTarget: CheckboxFrameTarget
    mode: CheckboxActionMode
}

const staticAnimationMap: Record<CheckboxVisualState, { animationId: string; frameTarget: CheckboxFrameTarget }> = {
    unchecked: { animationId: "unchecked-to-checked", frameTarget: "start" },
    checked: { animationId: "unchecked-to-checked", frameTarget: "end" },
    indeterminate: { animationId: "unchecked-to-indeterminate", frameTarget: "end" },
}
const transitionAnimationMap: Record<string, string> = {
    "unchecked->checked": "unchecked-to-checked",
    "checked->unchecked": "checked-to-unchecked",
    "unchecked->indeterminate": "unchecked-to-indeterminate",
    "indeterminate->unchecked": "indeterminate-to-unchecked",
    "checked->indeterminate": "checked-to-indeterminate",
    "indeterminate->checked": "indeterminate-to-checked",
}

let pendingAction: CheckboxPendingAction | null = null
let playerModule: any = null
let loadListener: (() => void) | null = null
let completeListener: (() => void) | null = null

const assetUrl = new URL("./assets/checkbox-transitions.lottie", import.meta.url).href

type CheckboxVisualState = "unchecked" | "checked" | "indeterminate"
const visualState = computed<CheckboxVisualState>(() => {
    if (props.indeterminate) {
        return "indeterminate"
    }

    return model.value ? "checked" : "unchecked"
})
const indicatorColor = computed(() => {
    if (props.disabled) {
        return "var(--rui-sys-color-on-surface-low)"
    }

    return visualState.value === "unchecked" ? "var(--rui-sys-color-on-surface-medium)" : "var(--rui-sys-color-primary)"
})
const rippleOptions = computed<RippleOptions>(() => {
    if (props.ripple === false) {
        return { disabled: true }
    }

    const options = props.ripple === true ? {} : props.ripple
    return {
        ...options,
        disabled: props.disabled || !!options?.disabled,
    }
})

const fallbackPath = computed(() => {
    if (visualState.value === "checked") {
        return "M 7 -9 c 0 0 -14 0 -14 0 c -1.1045 0 -2 0.8955 -2 2 c 0 0 0 14 0 14 c 0 1.1045 0.8955 2 2 2 c 0 0 14 0 14 0 c 1.1045 0 2 -0.8955 2 -2 c 0 0 0 -14 0 -14 c 0 -1.1045 -0.8955 -2 -2 -2 Z M -2 5 c 0 0 -5 -5 -5 -5 c 0 0 1.4141 -1.4141 1.4141 -1.4141 c 0 0 3.5859 3.586 3.5859 3.586 c 0 0 7.5859 -7.586 7.5859 -7.586 c 0 0 1.4141 1.4141 1.4141 1.4141 c 0 0 -9 9 -9 9 Z"
    }

    if (visualState.value === "indeterminate") {
        return "M -6 -1 l 12 0 l 0 2 l -12 0 Z M 7 -9 c 0 0 -14 0 -14 0 c -1.1045 0 -2 0.8955 -2 2 c 0 0 0 14 0 14 c 0 1.1045 0.8955 2 2 2 c 0 0 14 0 14 0 c 1.1045 0 2 -0.8955 2 -2 c 0 0 0 -14 0 -14 c 0 -1.1045 -0.8955 -2 -2 -2 Z"
    }

    return "M -7 -7 h 14 v 14 h -14 Z M 7 -9 c 0 0 -14 0 -14 0 c -1.1045 0 -2 0.8955 -2 2 c 0 0 0 14 0 14 c 0 1.1045 0.8955 2 2 2 c 0 0 14 0 14 0 c 1.1045 0 2 -0.8955 2 -2 c 0 0 0 -14 0 -14 c 0 -1.1045 -0.8955 -2 -2 -2 Z"
})

function syncInput() {
    if (input.value) {
        input.value.indeterminate = props.indeterminate
    }
}

function getPlayer() {
    return dotLottie.value?.getDotLottieInstance?.() ?? null
}

function parseCssColorToLottieRgba(colorValue: string) {
    const parser = document.createElement("canvas").getContext("2d")
    if (!parser) {
        return null
    }

    parser.fillStyle = "#000000"
    parser.fillStyle = colorValue.trim()
    const normalized = parser.fillStyle

    if (normalized.startsWith("#")) {
        const hex = normalized.slice(1)
        if (hex.length === 6 || hex.length === 8) {
            return [Number.parseInt(hex.slice(0, 2), 16) / 255, Number.parseInt(hex.slice(2, 4), 16) / 255, Number.parseInt(hex.slice(4, 6), 16) / 255, hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1]
        }

        if (hex.length === 3 || hex.length === 4) {
            return [Number.parseInt(`${hex[0]}${hex[0]}`, 16) / 255, Number.parseInt(`${hex[1]}${hex[1]}`, 16) / 255, Number.parseInt(`${hex[2]}${hex[2]}`, 16) / 255, hex.length === 4 ? Number.parseInt(`${hex[3]}${hex[3]}`, 16) / 255 : 1]
        }
    }

    const match = normalized.match(/[\d.]+/g)
    if (!match || match.length < 3) {
        return null
    }

    return [Number(match[0]) / 255, Number(match[1]) / 255, Number(match[2]) / 255, match[3] ? Number(match[3]) : 1]
}

function resolveThemeData() {
    const rgba = parseCssColorToLottieRgba(getComputedStyle(root.value ?? document.documentElement).color)
    if (!rgba) {
        return undefined
    }

    const red = rgba[0] ?? 0
    const green = rgba[1] ?? 0
    const blue = rgba[2] ?? 0
    const alpha = rgba[3] ?? 1
    return JSON.stringify({
        rules: [{ id: "themeColor", type: "Color", value: [red, green, blue] }, { id: "themeOpacity", type: "Scalar", value: alpha * 100 }],
    })
}

function applyThemeData() {
    const player = getPlayer()
    const themeData = resolveThemeData()
    if (player && themeData) {
        player.setThemeData(themeData)
    }
}

function resolveFrame(target: CheckboxFrameTarget) {
    const player = getPlayer()
    if (!player || target === "start") {
        return 0
    }

    return Math.max(player.totalFrames - 1, 0)
}

function flushPendingAction() {
    const player = getPlayer()
    const action = pendingAction
    if (!player || !action || !player.isLoaded) {
        return
    }

    if (player.activeAnimationId !== action.animationId) {
        player.loadAnimation(action.animationId)
        return
    }

    applyThemeData()

    if (action.mode === "static") {
        player.pause()
        player.setFrame(resolveFrame(action.frameTarget))
        pendingAction = null
        return
    }

    pendingAction = null
    player.setFrame(0)
    player.play()
}

function queueStaticState(state: CheckboxVisualState) {
    const animation = staticAnimationMap[state]
    pendingAction = { ...animation, mode: "static" }
    flushPendingAction()
}

function queueTransition(from: CheckboxVisualState, to: CheckboxVisualState) {
    const animationId = transitionAnimationMap[`${from}->${to}`]
    if (!animationId) {
        queueStaticState(to)
        return
    }

    pendingAction = { animationId, frameTarget: "end", mode: "transition" }
    flushPendingAction()
}

function handleLoad() {
    playerReady.value = true
    flushPendingAction()
}

function handleComplete() {
    const player = getPlayer()
    if (player) {
        player.pause()
        player.setFrame(resolveFrame("end"))
    }
}

async function loadOptionalPlayer() {
    try {
        playerModule = await import("@lottiefiles/dotlottie-vue")
        playerComponent.value = playerModule.DotLottieVue
    } catch {
        playerFailed.value = true
    }
}

function bindPlayer() {
    const player = getPlayer()
    if (!player) {
        return
    }

    loadListener = handleLoad
    completeListener = handleComplete
    player.addEventListener("load", loadListener)
    player.addEventListener("complete", completeListener)
    if (player.isLoaded) {
        flushPendingAction()
    }
}

watch(
    visualState,
    (nextState, oldState) => {
        syncInput()

        if (!mounted.value || oldState === undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            queueStaticState(nextState)
            return
        }

        queueTransition(oldState, nextState)
    },
    { immediate: true, flush: "post" },
)

watch(
    dotLottie,
    (instance) => {
        if (instance) {
            bindPlayer()
        }
    },
    { flush: "post" },
)

onMounted(async () => {
    await nextTick()
    mounted.value = true
    await loadOptionalPlayer()
})

onBeforeUnmount(() => {
    const player = getPlayer()
    if (player && loadListener) player.removeEventListener("load", loadListener)
    if (player && completeListener) player.removeEventListener("complete", completeListener)
    player?.destroy?.()
})
</script>

<template>
    <RTouchTargetWrapper class="rui-checkbox__touch-target-wrapper">
        <label
            ref="root"
            class="rui-checkbox"
            :class="{
                'rui-checkbox--checked': model,
                'rui-checkbox--indeterminate': indeterminate,
                'rui-checkbox--disabled': disabled,
                'rui-checkbox--player-ready': playerReady,
            }"
            :style="{ '--rui-comp-checkbox-indicator-color': indicatorColor }"
        >
            <span v-ripple="rippleOptions" class="rui-checkbox__control">
                <input
                    ref="input"
                    v-bind="attrs"
                    class="rui-checkbox__native-control"
                    type="checkbox"
                    :checked="model"
                    :disabled="disabled"
                    :aria-checked="indeterminate ? 'mixed' : undefined"
                    @change="model = ($event.currentTarget as HTMLInputElement).checked"
                />
                <span class="rui-checkbox__content" aria-hidden="true">
                    <svg class="rui-checkbox__fallback" viewBox="-9 -9 18 18">
                        <path :d="fallbackPath" fill="currentColor" fill-rule="evenodd" />
                    </svg>
                    <component
                        :is="playerComponent"
                        v-if="playerComponent && !playerFailed"
                        ref="dotLottie"
                        class="rui-checkbox__lottie"
                        :src="assetUrl"
                        :autoplay="false"
                        :loop="false"
                        :use-frame-interpolation="true"
                        aria-hidden="true"
                        @load="bindPlayer"
                    />
                </span>
            </span>
            <span v-if="$slots.default" class="rui-checkbox__label"><slot /></span>
        </label>
    </RTouchTargetWrapper>
</template>

<style scoped lang="scss">
@use "@/styles/density";
@use "@/styles/typography";

.rui-checkbox__touch-target-wrapper {
    @include density.touchTargetEnabled();
    @include density.touchTargetPaddingXY(40px, 40px);

    align-items: center;
    justify-content: center;
    vertical-align: middle;
}
.rui-checkbox {
    --rui-comp-checkbox-target-size: 48px;
    --rui-comp-checkbox-visual-size: 18px;
    --rui-comp-checkbox-indicator-color: var(--rui-sys-color-on-surface-medium);
    --rui-comp-checkbox-state-layer-color: var(--rui-sys-color-on-surface);
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: var(--rui-comp-checkbox-indicator-color);
}
.rui-checkbox--checked,
.rui-checkbox--indeterminate {
    --rui-comp-checkbox-indicator-color: var(--rui-sys-color-primary);
    --rui-comp-checkbox-state-layer-color: var(--rui-sys-color-primary);
}
.rui-checkbox--disabled { --rui-comp-checkbox-indicator-color: var(--rui-sys-color-on-surface-low); cursor: default; }
.rui-checkbox__control {
    position: relative;
    display: inline-flex;
    flex: 0 0 40px;
    align-items: center;
    justify-content: center;
    inline-size: 40px;
    block-size: 40px;
    border-radius: 50%;
}
.rui-checkbox__native-control { position: absolute; z-index: 2; inset: 0; inline-size: 100%; block-size: 100%; margin: 0; opacity: 0; cursor: inherit; }
.rui-checkbox__content { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; pointer-events: none; }
.rui-checkbox__control:has(.rui-checkbox__native-control:focus-visible) { outline: 2px solid var(--rui-sys-color-primary); outline-offset: -2px; }
.rui-checkbox__fallback,
.rui-checkbox__lottie { display: block; inline-size: var(--rui-comp-checkbox-visual-size); block-size: var(--rui-comp-checkbox-visual-size); }
.rui-checkbox__lottie { position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%); opacity: 0; }
.rui-checkbox--player-ready .rui-checkbox__lottie { opacity: 1; }
.rui-checkbox--player-ready .rui-checkbox__fallback { opacity: 0; }
.rui-checkbox__label { @include typography.body2("--rui-comp-checkbox-label"); padding-inline-end: 12px; }
</style>
