import { computed, inject, type InjectionKey, type Ref } from "vue"

import { RUI_FLOATING_PORTAL_ID } from "./constants"
import { resolveFloatingValue } from "./shared"

import type { RFloatingPortalTarget, RFloatingReactive } from "./types"

export const floatingPortalTargetKey: InjectionKey<Ref<HTMLElement | null>> = Symbol("rFloatingPortalTarget")

export function useFloatingPortalTarget(target?: RFloatingReactive<RFloatingPortalTarget>) {
    const inheritedTarget = inject(floatingPortalTargetKey, null)

    return computed(() => {
        const resolvedTarget = resolveFloatingValue(target, inheritedTarget?.value ?? null)
        return resolvedTarget ? resolvePortalTarget(resolvedTarget) : null
    })
}

export function resolvePortalTarget(target?: RFloatingPortalTarget) {
    if (typeof document === "undefined") {
        return null
    }

    if (!target) {
        return document.body
    }

    if (typeof target === "string") {
        return document.querySelector<HTMLElement>(target)
    }

    if (typeof target === "function") {
        return target()
    }

    return target
}

export function ensureFloatingPortalRoot(id = RUI_FLOATING_PORTAL_ID) {
    if (typeof document === "undefined") {
        return null
    }

    const existing = document.getElementById(id)
    if (existing instanceof HTMLElement) {
        return existing
    }

    const root = document.createElement("div")
    root.id = id
    root.style.position = "fixed"
    root.style.inset = "0"
    root.style.pointerEvents = "none"
    root.style.zIndex = "2147483647"
    document.body.append(root)
    return root
}

export function usePortalTarget(target?: RFloatingReactive<RFloatingPortalTarget>) {
    return computed(() => resolvePortalTarget(resolveFloatingValue(target, null)))
}
