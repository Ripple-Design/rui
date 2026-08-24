import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RButton from "@/components/actions/button/RButton.vue"
import RModal from "@/primitives/modal/RModal.vue"

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

function dispatchTransitionEnd(element: HTMLElement, propertyName: string) {
    const event = new Event("transitionend", { bubbles: true })
    Object.defineProperty(event, "propertyName", { value: propertyName })
    element.dispatchEvent(event)
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
        expect(surface.querySelector(".rui-dialog__footer")).toBeNull()

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

    it("renders configured default actions", async () => {
        const wrapper = mount(RDialog, {
            props: {
                negative: true,
                positive: {
                    label: "Delete",
                    disabled: true,
                    variant: "contained",
                },
            },
        })
        await nextTick()
        await nextTick()

        const actions = getDialogSurface().querySelectorAll<HTMLButtonElement>(".rui-dialog__actions .rui-button")

        expect(actions).toHaveLength(2)
        expect(actions[0]?.textContent).toContain("Cancel")
        expect(actions[0]?.getAttribute("data-rui-modal-action")).toBe("negative")
        expect(actions[0]?.classList.contains("rui-button--text")).toBe(true)
        expect(actions[1]?.textContent).toContain("Delete")
        expect(actions[1]?.getAttribute("data-rui-modal-action")).toBe("positive")
        expect(actions[1]?.disabled).toBe(true)
        expect(actions[1]?.classList.contains("rui-button--contained")).toBe(true)

        wrapper.unmount()
    })

    it("uses action strings as labels", async () => {
        const wrapper = mount(RDialog, {
            props: { negative: "Keep editing", positive: "Discard" },
        })
        await nextTick()
        await nextTick()

        const actions = getDialogSurface().querySelectorAll<HTMLButtonElement>(".rui-dialog__actions .rui-button")

        expect(actions[0]?.textContent).toContain("Keep editing")
        expect(actions[1]?.textContent).toContain("Discard")

        wrapper.unmount()
    })

    it("closes with a semantic action detail", async () => {
        const showModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal")
        const close = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close")
        Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
            configurable: true,
            value(this: HTMLDialogElement) {
                this.setAttribute("open", "")
            },
        })
        Object.defineProperty(HTMLDialogElement.prototype, "close", {
            configurable: true,
            value(this: HTMLDialogElement) {
                this.removeAttribute("open")
                this.dispatchEvent(new Event("close"))
            },
        })

        const wrapper = await renderDialog({ modelValue: true })
        await wrapper.setProps({ positive: true })
        const action = getDialogSurface().querySelector<HTMLButtonElement>('[data-rui-modal-action="positive"]')
        if (!action) throw new Error("Missing positive action.")

        await action.click()

        expect(wrapper.emitted("before-close")).toEqual([[{ reason: "action", action: "positive" }]])
        expect(wrapper.emitted("close")).toEqual([[{ reason: "action", action: "positive" }]])

        wrapper.unmount()
        if (showModal) Object.defineProperty(HTMLDialogElement.prototype, "showModal", showModal)
        else delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
        if (close) Object.defineProperty(HTMLDialogElement.prototype, "close", close)
        else delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close
    })

    it("prefers custom actions over configured default actions", async () => {
        const wrapper = mount(RDialog, {
            props: { negative: true, positive: true },
            slots: { actions: '<button data-test="custom-action">Custom</button>' },
        })
        await nextTick()
        await nextTick()

        const surface = getDialogSurface()

        expect(surface.querySelector("[data-test=custom-action]")?.textContent).toBe("Custom")
        expect(surface.querySelectorAll(".rui-dialog__actions .rui-button")).toHaveLength(0)

        wrapper.unmount()
    })

    it("keeps a custom footer independent from actions", async () => {
        const wrapper = mount(RDialog, {
            props: { negative: true, positive: true },
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

    it("emits after-close after the surface exit transition", async () => {
        const wrapper = await renderDialog()
        const modal = wrapper.findComponent(RModal)
        const surface = getDialogSurface()

        modal.vm.$emit("close", { reason: "programmatic" })

        expect(wrapper.emitted("close")).toEqual([[{ reason: "programmatic" }]])
        expect(wrapper.emitted("after-close")).toBeUndefined()

        dispatchTransitionEnd(surface, "opacity")

        expect(wrapper.emitted("after-close")).toBeUndefined()

        dispatchTransitionEnd(surface, "transform")

        expect(wrapper.emitted("after-close")).toEqual([[]])

        wrapper.unmount()
    })

    it("emits after-close after the leave fallback", async () => {
        vi.useFakeTimers()
        const wrapper = await renderDialog()
        const modal = wrapper.findComponent(RModal)

        modal.vm.$emit("close", { reason: "programmatic" })
        vi.advanceTimersByTime(160)

        expect(wrapper.emitted("after-close")).toEqual([[]])

        wrapper.unmount()
        vi.useRealTimers()
    })

    it("cancels a pending after-close when reopening", async () => {
        const wrapper = await renderDialog()
        const modal = wrapper.findComponent(RModal)
        const surface = getDialogSurface()

        modal.vm.$emit("close", { reason: "programmatic" })
        modal.vm.$emit("before-open")
        dispatchTransitionEnd(surface, "transform")

        expect(wrapper.emitted("after-close")).toBeUndefined()

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
