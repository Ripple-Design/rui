import { type Placement, type Strategy } from "@floating-ui/dom"
import { computed, isRef, type ComputedRef } from "vue"

import type { RFloatingReactive } from "./types"

export function resolveFloatingValue<T>(value: RFloatingReactive<T> | undefined, fallback: T): T {
    if (value == null) {
        return fallback
    }

    if (isRef(value)) {
        return value.value
    }

    return value
}

export function useResolvedFloatingValue<T>(value: RFloatingReactive<T> | undefined, fallback: T): ComputedRef<T> {
    return computed(() => resolveFloatingValue(value, fallback))
}

export function normalizeFloatingPlacement(value: RFloatingReactive<Placement> | undefined) {
    return useResolvedFloatingValue(value, "bottom" satisfies Placement)
}

export function normalizeFloatingStrategy(value: RFloatingReactive<Strategy> | undefined) {
    return useResolvedFloatingValue(value, "absolute" satisfies Strategy)
}

export function normalizeFloatingBoolean(value: RFloatingReactive<boolean> | undefined, fallback = true) {
    return useResolvedFloatingValue(value, fallback)
}
