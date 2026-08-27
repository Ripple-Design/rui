import { describe, expect, it } from "vitest"
import { ref } from "vue"

import { useDataTableSelection } from "../useDataTableSelection"

import type { RDataTableItem } from "../../components/dataTable/types"

function createItem(value: number): RDataTableItem<{ id: number }> {
    return {
        columns: { id: value },
        index: value - 1,
        key: value,
        raw: { id: value },
        selectable: true,
        type: "item",
        value,
    }
}

describe("useDataTableSelection", () => {
    it("scopes mixed state to the page selection strategy", () => {
        const allItems = ref(Array.from({ length: 20 }, (_, index) => createItem(index + 1)))
        const currentPage = ref(allItems.value.slice(10))
        const selected = ref<unknown[]>([1])
        const selection = useDataTableSelection({ selectStrategy: "page" }, selected, allItems, currentPage)

        expect(selection.someSelected.value).toBe(false)
        expect(selection.allSelected.value).toBe(false)
        expect(selection.hasSelectableItems.value).toBe(true)
    })
})
