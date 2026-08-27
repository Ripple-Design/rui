import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import { nextTick } from "vue"

import RCheckbox from "../RCheckbox.vue"

describe("RCheckbox", () => {
    it("restores native indeterminate state after activation", async () => {
        const wrapper = mount(RCheckbox, {
            props: {
                indeterminate: true,
                modelValue: false,
            },
        })
        const input = wrapper.get<HTMLInputElement>("input")

        input.element.indeterminate = false
        await input.trigger("change")
        await nextTick()

        expect(input.element.indeterminate).toBe(true)
    })
})
