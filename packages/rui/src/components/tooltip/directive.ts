import { createVNode, render, type Directive, type VNode } from "vue"

import { resolveTouchTargetAnchor } from "@/foundations/touchTarget"

import RPlainTooltip from "./RPlainTooltip.vue"

import type { TooltipDirectiveValue } from "./types"

type TooltipDirectiveState = {
    disabled: boolean
    hostElement: HTMLDivElement
    targetElement: HTMLElement
    text: string
    vnode: VNode | null
}

type TooltipDirectiveElement = HTMLElement & {
    __rTooltipState__?: TooltipDirectiveState
}

function normalizeTooltipValue(value: TooltipDirectiveValue): { disabled: boolean; text: string } {
    if (typeof value === "string") {
        return {
            disabled: false,
            text: value,
        }
    }

    return {
        disabled: value.disabled ?? false,
        text: value.text,
    }
}

function resolveTooltipTarget(element: HTMLElement) {
    return resolveTouchTargetAnchor(element) ?? element
}

function renderTooltip(state: TooltipDirectiveState) {
    state.vnode = createVNode(RPlainTooltip, {
        disabled: state.disabled,
        target: state.targetElement,
        text: state.text,
    })

    render(state.vnode, state.hostElement)
}

function setupDirective(element: TooltipDirectiveElement, value: TooltipDirectiveValue) {
    const hostElement = document.createElement("div")
    document.body.appendChild(hostElement)

    const normalized = normalizeTooltipValue(value)
    const state: TooltipDirectiveState = {
        disabled: normalized.disabled,
        hostElement,
        targetElement: resolveTooltipTarget(element),
        text: normalized.text,
        vnode: null,
    }

    element.__rTooltipState__ = state
    renderTooltip(state)
}

function updateDirective(element: TooltipDirectiveElement, value: TooltipDirectiveValue) {
    const state = element.__rTooltipState__
    if (!state) {
        return
    }

    const normalized = normalizeTooltipValue(value)
    state.disabled = normalized.disabled
    state.targetElement = resolveTooltipTarget(element)
    state.text = normalized.text
    renderTooltip(state)
}

function cleanupDirective(element: TooltipDirectiveElement) {
    const state = element.__rTooltipState__
    if (!state) {
        return
    }

    render(null, state.hostElement)
    state.hostElement.remove()
    delete element.__rTooltipState__
}

export const vTooltip: Directive<TooltipDirectiveElement, TooltipDirectiveValue> = {
    mounted(element, binding) {
        setupDirective(element, binding.value)
    },
    updated(element, binding) {
        updateDirective(element, binding.value)
    },
    unmounted(element) {
        cleanupDirective(element)
    },
    getSSRProps() {
        return {}
    },
}
