import { computed, ref, type Ref } from "vue"

import type { RMenuContext, RMenuItemRecord } from "./types"

export function useMenuState(open: Ref<boolean>, disabled: Ref<boolean>) {
    const items = ref<RMenuItemRecord[]>([])
    const groups = ref<symbol[]>([])
    const focusedItemId = ref<symbol | null>(null)

    const enabledItems = computed(() => items.value.filter((item) => !item.disabled && item.element))

    function registerItem(record: RMenuItemRecord) {
        const index = items.value.findIndex((item) => item.id === record.id)
        if (index >= 0) {
            items.value.splice(index, 1, record)
        } else {
            items.value.push(record)
        }

        if (!focusedItemId.value && !record.disabled) {
            focusedItemId.value = record.id
        }
    }

    function unregisterItem(id: symbol) {
        const index = items.value.findIndex((item) => item.id === id)
        if (index === -1) {
            return
        }

        items.value.splice(index, 1)
        if (focusedItemId.value === id) {
            focusedItemId.value = enabledItems.value[0]?.id ?? null
        }
    }

    function registerGroup(id: symbol) {
        if (!groups.value.includes(id)) {
            groups.value.push(id)
        }
    }

    function unregisterGroup(id: symbol) {
        groups.value = groups.value.filter((groupId) => groupId !== id)
    }

    function focusByDirection(fromId: symbol, direction: "next" | "prev" | "first" | "last") {
        const list = enabledItems.value
        if (!list.length) {
            return
        }

        const currentIndex = Math.max(0, list.findIndex((item) => item.id === fromId))
        let nextIndex = currentIndex

        if (direction === "next") nextIndex = (currentIndex + 1) % list.length
        if (direction === "prev") nextIndex = (currentIndex - 1 + list.length) % list.length
        if (direction === "first") nextIndex = 0
        if (direction === "last") nextIndex = list.length - 1

        const target = list[nextIndex]
        if (!target?.element) {
            return
        }

        focusedItemId.value = target.id
        target.element.focus({ preventScroll: true })
    }

    function onItemFocus(id: symbol) {
        focusedItemId.value = id
    }

    function closeMenu() {
        open.value = false
    }

    function onItemClick(id: symbol) {
        const target = items.value.find((item) => item.id === id)
        if (!target || target.disabled || disabled.value) {
            return
        }

        closeMenu()
    }

    return {
        context: {
            closeMenu,
            disabled,
            focusedItemId,
            focusByDirection,
            onItemClick,
            onItemFocus,
            open,
            registerGroup,
            registerItem,
            unregisterGroup,
            unregisterItem,
        } satisfies RMenuContext,
        enabledItems,
        hasGroups: computed(() => groups.value.length > 0),
        focusFirst() {
            const target = enabledItems.value[0]
            if (!target?.element) {
                return
            }

            focusedItemId.value = target.id
            target.element.focus({ preventScroll: true })
        },
    }
}
