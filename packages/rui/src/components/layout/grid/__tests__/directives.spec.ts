import { mount } from "@vue/test-utils"
import { defineComponent, h, withDirectives } from "vue"
import { describe, expect, it } from "vitest"

import { vColumnSpan, vRowSpan, vSpan } from "../directives.ts"

const SpanHost = defineComponent({
    props: {
        columnSpan: { required: false },
        rowSpan: { required: false },
    },
    setup(props) {
        return () => {
            const vnode = h("div", { class: "target author-item" })

            if (props.columnSpan !== undefined) {
                withDirectives(vnode, [[vColumnSpan, props.columnSpan]])
            }

            if (props.rowSpan !== undefined) {
                withDirectives(vnode, [[vRowSpan, props.rowSpan]])
            }

            return vnode
        }
    },
})

const AliasHost = defineComponent({
    setup() {
        return () => withDirectives(h("div", { class: "target author-item" }), [[vSpan, 3]])
    },
})

describe("grid span directives", () => {
    it("marks scalar, full, and alias targets as grid items", () => {
        const scalar = mount(SpanHost, {
            props: { columnSpan: 2, rowSpan: "full" },
        }).get(".target")
        const alias = mount(AliasHost).get(".target")

        expect(scalar.classes()).toEqual(expect.arrayContaining(["author-item", "rui-grid__item"]))
        expect(scalar.attributes("data-rui-grid-column-span-mode")).toBeUndefined()
        expect(scalar.attributes("data-rui-grid-row-span-mode")).toBeUndefined()
        expect(scalar.element.style.getPropertyValue("--rui-comp-grid-column-span-xs")).toBe("span 2")
        expect(scalar.element.style.getPropertyValue("--rui-comp-grid-row-span-cxs")).toBe("1 / -1")
        expect(alias.classes()).toEqual(expect.arrayContaining(["author-item", "rui-grid__item"]))
        expect(alias.element.style.getPropertyValue("--rui-comp-grid-column-span-xs")).toBe("span 3")
    })

    it("resolves viewport spans from xs through xxl", () => {
        const target = mount(SpanHost, {
            props: { columnSpan: { xs: 1, md: "full", xxl: 3 } },
        }).get(".target")
        const style = target.element.style

        expect(target.classes()).toContain("rui-grid__item")
        expect(target.attributes("data-rui-grid-column-span-mode")).toBe("viewport")
        expect(style.getPropertyValue("--rui-comp-grid-column-span-xs")).toBe("span 1")
        expect(style.getPropertyValue("--rui-comp-grid-column-span-sm")).toBe("span 1")
        expect(style.getPropertyValue("--rui-comp-grid-column-span-md")).toBe("1 / -1")
        expect(style.getPropertyValue("--rui-comp-grid-column-span-xl")).toBe("1 / -1")
        expect(style.getPropertyValue("--rui-comp-grid-column-span-xxl")).toBe("span 3")
    })

    it("resolves container spans from cxs through cxxl", () => {
        const target = mount(SpanHost, {
            props: { rowSpan: { cxs: 1, clg: "full", cxxl: 2 } },
        }).get(".target")
        const style = target.element.style

        expect(target.classes()).toContain("rui-grid__item")
        expect(target.attributes("data-rui-grid-row-span-mode")).toBe("container")
        expect(style.getPropertyValue("--rui-comp-grid-row-span-cxs")).toBe("span 1")
        expect(style.getPropertyValue("--rui-comp-grid-row-span-cmd")).toBe("span 1")
        expect(style.getPropertyValue("--rui-comp-grid-row-span-clg")).toBe("1 / -1")
        expect(style.getPropertyValue("--rui-comp-grid-row-span-cxl")).toBe("1 / -1")
        expect(style.getPropertyValue("--rui-comp-grid-row-span-cxxl")).toBe("span 2")
    })

    it("keeps the marker while clearing responsive state after updates", async () => {
        const wrapper = mount(SpanHost, {
            props: { columnSpan: { xs: 2, lg: 4 } },
        })
        const target = wrapper.get(".target")

        await wrapper.setProps({ columnSpan: "full" })

        expect(target.classes()).toContain("rui-grid__item")
        expect(target.attributes("data-rui-grid-column-span-mode")).toBeUndefined()
        expect(target.element.style.getPropertyValue("--rui-comp-grid-column-span-lg")).toBe("")
        expect(target.element.style.getPropertyValue("--rui-comp-grid-column-span-xs")).toBe("1 / -1")
    })

    it("keeps column and row responsive modes independent", () => {
        const target = mount(SpanHost, {
            props: {
                columnSpan: { xs: 2, lg: 4 },
                rowSpan: { cxs: 1, clg: 3 },
            },
        }).get(".target")

        expect(target.classes().filter((className) => className === "rui-grid__item")).toHaveLength(1)
        expect(target.attributes("data-rui-grid-column-span-mode")).toBe("viewport")
        expect(target.attributes("data-rui-grid-row-span-mode")).toBe("container")
    })
})
