import { nextTick } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { RDialogs } from "../RDialogs.ts"

function getDialogs() {
    return [...document.body.querySelectorAll<HTMLDialogElement>(".rui-modal")]
}

function dispatchTransformTransitionEnd(element: HTMLElement) {
    const event = new Event("transitionend", { bubbles: true })
    Object.defineProperty(event, "propertyName", { value: "transform" })
    element.dispatchEvent(event)
}

async function flushDialog() {
    await nextTick()
    await nextTick()
}

describe("RDialogs", () => {
    let showModalDescriptor: PropertyDescriptor | undefined
    let closeDescriptor: PropertyDescriptor | undefined

    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            callback(0)
            return 0
        })
        showModalDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal")
        closeDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close")
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
    })

    afterEach(() => {
        if (showModalDescriptor) {
            Object.defineProperty(HTMLDialogElement.prototype, "showModal", showModalDescriptor)
        } else {
            delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
        }
        if (closeDescriptor) {
            Object.defineProperty(HTMLDialogElement.prototype, "close", closeDescriptor)
        } else {
            delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close
        }
        vi.unstubAllGlobals()
        document.body.replaceChildren()
    })

    it("resolves an alert after its leave animation", async () => {
        const result = RDialogs.alert({ message: "Item archived", positive: true })
        let settled = false
        void result.then(() => {
            settled = true
        })
        await flushDialog()

        const dialog = getDialogs()[0]
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")

        dialog.dispatchEvent(new Event("close"))
        await flushDialog()

        expect(settled).toBe(false)
        expect(getDialogs()).toHaveLength(1)

        dispatchTransformTransitionEnd(surface!)

        await expect(result).resolves.toEqual({ reason: "programmatic" })
        expect(getDialogs()).toHaveLength(0)
    })

    it("resolves a text field value with its close detail", async () => {
        const result = RDialogs.textField({
            label: "Name",
            value: "Initial name",
            positive: true,
        })
        await flushDialog()

        const input = document.body.querySelector<HTMLInputElement>(".rui-input")
        const action = document.body.querySelector<HTMLButtonElement>('[data-rui-modal-action="positive"]')
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
        if (!input || !action || !surface) throw new Error("Missing text field dialog elements.")

        input.value = "Updated name"
        await input.dispatchEvent(new Event("input", { bubbles: true }))
        await action.click()
        await flushDialog()

        dispatchTransformTransitionEnd(surface)

        await expect(result).resolves.toEqual({
            value: "Updated name",
            detail: { reason: "action", action: "positive" },
        })
    })

    it("mounts and disposes an ordinary dialog", async () => {
        RDialogs.alert({ title: "Session expired", message: "Sign in again to continue." })
        await flushDialog()

        const dialog = getDialogs()[0]
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")

        expect(dialog).toBeDefined()
        expect(surface?.querySelector(".rui-dialog__title")?.textContent).toContain("Session expired")
        expect(surface?.querySelector(".rui-dialog__message")?.textContent).toContain("Sign in again to continue.")

        dialog.dispatchEvent(new Event("close"))
        await flushDialog()

        expect(getDialogs()).toHaveLength(1)

        dispatchTransformTransitionEnd(surface!)
        await flushDialog()

        expect(getDialogs()).toHaveLength(0)
    })

    it("mounts an action-free text field dialog", async () => {
        RDialogs.textField({
            title: "Rename item",
            label: "Name",
            placeholder: "Untitled",
            helperText: "Use a concise name.",
        })
        await flushDialog()

        const dialog = getDialogs()[0]
        const input = document.body.querySelector<HTMLInputElement>(".rui-input")
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")

        expect(input?.placeholder).toBe("Untitled")
        expect(surface?.textContent).toContain("Use a concise name.")
        expect(surface?.querySelector(".rui-dialog__footer")).toBeNull()

        dialog.dispatchEvent(new Event("close"))
        await flushDialog()

        expect(getDialogs()).toHaveLength(1)

        dispatchTransformTransitionEnd(surface!)
        await flushDialog()

        expect(getDialogs()).toHaveLength(0)
    })

    it("renders configured actions in a programmatic text field dialog", async () => {
        RDialogs.textField({ label: "Name", negative: "Cancel", positive: "Save" })
        await flushDialog()

        const dialog = getDialogs()[0]
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
        const actions = surface?.querySelectorAll<HTMLButtonElement>(".rui-dialog__actions .rui-button")
        if (!surface) throw new Error("Missing dialog surface.")

        expect(actions).toHaveLength(2)
        expect(actions?.[0]?.textContent).toContain("Cancel")
        expect(actions?.[0]?.getAttribute("data-rui-modal-action")).toBe("negative")
        expect(actions?.[1]?.textContent).toContain("Save")
        expect(actions?.[1]?.getAttribute("data-rui-modal-action")).toBe("positive")

        dialog.dispatchEvent(new Event("close"))
        await flushDialog()
        dispatchTransformTransitionEnd(surface)
        await flushDialog()

        expect(getDialogs()).toHaveLength(0)
    })

    it("returns the current text field value after backdrop dismissal", async () => {
        const result = RDialogs.textField({ label: "Name", value: "Initial name" })
        await flushDialog()

        const dialog = getDialogs()[0]
        const input = document.body.querySelector<HTMLInputElement>(".rui-input")
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
        if (!input || !surface) throw new Error("Missing text field dialog elements.")

        input.value = "Draft name"
        await input.dispatchEvent(new Event("input", { bubbles: true }))
        dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        await flushDialog()

        expect(dialog.open).toBe(false)
        expect(getDialogs()).toHaveLength(1)

        dispatchTransformTransitionEnd(surface)

        await expect(result).resolves.toEqual({
            value: "Draft name",
            detail: { reason: "backdrop" },
        })
        expect(getDialogs()).toHaveLength(0)
    })

    it("does not close a text field dialog when clicking its content", async () => {
        RDialogs.textField({ label: "Name" })
        await flushDialog()

        const dialog = getDialogs()[0]
        const input = document.body.querySelector<HTMLInputElement>(".rui-input")
        const surface = document.body.querySelector<HTMLElement>(".rui-dialog")
        if (!input) throw new Error("Missing text field input.")

        input.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        await flushDialog()

        expect(dialog.open).toBe(true)

        dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        await flushDialog()
        dispatchTransformTransitionEnd(surface!)
        await flushDialog()

        expect(getDialogs()).toHaveLength(0)
    })

    it("keeps concurrent dialogs independent", async () => {
        RDialogs.textField({ label: "First dialog" })
        RDialogs.textField({ label: "Second dialog" })
        await flushDialog()

        const [first, second] = getDialogs()
        const [firstSurface, secondSurface] = document.body.querySelectorAll<HTMLElement>(".rui-dialog")
        if (!firstSurface || !secondSurface) throw new Error("Missing dialog surfaces.")

        expect(getDialogs()).toHaveLength(2)

        first.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        await flushDialog()

        expect(getDialogs()).toHaveLength(2)

        dispatchTransformTransitionEnd(firstSurface)
        await flushDialog()

        expect(getDialogs()).toHaveLength(1)
        expect(getDialogs()[0]).toBe(second)

        second.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        await flushDialog()

        expect(getDialogs()).toHaveLength(1)

        dispatchTransformTransitionEnd(secondSurface)
        await flushDialog()

        expect(getDialogs()).toHaveLength(0)
    })

    it("rejects server-side invocation", () => {
        vi.stubGlobal("document", undefined)

        expect(() => RDialogs.alert({ message: "Unavailable" })).toThrow(
            "[RDialogs] Dialogs can only be opened in a browser.",
        )
    })
})
