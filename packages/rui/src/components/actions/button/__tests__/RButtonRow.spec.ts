import { mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"

import RButton from "../RButton.vue"
import RButtonRow from "../RButtonRow.vue"

describe("RButtonRow", () => {
    it("renders slotted content in a fixed button row", () => {
        const wrapper = mount(RButtonRow, {
            slots: { default: '<button data-test="first">First</button><button data-test="second">Second</button>' },
        })

        const row = wrapper.element as HTMLElement

        expect(wrapper.classes()).toContain("rui-stack")
        expect(row.style.getPropertyValue("--rui-stack-display")).toBe("flex")
        expect(row.style.getPropertyValue("--rui-stack-direction")).toBe("row")
        expect(row.style.getPropertyValue("--rui-stack-gap")).toBe("8px")
        expect(row.style.getPropertyValue("--rui-stack-align")).toBe("center")
        expect(row.style.getPropertyValue("--rui-stack-justify")).toBe("flex-start")
        expect(row.style.getPropertyValue("--rui-stack-wrap")).toBe("wrap")
        expect(wrapper.get("[data-test=first]").text()).toBe("First")
        expect(wrapper.get("[data-test=second]").text()).toBe("Second")
    })

    it("renders the end slot at the row's logical end", () => {
        const wrapper = mount(RButtonRow, {
            slots: {
                default: '<button data-test="action">Save</button>',
                end: '<button data-test="more">More</button>',
            },
        })

        const end = wrapper.get(".rui-button-row__end")

        expect(end.get("[data-test=more]").text()).toBe("More")
        expect(wrapper.get("[data-test=action]").text()).toBe("Save")
    })

    it("forwards attributes and listeners to the layout root", async () => {
        const onClick = vi.fn()
        const wrapper = mount(RButtonRow, {
            attrs: {
                id: "dialog-actions",
                class: "custom-actions",
                "aria-label": "Dialog actions",
                onClick,
            },
        })

        expect(wrapper.attributes("id")).toBe("dialog-actions")
        expect(wrapper.classes()).toContain("custom-actions")
        expect(wrapper.attributes("aria-label")).toBe("Dialog actions")

        await wrapper.trigger("click")
        expect(onClick).toHaveBeenCalledOnce()
    })

    it("uses its variant as the default for child buttons", () => {
        const wrapper = mount(RButtonRow, {
            props: { variant: "outlined" },
            slots: { default: '<RButton>Cancel</RButton><RButton variant="contained">Save</RButton>' },
            global: { components: { RButton } },
        })

        const [cancel, save] = wrapper.findAll("button.rui-button")

        expect(cancel?.classes()).toContain("rui-button--outlined")
        expect(save?.classes()).toContain("rui-button--contained")
    })

    it("does not apply button group behavior to slotted buttons", () => {
        const wrapper = mount(RButtonRow, {
            slots: { default: '<RButton value="save">Save</RButton>' },
            global: { components: { RButton } },
        })

        const button = wrapper.get("button.rui-button")

        expect(button.classes()).toContain("rui-button--text")
        expect(button.classes()).not.toContain("rui-button--selectable")
        expect(button.attributes("role")).toBeUndefined()
        expect(button.attributes("aria-checked")).toBeUndefined()
    })
})
