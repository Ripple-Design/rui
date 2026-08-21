import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import gridSource from "../RGrid.vue?raw"
import RGrid from "../RGrid.vue"

describe("RGrid", () => {
    it("targets direct items without Vue slotted scope markers", () => {
        expect(gridSource).toContain(".rui-grid > :deep(.rui-grid__item)")
        expect(gridSource).toContain(".rui-grid--responsive-viewport > :deep(.rui-grid__item)")
        expect(gridSource).toContain(".rui-grid--responsive-container > :deep(.rui-grid__item)")
        expect(gridSource).not.toContain(":slotted(")
        expect(gridSource).not.toContain("data-rui-grid-column-span-mode")
    })

    it("uses viewport mode and the base variable for scalar columns", () => {
        const wrapper = mount(RGrid, { props: { columns: 3 } })
        const grid = wrapper.get(".rui-grid")

        expect(grid.classes()).toContain("rui-grid--responsive-viewport")
        expect(grid.element.style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(3, minmax(0, 1fr))")
        expect(grid.element.style.getPropertyValue("--rui-comp-grid-cols-sm")).toBe("")
    })

    it("forward-fills canonical viewport columns from xs through xxl", () => {
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
    })

    it("uses the same column variables in container mode", async () => {
        const wrapper = mount(RGrid, {
            props: {
                columns: { xs: 1, md: 3, xxl: 6 },
                responsive: "container",
            },
        })
        const grid = wrapper.get(".rui-grid")
        const style = grid.element.style

        expect(grid.classes()).toContain("rui-grid--responsive-container")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xs")).toBe("repeat(1, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-sm")).toBe("repeat(1, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-md")).toBe("repeat(3, minmax(0, 1fr))")
        expect(style.getPropertyValue("--rui-comp-grid-cols-xxl")).toBe("repeat(6, minmax(0, 1fr))")

        await wrapper.setProps({ responsive: "viewport" })

        expect(grid.classes()).toContain("rui-grid--responsive-viewport")
        expect(style.getPropertyValue("--rui-comp-grid-cols-md")).toBe("repeat(3, minmax(0, 1fr))")
    })
})
