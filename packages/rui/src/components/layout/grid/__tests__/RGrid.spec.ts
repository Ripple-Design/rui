import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RGrid from "../RGrid.vue"

describe("RGrid", () => {
    it("sets both responsive families for scalar columns", () => {
        const wrapper = mount(RGrid, { props: { columns: 3 } })
        const style = wrapper.get(".rui-grid").element.style

        expect(style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xxl")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cxs")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cxxl")).toBe("repeat(3, minmax(0, 1fr))")
    })

    it("forward-fills viewport columns from xs through xxl", () => {
        const wrapper = mount(RGrid, {
            props: { columns: { xs: 1, sm: 2, xl: 4 } },
        })
        const style = wrapper.get(".rui-grid").element.style

        expect(style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(1, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-sm")).toBe("repeat(2, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-md")).toBe("repeat(2, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-lg")).toBe("repeat(2, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xl")).toBe("repeat(4, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xxl")).toBe("repeat(4, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cxs")).toBe("")
        expect(wrapper.get(".rui-grid").classes()).toContain("rui-grid--viewport-responsive")
    })

    it("forward-fills container columns from cxs through cxxl", async () => {
        const wrapper = mount(RGrid, {
            props: { columns: { cxs: 1, cmd: 3, cxxl: 6 } },
        })
        const style = wrapper.get(".rui-grid").element.style

        expect(style.getPropertyValue("--rui-comp-grid-cols-cxs")).toBe("repeat(1, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-csm")).toBe("repeat(1, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cmd")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-clg")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cxl")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-cxxl")).toBe("repeat(6, minmax(0, 1fr))")

        await wrapper.setProps({ columns: { xs: 2 } })

        expect(style.getPropertyValue("--rui-comp-grid-cols-cxs")).toBe("")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(2, minmax(0, 1fr))")
        expect(wrapper.get(".rui-grid").classes()).toContain("rui-grid--viewport-responsive")
    })
})
