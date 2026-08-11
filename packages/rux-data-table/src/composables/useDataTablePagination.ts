import { computed, watch, type Ref } from "vue"

import { clamp } from "../utils/value"

export function useDataTablePagination(page: Ref<number>, itemsPerPage: Ref<number>, itemsLength: Ref<number>) {
    const startIndex = computed(() => itemsPerPage.value === -1 ? 0 : itemsPerPage.value * (page.value - 1))
    const stopIndex = computed(() => itemsPerPage.value === -1 ? itemsLength.value : Math.min(itemsLength.value, startIndex.value + itemsPerPage.value))
    const pageCount = computed(() => itemsPerPage.value === -1 || itemsLength.value === 0 ? 1 : Math.ceil(itemsLength.value / itemsPerPage.value))
    watch([page, pageCount], () => { if (page.value > pageCount.value) page.value = pageCount.value })
    function setItemsPerPage(value: number) { itemsPerPage.value = value; page.value = 1 }
    function setPage(value: number) { page.value = clamp(value, 1, pageCount.value) }
    function nextPage() { setPage(page.value + 1) }
    function prevPage() { setPage(page.value - 1) }
    return { startIndex, stopIndex, pageCount, setItemsPerPage, setPage, nextPage, prevPage }
}

export function usePaginatedItems<T>(items: Ref<readonly T[]>, startIndex: Ref<number>, stopIndex: Ref<number>, itemsPerPage: Ref<number>) {
    const paginatedItems = computed(() => itemsPerPage.value <= 0 ? items.value : items.value.slice(startIndex.value, stopIndex.value))
    return { paginatedItems }
}
