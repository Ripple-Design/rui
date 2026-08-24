import { defineComponent, h, nextTick, ref } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it } from "vitest"

import RSpinner from "../RSpinner.vue"
import RSpinnerOption from "../RSpinnerOption.vue"

afterEach(() => {
    document.body.innerHTML = ""
})

describe("RSpinner", () => {
    it("displays the selected option and commits a new option", async () => {
        const value = ref<unknown>("active")
        const TestSpinner = defineComponent({
            setup() {
                return () =>
                    h(RSpinner, {
                        modelValue: value.value,
                        "onUpdate:modelValue": (nextValue: unknown) => {
                            value.value = nextValue
                        },
                    }, {
                        default: () => [
                            h(RSpinnerOption, { label: "Active", value: "active" }),
                            h(RSpinnerOption, { label: "Paused", value: "paused" }),
                        ],
                    })
            },
        })
        const wrapper = mount(TestSpinner, { attachTo: document.body })

        await nextTick()
        const trigger = wrapper.get("button.rui-spinner")
        expect(trigger.text()).toContain("Active")
        expect(trigger.attributes("aria-required")).toBe("true")

        await trigger.trigger("click")
        await nextTick()
        const options = document.body.querySelectorAll<HTMLElement>("[role='option']")
        const paused = [...options].find((option) => option.textContent?.includes("Paused"))
        if (!paused) {
            throw new Error("Missing Paused option.")
        }

        paused.click()
        await nextTick()

        expect(value.value).toBe("paused")
        expect(trigger.text()).toContain("Paused")
    })

    it("renders disabled options as unavailable", async () => {
        const wrapper = mount(RSpinner, {
            attachTo: document.body,
            props: { modelValue: "active" },
            slots: {
                default: () => [
                    h(RSpinnerOption, { label: "Active", value: "active" }),
                    h(RSpinnerOption, { disabled: true, label: "Paused", value: "paused" }),
                ],
            },
        })

        await wrapper.get("button.rui-spinner").trigger("click")
        await nextTick()

        const disabled = [...document.body.querySelectorAll<HTMLElement>("[role='option']")].find((option) =>
            option.textContent?.includes("Paused"),
        )
        expect(disabled?.getAttribute("aria-disabled")).toBe("true")
    })
})
