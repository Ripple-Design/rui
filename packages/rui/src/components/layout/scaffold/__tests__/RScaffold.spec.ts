import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import { h, nextTick } from "vue"

import RAppBarContainer from "../../../navigation/appBar/RAppBarContainer.vue"
import RCollapsingAppBar from "../../../navigation/appBar/RCollapsingAppBar.vue"
import RScaffold from "../RScaffold.vue"
import RScaffoldLayout from "../RScaffoldLayout.vue"

describe("RScaffold", () => {
    it("wraps app-bar slot content in a configured app bar container", () => {
        const wrapper = mount(RScaffold, {
            props: {
                appBar: { color: "primary", contentAlign: "centered" },
            },
            slots: {
                "app-bar": () => h("div", { "data-test": "app-bar-content" }, "Header"),
            },
        })

        expect(wrapper.findAll(".rui-app-bar-container")).toHaveLength(1)
        expect(wrapper.find(".rui-app-bar-container").classes()).toContain("rui-app-bar-container--layout-static")
        expect(wrapper.find(".rui-app-bar-container").classes()).toContain("rui-app-bar-container--color-primary")
        expect(wrapper.get("[data-test=app-bar-content]").text()).toBe("Header")
    })

    it("uses grid mode for body-aligned app bars", () => {
        const wrapper = mount(RScaffold, {
            props: {
                gridMode: "full-width",
                appBar: {},
            },
            slots: {
                "app-bar": () => h("div", "Header"),
            },
        })

        expect(wrapper.find(".rui-responsive-container").exists()).toBe(false)
    })

    it("updates body-aligned app bars when grid mode changes", async () => {
        const wrapper = mount(RScaffold, {
            props: {
                gridMode: "centered",
                appBar: { contentAlign: "body" },
            },
            slots: {
                "app-bar": () => h("div", "Header"),
            },
        })

        expect(wrapper.find(".rui-responsive-container").classes()).toContain("rui-responsive-container--centered")

        await wrapper.setProps({ gridMode: "full-width" })

        expect(wrapper.find(".rui-responsive-container").exists()).toBe(false)
    })

    it("selects collapsing layout for a collapsing app-bar slot", async () => {
        const wrapper = mount(RScaffold, {
            props: {
                appBar: { expandedHeight: "160px", collapsedHeight: "56px", scrollBehavior: "exit-until-collapsed" },
            },
            slots: {
                "app-bar": () => h(RCollapsingAppBar, { title: "Collapsing header" }),
            },
        })
        await nextTick()

        expect(wrapper.find(".rui-app-bar-container").classes()).toContain("rui-app-bar-container--layout-collapsing")
    })

    it("uses body alignment for app-bar slot content when no configuration is supplied", () => {
        const wrapper = mount(RScaffold, {
            slots: {
                "app-bar": () => h("div", { "data-test": "custom-header" }, "Custom header"),
            },
        })

        expect(wrapper.find(".rui-app-bar-container").exists()).toBe(true)
        expect(wrapper.find(".rui-responsive-container").classes()).toContain("rui-responsive-container--centered")
        expect(wrapper.get("[data-test=custom-header]").text()).toBe("Custom header")
    })

    it("does not render an empty app bar when configuration has no slot content", () => {
        const wrapper = mount(RScaffold, {
            props: {
                appBar: {},
            },
        })

        expect(wrapper.find(".rui-app-bar-container").exists()).toBe(false)
        expect(wrapper.find(".rui-scaffold__app-bar").exists()).toBe(false)
    })

    it("forwards root attributes and named layout slots", () => {
        const wrapper = mount(RScaffold, {
            attrs: {
                "data-test": "scaffold",
                id: "workspace",
            },
            slots: {
                navigation: () => h("div", { "data-test": "navigation" }, "Navigation"),
                "bottom-bar": () => h("div", { "data-test": "bottom-bar" }, "Bottom bar"),
            },
        })

        expect(wrapper.get(".rui-scaffold").attributes("id")).toBe("workspace")
        expect(wrapper.get(".rui-scaffold").attributes("data-test")).toBe("scaffold")
        expect(wrapper.get(".rui-scaffold__navigation [data-test=navigation]").text()).toBe("Navigation")
        expect(wrapper.get(".rui-scaffold__bottom-bar [data-test=bottom-bar]").text()).toBe("Bottom bar")
    })

    it("keeps manual app bar composition available through RScaffoldLayout", () => {
        const wrapper = mount(RScaffoldLayout, {
            slots: {
                "app-bar": () =>
                    h(RAppBarContainer, null, () => h("div", { "data-test": "manual-header" }, "Manual header")),
            },
        })

        expect(wrapper.findAll(".rui-app-bar-container")).toHaveLength(1)
        expect(wrapper.get("[data-test=manual-header]").text()).toBe("Manual header")
    })
})
