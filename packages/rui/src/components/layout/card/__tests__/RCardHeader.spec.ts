import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RCardHeader from "../RCardHeader.vue"

describe("RCardHeader", () => {
    it("renders title and supporting text", () => {
        const wrapper = mount(RCardHeader, {
            props: {
                title: "Card title",
                text: "Supporting text",
            },
        })

        expect(wrapper.get("h6").text()).toBe("Card title")
        expect(wrapper.get("p").text()).toBe("Supporting text")
    })

    it("renders slotted actions", () => {
        const wrapper = mount(RCardHeader, {
            slots: {
                actions: '<div data-test="actions">Actions</div>',
            },
        })

        expect(wrapper.get("[data-test=actions]").text()).toBe("Actions")
    })

    it("omits empty content regions", () => {
        const wrapper = mount(RCardHeader)

        expect(wrapper.find(".rui-card-header__copy").exists()).toBe(false)
        expect(wrapper.find(".rui-card-header__actions").exists()).toBe(false)
    })
})
