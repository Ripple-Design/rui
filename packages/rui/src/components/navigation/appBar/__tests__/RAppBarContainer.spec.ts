import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import { defineComponent, h, nextTick, ref } from "vue"

import RCollapsingAppBar from "../RCollapsingAppBar.vue"
import RAppBarContainer from "../RAppBarContainer.vue"
import RTopAppBar from "../RTopAppBar.vue"

describe("RAppBarContainer layout", () => {
    it("uses normal flow for static app-bar content", () => {
        const wrapper = mount(RAppBarContainer, {
            slots: {
                default: () => h(RTopAppBar, { title: "Static app bar" }),
            },
        })

        const container = wrapper.get(".rui-app-bar-container")
        expect(container.classes()).toContain("rui-app-bar-container--layout-static")
        expect(container.classes()).not.toContain("rui-app-bar-container--layout-collapsing")
        expect(wrapper.get(".rui-app-bar-container__collapsing-content").exists()).toBe(true)
    })

    it("switches to overlay geometry when it contains a collapsing app bar", async () => {
        const wrapper = mount(RAppBarContainer, {
            slots: {
                default: () => h(RCollapsingAppBar, { title: "Collapsing app bar" }),
            },
        })
        await nextTick()

        const container = wrapper.get(".rui-app-bar-container")
        expect(container.classes()).toContain("rui-app-bar-container--layout-collapsing")
        expect(container.classes()).not.toContain("rui-app-bar-container--layout-static")
    })

    it("returns to normal flow when the collapsing child is removed", async () => {
        const showCollapsing = ref(true)
        const Host = defineComponent({
            setup() {
                return () =>
                    h(RAppBarContainer, null, {
                        default: () =>
                            showCollapsing.value
                                ? h(RCollapsingAppBar, { title: "Collapsing app bar" })
                                : h(RTopAppBar, { title: "Static app bar" }),
                    })
            },
        })
        const wrapper = mount(Host)
        await nextTick()

        expect(wrapper.get(".rui-app-bar-container").classes()).toContain("rui-app-bar-container--layout-collapsing")

        showCollapsing.value = false
        await nextTick()
        await nextTick()

        expect(wrapper.get(".rui-app-bar-container").classes()).toContain("rui-app-bar-container--layout-static")
    })
})
