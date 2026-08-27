import { afterEach, describe, expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import {
    createInternationalizationController,
    internationalizationKey,
} from "@ripple-design/rui/foundations/internationalization/controller"
import { nextTick } from "vue"

import RDataTable from "../RDataTable.vue"

const columns = [{ key: "id", title: "ID" }]
const items = Array.from({ length: 60 }, (_, id) => ({ id }))

async function selectOption(wrapper: ReturnType<typeof mount>, label: string) {
    await wrapper.get("button.rui-spinner").trigger("click")
    await nextTick()

    const option = [...document.body.querySelectorAll<HTMLElement>("[role='option']")].find((element) =>
        element.textContent?.includes(label),
    )
    if (!option) throw new Error(`Missing ${label} option.`)

    option.click()
    await nextTick()
}

afterEach(() => {
    document.body.innerHTML = ""
})

describe("RDataTable", () => {
    it("uses a spinner to select rows per page", async () => {
        const wrapper = mount(RDataTable, {
            attachTo: document.body,
            props: {
                columns,
                items,
                itemsPerPage: 10,
                itemsPerPageOptions: [10, 25, 50],
                mobile: false,
                page: 2,
            },
        })

        const spinner = wrapper.get("button.rui-spinner")
        expect(wrapper.find(".rux-data-table__scroll .rux-data-table__footer").exists()).toBe(false)
        expect(wrapper.find(".rux-data-table__footer").exists()).toBe(true)
        expect(spinner.attributes("aria-label")).toBe("Rows per page:")
        expect(spinner.text()).toContain("10")

        await selectOption(wrapper, "25")

        expect(wrapper.emitted("update:itemsPerPage")?.at(-1)).toEqual([25])
        expect(wrapper.emitted("update:page")?.at(-1)).toEqual([1])

        await wrapper.get('button[aria-label="Next page"]').trigger("click")
        expect(wrapper.emitted("update:page")?.at(-1)).toEqual([2])
    })

    it("adds outer padding only when no control occupies that table edge", () => {
        const plainWrapper = mount(RDataTable, {
            props: { columns, items, mobile: false },
        })
        const selectWrapper = mount(RDataTable, {
            props: { columns, items, mobile: false, showSelect: true },
        })
        const leadingExpandWrapper = mount(RDataTable, {
            props: {
                columns: [{ key: "data-table-expand" }, ...columns],
                items,
                mobile: false,
            },
        })
        const groupWrapper = mount(RDataTable, {
            props: {
                groupBy: [{ key: "group" }],
                columns: [{ key: "group", title: "Group" }, ...columns],
                items: [{ group: "A", id: 1 }],
                mobile: false,
            },
        })
        const trailingExpandWrapper = mount(RDataTable, {
            props: { columns, items, mobile: false, showExpand: true },
        })

        const plainHeaders = plainWrapper.findAll("th.rux-data-table__header-cell")
        const plainCells = plainWrapper.findAll("td.rux-data-table__cell")
        const selectCells = selectWrapper.findAll("td.rux-data-table__cell")
        const leadingExpandCells = leadingExpandWrapper.findAll("td.rux-data-table__cell")
        const trailingExpandCells = trailingExpandWrapper.findAll("td.rux-data-table__cell")

        expect(plainHeaders[0]!.classes()).toContain("rux-data-table__cell--outer-start")
        expect(plainHeaders.at(-1)!.classes()).toContain("rux-data-table__cell--outer-end")
        expect(plainCells[0]!.classes()).toContain("rux-data-table__cell--outer-start")
        expect(plainCells.at(-1)!.classes()).toContain("rux-data-table__cell--outer-end")
        expect(selectCells[0]!.classes()).toContain("rux-data-table__cell--select")
        expect(leadingExpandCells[0]!.classes()).toContain("rux-data-table__cell--expand")
        expect(trailingExpandCells.at(-1)!.classes()).toContain("rux-data-table__cell--expand")
        expect(selectWrapper.find(".rux-data-table__cell--outer-start").exists()).toBe(false)
        expect(selectWrapper.find(".rux-data-table__cell--outer-end").exists()).toBe(true)
        expect(leadingExpandWrapper.find(".rux-data-table__cell--outer-start").exists()).toBe(false)
        expect(leadingExpandWrapper.find(".rux-data-table__cell--outer-end").exists()).toBe(true)
        expect(groupWrapper.find(".rux-data-table__cell--outer-start").exists()).toBe(true)
        expect(groupWrapper.find(".rux-data-table__cell--outer-end").exists()).toBe(true)
        expect(trailingExpandCells[0]!.classes()).toContain("rux-data-table__cell--outer-start")
        expect(trailingExpandWrapper.find(".rux-data-table__cell--outer-end").exists()).toBe(false)
    })

    it("localizes default footer messages", () => {
        const internationalization = createInternationalizationController({}, {}, "zh-CN")
        const wrapper = mount(RDataTable, {
            global: {
                provide: { [internationalizationKey as symbol]: internationalization },
            },
            props: { columns, items, mobile: false },
        })

        expect(wrapper.get("button.rui-spinner").attributes("aria-label")).toBe("每页行数：")
        expect(wrapper.get('button[aria-label="首页"]').exists()).toBe(true)
        expect(wrapper.get('button[aria-label="上一页"]').exists()).toBe(true)
        expect(wrapper.get('button[aria-label="下一页"]').exists()).toBe(true)
        expect(wrapper.get('button[aria-label="末页"]').exists()).toBe(true)
        expect(wrapper.get(".rux-data-table__page-text").text()).toBe("1-10，共 60 条")
    })

    it("uses a spinner in the fixed footer", async () => {
        const wrapper = mount(RDataTable, {
            attachTo: document.body,
            props: {
                fixedFooter: true,
                columns,
                items,
                itemsPerPage: 10,
                itemsPerPageOptions: [10, 25],
                mobile: false,
                page: 2,
            },
        })

        expect(wrapper.get("table > tfoot > tr > td > .rux-data-table__footer").exists()).toBe(true)
        expect(wrapper.get("tfoot button.rui-spinner").text()).toContain("10")

        await selectOption(wrapper, "25")

        expect(wrapper.emitted("update:itemsPerPage")?.at(-1)).toEqual([25])
        expect(wrapper.emitted("update:page")?.at(-1)).toEqual([1])
    })

    it("forwards footer prepend content to either footer placement", () => {
        const slots = { "footer.prepend": '<span data-test="footer-prepend">Actions</span>' }
        const regularWrapper = mount(RDataTable, {
            props: { columns, items, mobile: false },
            slots,
        })
        const fixedWrapper = mount(RDataTable, {
            props: { fixedFooter: true, columns, items, mobile: false },
            slots,
        })

        expect(regularWrapper.get(".rux-data-table__footer [data-test='footer-prepend']").text()).toBe("Actions")
        expect(fixedWrapper.get("tfoot [data-test='footer-prepend']").text()).toBe("Actions")
    })

    it("supports custom labels and unlisted controlled values", async () => {
        const wrapper = mount(RDataTable, {
            attachTo: document.body,
            props: {
                columns,
                items,
                itemsPerPage: 20,
                itemsPerPageOptions: [{ title: "Twenty-five rows", value: 25 }, -1],
                mobile: false,
            },
        })

        expect(wrapper.get("button.rui-spinner").text()).toContain("20")

        await selectOption(wrapper, "Twenty-five rows")
        expect(wrapper.emitted("update:itemsPerPage")?.at(-1)).toEqual([25])

        const allWrapper = mount(RDataTable, {
            attachTo: document.body,
            props: {
                columns,
                items,
                itemsPerPage: -1,
                itemsPerPageOptions: [-1],
                mobile: false,
            },
        })
        expect(allWrapper.get("button.rui-spinner").text()).toContain("All")
    })
})
