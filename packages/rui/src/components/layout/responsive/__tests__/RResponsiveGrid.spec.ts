import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RResponsiveGrid from "../RResponsiveGrid.vue"

describe("RResponsiveGrid", () => {
    it("uses canonical container-responsive columns", () => {
        const wrapper = mount(RResponsiveGrid)
        const grid = wrapper.get(".rui-grid")

        expect(grid.classes()).toContain("rui-grid--responsive-container")
        expect(grid.element.style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(4, minmax(0, 1fr))")
        expect(grid.element.style.getPropertyValue("--rui-comp-grid-cols-sm")).toBe("repeat(8, minmax(0, 1fr))")
        expect(grid.element.style.getPropertyValue("--rui-comp-grid-cols-md")).toBe("repeat(12, minmax(0, 1fr))")
    })

    it("adds responsive block padding only when requested", () => {
        const padded = mount(RResponsiveGrid, {
            props: { blockPadding: true },
        })
        const unpadded = mount(RResponsiveGrid)

        expect(
            padded.get(".rui-responsive-container").attributes("data-rui-responsive-container-block-padding"),
        ).toBe("true")
        expect(
            unpadded.get(".rui-responsive-container").attributes("data-rui-responsive-container-block-padding"),
        ).toBeUndefined()
    })

    it("preserves explicit shared and axis-specific gap overrides", () => {
        const wrapper = mount(RResponsiveGrid, {
            props: {
                gap: "12px",
                columnGap: "8px",
                rowGap: "20px",
            },
        })
        const style = wrapper.get(".rui-grid").element.style

        expect(style.getPropertyValue("--rui-comp-grid-gap")).toBe("12px")
        expect(style.getPropertyValue("--rui-comp-grid-column-gap")).toBe("8px")
        expect(style.getPropertyValue("--rui-comp-grid-row-gap")).toBe("20px")
    })
})
