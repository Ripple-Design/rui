import { ref } from "vue"
import { describe, expect, it, vi } from "vitest"

import { useListBoxSelection } from "../useListBoxSelection.ts"

function createOption(id: string, value: unknown, disabled = false) {
    return {
        disabled,
        element: null,
        id,
        label: id,
        value,
    }
}

describe("useListBoxSelection", () => {
    it("matches raw option values and delegates commits", () => {
        const value = ref<unknown>({ id: 1 })
        const commit = vi.fn()
        const selection = useListBoxSelection({ model: value, onCommit: commit })
        const option = createOption("one", value.value)

        selection.context.register(option)

        expect(selection.selectedOption.value).toBe(option)
        expect(selection.context.isSelected(option.value)).toBe(true)

        selection.context.commit(option)
        expect(commit).toHaveBeenCalledWith(option)
    })

    it("initializes the active option from the selected enabled option", () => {
        const value = ref<unknown>("two")
        const selection = useListBoxSelection({ model: value, onCommit: vi.fn() })

        selection.context.register(createOption("one", "one"))
        selection.context.register(createOption("two", "two"))
        selection.context.register(createOption("three", "three", true))
        selection.setInitialActiveOption()

        expect(selection.activeOptionId.value).toBe("two")

        selection.context.unregister("two")
        selection.setInitialActiveOption()
        expect(selection.activeOptionId.value).toBe("one")
    })
})
