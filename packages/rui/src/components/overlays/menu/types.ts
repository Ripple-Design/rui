import type { Slot } from "vue"

import type { RIconResolvableSource } from "@/components/base/icon/types.ts"
import type { RMenuGroupSelectionIndicator } from "@/foundations/menu/types.ts"

export type {
    RMenuContext,
    RMenuGroupContext,
    RMenuGroupSelectionIndicator,
    RMenuItemRecord,
} from "@/foundations/menu/types.ts"
export { menuGroupKey, menuKey } from "@/foundations/menu/types.ts"

export type RMenuAlign = "start" | "end"

export type RMenuMode = "menu" | "listbox"

export type RMenuSlots = {
    default?: Slot
    trigger?: Slot
}

export type RMenuProps = {
    /** Aligns the menu to the logical inline start or end of its reference element. */
    align?: RMenuAlign
    /** Prevents the trigger from opening the menu. */
    disabled?: boolean
    /** Sets the id of the menu element. */
    id?: string
    /** Controls whether the menu is open. */
    open?: boolean
    /** Sets the semantic behavior and ARIA role of the menu. */
    mode?: RMenuMode
    /** Matches the menu width to its reference element. */
    matchWidth?: boolean
    /** Sets an external element used to position the menu. */
    reference?: HTMLElement | null
    /** Restores focus to the trigger or reference element when the menu closes. */
    restoreFocus?: boolean
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
