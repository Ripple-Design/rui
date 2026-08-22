import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RDialog from "../RDialog.vue"
import RTextFieldDialog from "../RTextFieldDialog.vue"

async function renderDialog(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    const wrapper = mount(RTextFieldDialog, { props, slots })
    await nextTick()
    await nextTick()
    return wrapper
}

function getInput() {
    const input = document.body.querySelector<HTMLInputElement>(".rui-input")
    if (!input) throw new Error("Missing text field input.")
    return input
}

describe("RTextFieldDialog", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            callback(0)
            return 0
        })
    })

    afterEach(() => {
        document.body.replaceChildren()
        vi.unstubAllGlobals()
    })

    it("uses dialog defaults when dismissal props are omitted", async () => {
        const wrapper = await renderDialog()
        const dialog = wrapper.findComponent(RDialog)

        expect(dialog.props("closeOnEscape")).toBe(true)
        expect(dialog.props("closeOnBackdrop")).toBe(true)
        expect(dialog.props("returnFocus")).toBe(true)
        expect(dialog.props("role")).toBe("dialog")
        expect(dialog.props("width")).toBe("auto")
        expect(dialog.props("height")).toBe("auto")

        wrapper.unmount()
    })

    it("keeps the dialog and field models independent", async () => {
        const wrapper = await renderDialog({ modelValue: true, value: "Initial value" })
        const dialog = wrapper.findComponent(RDialog)
        const input = getInput()

        expect(input.value).toBe("Initial value")

        input.value = "Updated value"
        await input.dispatchEvent(new Event("input", { bubbles: true }))

        expect(wrapper.emitted<string[][]>("update:value")?.[0]).toEqual(["Updated value"])

        dialog.vm.$emit("update:modelValue", false)
        await nextTick()

        expect(wrapper.emitted<boolean[][]>("update:modelValue")?.[0]).toEqual([false])
        expect(wrapper.emitted<string[][]>("update:value")).toHaveLength(1)

        wrapper.unmount()
    })

    it("forwards text field props and attributes to the embedded field", async () => {
        const wrapper = await renderDialog({
            label: "Project name",
            helperText: "Choose a concise name.",
            name: "project-name",
            autocomplete: "off",
            "data-test": "project-input",
        })
        const input = getInput()

        expect(document.body.querySelector(".rui-field-shell__caption-area")?.textContent).toContain("Choose a concise name.")
        expect(input.name).toBe("project-name")
        expect(input.autocomplete).toBe("off")
        expect(input.dataset.test).toBe("project-input")
        expect(document.body.querySelector("dialog")?.getAttribute("name")).toBeNull()

        wrapper.unmount()
    })

    it("uses the text field as the default initial focus target", async () => {
        const wrapper = await renderDialog()

        expect(wrapper.findComponent(RDialog).props("initialFocus")).toBe(".rui-input")

        wrapper.unmount()
    })

    it("preserves a caller supplied initial focus target", async () => {
        const wrapper = await renderDialog({ initialFocus: "[data-test=custom-focus]" })

        expect(wrapper.findComponent(RDialog).props("initialFocus")).toBe("[data-test=custom-focus]")

        wrapper.unmount()
    })

    it("forwards after-close", async () => {
        const wrapper = await renderDialog()

        wrapper.findComponent(RDialog).vm.$emit("after-close")

        expect(wrapper.emitted("after-close")).toEqual([[]])

        wrapper.unmount()
    })

    it("renders configured default actions", async () => {
        const wrapper = await renderDialog({ negative: "Cancel", positive: "Save" })
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
        const actions = surface?.querySelectorAll<HTMLButtonElement>(".rui-dialog__actions .rui-button")

        expect(actions).toHaveLength(2)
        expect(actions?.[0]?.textContent).toContain("Cancel")
        expect(actions?.[0]?.getAttribute("data-rui-modal-action")).toBe("negative")
        expect(actions?.[1]?.textContent).toContain("Save")
        expect(actions?.[1]?.getAttribute("data-rui-modal-action")).toBe("positive")

        wrapper.unmount()
    })

    it("does not render caller supplied action content", async () => {
        const wrapper = await renderDialog({}, { actions: '<button data-test="action">Save</button>' })
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")

        expect(surface?.querySelector(".rui-dialog__footer")).toBeNull()
        expect(surface?.querySelector("[data-test=action]")).toBeNull()

        wrapper.unmount()
    })
})
