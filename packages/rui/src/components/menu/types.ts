import type { RIconResolvableSource } from "@/components/icon/types"

export type {
    RMenuContext,
    RMenuGroupContext,
    RMenuGroupSelectionIndicator,
    RMenuItemRecord,
} from "@/foundations/menu/types"
export { menuGroupKey, menuKey } from "@/foundations/menu/types"

export type RMenuAlign = "start" | "end"

export type RMenuProps = {
    align?: RMenuAlign
    disabled?: boolean
    open?: boolean
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
    indicator?: import("@/foundations/menu/types").RMenuGroupSelectionIndicator
}

export type RMenuItemProps = {
    disabled?: boolean
    icon?: RIconResolvableSource
    /** Identifies this item when it belongs to an RMenuGroup. */
    value?: unknown
}
