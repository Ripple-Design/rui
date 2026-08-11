import { defineComponent, h, nextTick, ref } from "vue"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import { RSelectOption } from "@/components"

import RSelectField from "../RSelectField.vue"

describe("RSelectField", () => {
    it("preserves standalone v-model updates and selected labels", async () => {
        const value = ref<unknown>("cn")
        const TestSelect = defineComponent({
            setup() {
                return () =>
                    h(RSelectField, {
                        label: "Country",
                        modelValue: value.value,
                        "onUpdate:modelValue": (nextValue: unknown) => {
                            value.value = nextValue
                        },
                    }, {
                        default: () => [
                            h(RSelectOption, { label: "China", value: "cn" }),
                            h(RSelectOption, { label: "United States", value: "us" }),
                        ],
                    })
            },
        })
        const wrapper = mount(TestSelect)

        await nextTick()
        expect(wrapper.get(".rui-select-field__trigger").text()).toBe("China")

        await wrapper.get(".rui-select-field__trigger").trigger("click")
        await nextTick()
        const menuItem = document.body.querySelectorAll<HTMLElement>(".rui-menu-item")[1]
        if (!menuItem) {
            throw new Error("Missing United States option.")
        }

        menuItem.click()
        await nextTick()

        expect(value.value).toBe("us")
        expect(wrapper.get(".rui-select-field__trigger").text()).toBe("United States")
    })

    it("keeps filter text separate from the native field name", async () => {
        const wrapper = mount(RSelectField, {
            attrs: { name: "country" },
            props: {
                filterable: true,
                label: "Country",
            },
            slots: {
                default: () => [
                    h(RSelectOption, { label: "China", value: "cn" }),
                    h(RSelectOption, { label: "United States", value: "us" }),
                ],
            },
        })

        const trigger = wrapper.get("input.rui-select-field__trigger")
        await trigger.setValue("United")
        await nextTick()

        expect(trigger.attributes("name")).toBeUndefined()
        expect((trigger.element as HTMLInputElement).value).toBe("United")
    })
})
