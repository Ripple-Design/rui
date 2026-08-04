import type { InjectionKey, Ref } from "vue"

export type RSelectOptionRecord = {
    disabled: boolean
    element: HTMLElement | null
    id: string
    label: string
    value: unknown
}

export type RSelectContext = {
    activeOptionId: Ref<string | null>
    commit: (option: RSelectOptionRecord) => void
    isSelected: (value: unknown) => boolean
    register: (option: RSelectOptionRecord) => void
    unregister: (id: string) => void
}

export const selectContextKey: InjectionKey<RSelectContext> = Symbol("rSelectField")
