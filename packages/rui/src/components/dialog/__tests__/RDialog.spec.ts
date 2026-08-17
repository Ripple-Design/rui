import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RButton from "@/components/button/RButton.vue"

import RDialog from "../RDialog.vue"

function getDialogSurface() {
    const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
    if (!surface) throw new Error("Missing dialog surface.")
    return surface
}

async function renderDialog(props: Record<string, number | string> = {}) {
    const wrapper = mount(RDialog, { props })
    await nextTick()
    await nextTick()
    return wrapper
}

describe("RDialog", () => {
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

    it("uses automatic dimensions by default", async () => {
        const wrapper = await renderDialog()
        const surface = getDialogSurface()

        expect(surface.style.getPropertyValue("--rui-comp-dialog-width")).toBe("")
        expect(surface.style.getPropertyValue("--rui-comp-dialog-height")).toBe("")

        wrapper.unmount()
    })

    it("renders a message instead of default content", async () => {
        const wrapper = mount(RDialog, {
            props: { message: "This action cannot be undone." },
            slots: { default: "Additional content" },
        })
        await nextTick()
        await nextTick()

        const surface = getDialogSurface()
        expect(surface.querySelector(".rui-dialog__message")?.textContent).toBe("This action cannot be undone.")
        expect(surface.querySelector(".rui-dialog__content")?.textContent).not.toContain("Additional content")

        wrapper.unmount()
    })

    it("gives the message slot precedence over the message prop", async () => {
        const wrapper = mount(RDialog, {
            props: { message: "Fallback message" },
            slots: { message: '<strong data-test="message-slot">Custom message</strong>' },
        })
        await nextTick()
        await nextTick()

        const surface = getDialogSurface()
        expect(surface.querySelector(".rui-dialog__message [data-test=message-slot]")?.textContent).toBe("Custom message")
        expect(surface.querySelector(".rui-dialog__message")?.textContent).toBe("Custom message")

        wrapper.unmount()
    })

    it("renders actions in an end-aligned button row", async () => {
        const wrapper = mount(RDialog, {
            slots: {
                actions: '<RButton>Cancel</RButton><RButton variant="contained">Save</RButton>',
            },
            global: { components: { RButton } },
        })
        await nextTick()
        await nextTick()

        const actions = getDialogSurface().querySelector<HTMLElement>(".rui-dialog__actions")
        const buttons = actions?.querySelectorAll("button.rui-button")

        expect(actions).not.toBeNull()
        expect(actions?.classList.contains("rui-button-row")).toBe(true)
        expect(actions?.style.getPropertyValue("--rui-stack-justify")).toBe("flex-end")
        expect(actions?.style.getPropertyValue("--rui-stack-gap")).toBe("8px")
        expect(actions?.style.getPropertyValue("--rui-stack-wrap")).toBe("wrap")
        expect(buttons?.[0]?.classList.contains("rui-button--text")).toBe(true)
        expect(buttons?.[1]?.classList.contains("rui-button--contained")).toBe(true)

        wrapper.unmount()
    })

    it("keeps a custom footer independent from actions", async () => {
        const wrapper = mount(RDialog, {
            slots: {
                actions: '<button data-test="action">Action</button>',
                footer: '<div data-test="footer">Custom footer</div>',
            },
        })
        await nextTick()
        await nextTick()

        const surface = getDialogSurface()

        expect(surface.querySelector(".rui-dialog__actions")).toBeNull()
        expect(surface.querySelector("[data-test=footer]")?.textContent).toBe("Custom footer")
        expect(surface.querySelector("[data-test=action]")).toBeNull()

        wrapper.unmount()
    })

    it.each([
        [1, 1],
        [5, 10],
        [12, 16],
    ])("serializes width and height multipliers", async (width, height) => {
        const wrapper = await renderDialog({ width, height })
        const surface = getDialogSurface()

        expect(surface.style.getPropertyValue("--rui-comp-dialog-width")).toBe(`${width * 56}px`)
        expect(surface.style.getPropertyValue("--rui-comp-dialog-height")).toBe(`${height * 56}px`)

        wrapper.unmount()
    })
})
