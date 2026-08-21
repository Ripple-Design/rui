import { mount } from "@vue/test-utils"
import { defineComponent, h, nextTick } from "vue"
import { beforeEach, afterEach, describe, expect, it } from "vitest"

import RIconButton from "../../../actions/button/RIconButton.vue"
import RMenu from "../RMenu.vue"
import RMenuItem from "../RMenuItem.vue"

const MenuPair = defineComponent({
    setup() {
        return () =>
            h("div", [
                h(
                    RMenu,
                    null,
                    {
                        trigger: () => h(RIconButton, { label: "First menu" }),
                        default: () => h(RMenuItem, null, () => "First action"),
                    },
                ),
                h(
                    RMenu,
                    null,
                    {
                        trigger: () => h(RIconButton, { label: "Second menu" }),
                        default: () => h(RMenuItem, null, () => "Second action"),
                    },
                ),
            ])
    },
})

beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = () => undefined
})

afterEach(() => {
    document.body.replaceChildren()
})

describe("RMenu", () => {
    it("dismisses an open menu before opening another icon-button menu", async () => {
        const wrapper = mount(MenuPair, { attachTo: document.body })
        const triggers = wrapper.get("div").findAll("button")

        await triggers[0].trigger("click")
        expect(triggers[0].attributes("aria-expanded")).toBe("true")

        triggers[1].element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }))
        await nextTick()
        expect(document.querySelector(".rui-plain-tooltip-layer.is-open")).not.toBeNull()

        triggers[1].element.dispatchEvent(new Event("pointerdown", { bubbles: true }))
        await triggers[1].trigger("click")

        expect(triggers[0].attributes("aria-expanded")).toBe("false")
        expect(triggers[1].attributes("aria-expanded")).toBe("true")
    })
})
