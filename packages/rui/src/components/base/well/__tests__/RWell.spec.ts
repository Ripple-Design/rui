import { defineComponent } from "vue"
import { mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"

import RText from "../../text/RText.vue"
import RWell from "../RWell.vue"

describe("RWell", () => {
    it("renders a square well with its default slot", () => {
        const wrapper = mount(RWell, {
            slots: {
                default: "Well content",
            },
        })

        expect(wrapper.element.tagName).toBe("DIV")
        expect(wrapper.classes()).toContain("rui-well")
        expect(wrapper.text()).toBe("Well content")
        expect(wrapper.classes()).not.toContain("rui-surface")
        expect(wrapper.classes()).not.toContain("rui-well--elevation-2")
    })

    it("renders the requested semantic element", () => {
        const wrapper = mount(RWell, {
            props: { as: "section" },
        })

        expect(wrapper.element.tagName).toBe("SECTION")
    })

    it("forwards native attributes, classes, styles, and listeners", async () => {
        const onClick = vi.fn()
        const wrapper = mount(RWell, {
            attrs: {
                id: "activity-well",
                class: "custom-well",
                style: "min-height: 80px",
                "data-testid": "well",
                onClick,
            },
        })

        await wrapper.trigger("click")

        expect(wrapper.attributes("id")).toBe("activity-well")
        expect(wrapper.classes()).toContain("custom-well")
        expect(wrapper.classes()).toContain("rui-well")
        expect(wrapper.element.style.minHeight).toBe("80px")
        expect(wrapper.attributes("data-testid")).toBe("well")
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("applies contentColor without replacing caller styles", () => {
        const wrapper = mount(RWell, {
            props: { contentColor: "rebeccapurple" },
            attrs: { style: "min-height: 80px" },
        })

        expect(wrapper.element.style.minHeight).toBe("80px")
        expect(wrapper.element.style.getPropertyValue("--rui-comp-well-content-color")).toBe("rebeccapurple")
    })

    it("provides the existing text-emphasis context", () => {
        const Host = defineComponent({
            components: { RText, RWell },
            template: `
                <RWell>
                    <RText emphasis="high">High</RText>
                    <RText emphasis="medium">Medium</RText>
                    <RText emphasis="low">Low</RText>
                </RWell>
            `,
        })
        const wrapper = mount(Host)
        const well = wrapper.get(".rui-well")

        expect(wrapper.findAll(".rui-text")).toHaveLength(3)
        expect(well.html()).toContain("rui-text--emphasis-high")
        expect(well.html()).toContain("rui-text--emphasis-medium")
        expect(well.html()).toContain("rui-text--emphasis-low")
    })
})
