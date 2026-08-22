import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RFullscreenDialog from "../RFullscreenDialog.vue"

function getDialogSurface() {
    const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
    if (!surface) throw new Error("Missing dialog surface.")
    return surface
}

describe("RFullscreenDialog", () => {
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

    it("forwards configured default actions", async () => {
        const wrapper = mount(RFullscreenDialog, {
            props: {
                negative: "Cancel",
                positive: "Save",
            },
        })
        await nextTick()
        await nextTick()

        const actions = getDialogSurface().querySelectorAll<HTMLButtonElement>(".rui-dialog__actions .rui-button")

        expect(actions).toHaveLength(2)
        expect(actions[0]?.textContent).toContain("Cancel")
        expect(actions[0]?.getAttribute("data-rui-modal-action")).toBe("negative")
        expect(actions[1]?.textContent).toContain("Save")
        expect(actions[1]?.getAttribute("data-rui-modal-action")).toBe("positive")

        wrapper.unmount()
    })
})
