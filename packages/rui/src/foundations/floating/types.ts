import type { Middleware, MiddlewareData, Placement, Strategy, VirtualElement } from "@floating-ui/dom"
import type { ComputedRef, CSSProperties, Ref } from "vue"

export type RFloatingDismissReason = "escape-key" | "pointer-outside" | "reference-press"

export type RFloatingReference = HTMLElement | VirtualElement

export type RFloatingLayerProps = {
    floatingStyles: CSSProperties
    id?: string
    open: boolean
    role?: string
}

export type RFloatingInitialFocus = string | HTMLElement | null | (() => HTMLElement | null)

export type RFloatingPortalTarget = HTMLElement | string | null | (() => HTMLElement | null)

export type RFloatingReactive<T> = T | Ref<T> | ComputedRef<T>

export type RFloatingPositionOptions = {
    middleware?: RFloatingReactive<Middleware[]>
    open?: RFloatingReactive<boolean>
    placement?: RFloatingReactive<Placement>
    strategy?: RFloatingReactive<Strategy>
}

export type RFloatingPositionState = {
    floatingStyles: ComputedRef<CSSProperties>
    isPositioned: Ref<boolean>
    middlewareData: Ref<MiddlewareData>
    placement: Ref<Placement>
    strategy: Ref<Strategy>
    update: () => Promise<void>
    x: Ref<number>
    y: Ref<number>
}

export type RFloatingDismissOptions = {
    closeOnEscape?: RFloatingReactive<boolean>
    closeOnOutsidePress?: RFloatingReactive<boolean>
    enabled?: RFloatingReactive<boolean>
    isTopLayer?: RFloatingReactive<boolean>
    onDismiss: (reason: RFloatingDismissReason, event: Event) => void
}
