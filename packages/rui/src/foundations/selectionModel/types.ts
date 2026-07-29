import type { ComputedRef, InjectionKey, Ref } from "vue"

export type RSelectionModelItemState = {
    disabled: boolean
    element: HTMLElement | null
    value: unknown
}

export type RSelectionModelItemRecord = {
    id: symbol
    state: RSelectionModelItemState
}

export type RSelectionModelContext = {
    items: Readonly<ComputedRef<RSelectionModelItemRecord[]>>
    selectedItem: Readonly<ComputedRef<RSelectionModelItemRecord | null>>
    registerItem: (id: symbol, state: RSelectionModelItemState) => void
    unregisterItem: (id: symbol) => void
    isSelected: (value: unknown) => boolean
    activate: (id: symbol) => void
    metadata: Readonly<Ref<Record<string, unknown>>>
}

export type RSelectionModelKey = InjectionKey<RSelectionModelContext>
