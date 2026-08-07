import type { Slot } from "vue"
import type { RIconResolvableSource } from "@/components/icon/types"
import type { RMenuGroupSelectionIndicator } from "@/foundations/menu/types"

export type {
    RMenuContext,
    RMenuGroupContext,
    RMenuGroupSelectionIndicator,
    RMenuItemRecord,
} from "@/foundations/menu/types"
export { menuGroupKey, menuKey } from "@/foundations/menu/types"

export type RMenuAlign = "start" | "end"

export type RMenuMode = "menu" | "listbox"

export type RMenuSlots = {
    default?: Slot
    trigger?: Slot
}

export type RMenuProps = {
    align?: RMenuAlign
    disabled?: boolean
    id?: string
    open?: boolean
    mode?: RMenuMode
    matchWidth?: boolean
    reference?: HTMLElement | null
}

export type RContextMenuPoint = {
    clientX: number
    clientY: number
    contextElement?: HTMLElement
}

export type RContextMenuProps = {
    align?: RMenuAlign
    disabled?: boolean
    open?: boolean
}

export type RContextMenuInstance = {
    close: () => void
    openAt: {
        (event: MouseEvent | PointerEvent): void
        (element: HTMLElement): void
        (point: RContextMenuPoint): void
    }
}

export type RMenuGroupProps = {
    /** Controls the selected menu item value within this group. */
    modelValue?: unknown
    /** Controls whether selected items use an overlay or a leading check indicator. */
    indicator?: RMenuGroupSelectionIndicator
}

export type RMenuItemProps = {
    disabled?: boolean
    icon?: RIconResolvableSource
    /** Optional visible label used by select-field triggers. */
    label?: string
    /** Identifies this item when it belongs to an RMenuGroup. */
    value?: unknown
}
