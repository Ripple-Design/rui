import type { InjectionKey, Ref } from "vue"

export type RListBoxOptionRecord = {
    disabled: boolean
    element: HTMLElement | null
    id: string
    label: string
    value: unknown
}

export type RListBoxContext = {
    activeOptionId: Ref<string | null>
    commit: (option: RListBoxOptionRecord) => void
    isOptionVisible: (label: string) => boolean
    isSelected: (value: unknown) => boolean
    register: (option: RListBoxOptionRecord) => void
    unregister: (id: string) => void
}

export type UseListBoxSelectionOptions = {
    isOptionVisible?: (label: string) => boolean
    model: Ref<unknown>
    onCommit: (option: RListBoxOptionRecord) => void
    onOptionsChange?: () => void
}

export const listBoxContextKey: InjectionKey<RListBoxContext> = Symbol("rListBox")
