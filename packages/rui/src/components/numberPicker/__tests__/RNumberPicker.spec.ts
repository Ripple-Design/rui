import { nextTick, ref } from "vue"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RNumberPicker from "../RNumberPicker.vue"
import {
    resolveNumberPickerRange,
    resolveWheelOffset,
    valueAtIndex,
    visibleValue,
} from "../shared"

function dispatchPointer(element: HTMLElement, type: string, properties: Record<string, number | boolean>) {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, { value }])))
    element.dispatchEvent(event)
}

describe("RNumberPicker numeric helpers", () => {
    it("keeps decimal steps precise and includes a final partial step", () => {
        const range = resolveNumberPickerRange(0, 1, 0.3)

        expect(range.count).toBe(5)
        expect(valueAtIndex(3, range)).toBe(0.9)
        expect(valueAtIndex(4, range)).toBe(1)
    })

    it("keeps non-wrapping neighbor values empty beyond a boundary", () => {
        const range = resolveNumberPickerRange(1, 3, 1)

        expect(visibleValue(0, -1, range, false)).toBeNull()
        expect(visibleValue(0, -1, range, true)).toBe(3)
    })

    it("resists wheel movement beyond non-wrapping boundaries", () => {
        const range = resolveNumberPickerRange(1, 3, 1)

        expect(resolveWheelOffset(-1, 0, range, false)).toBeGreaterThan(-1)
        expect(resolveWheelOffset(-1, 0, range, false)).toBeLessThan(0)
    })
})

describe("RNumberPicker", () => {
    it("normalizes the external value and exposes spinbutton values", async () => {
        const value = ref(12)
        const wrapper = mount(RNumberPicker, {
            props: {
                max: 10,
                min: 1,
                modelValue: value.value,
                "onUpdate:modelValue": (next: number) => {
                    value.value = next
                },
            },
        })

        await nextTick()

        expect(value.value).toBe(10)
        expect(wrapper.attributes("aria-valuenow")).toBe("10")
        expect(wrapper.attributes("aria-valuemin")).toBe("1")
        expect(wrapper.attributes("aria-valuemax")).toBe("10")
    })

    it("uses the formatter for visible and accessible text", () => {
        const wrapper = mount(RNumberPicker, {
            props: {
                formatValue: (value) => `Value ${value}`,
                max: 10,
                min: 1,
                modelValue: 3,
            },
        })

        expect(wrapper.attributes("aria-valuetext")).toBe("Value 3")
        expect(wrapper.get(".rui-number-picker__item--selected").text()).toBe("Value 3")
    })

    it("handles decimal keyboard increments", async () => {
        const wrapper = mount(RNumberPicker, {
            props: {
                max: 3,
                min: 0,
                modelValue: 0.5,
                step: 0.5,
            },
        })

        await wrapper.trigger("keydown", { key: "ArrowUp" })
        expect(wrapper.attributes("aria-valuenow")).toBe("0.5")
    })

    it("starts wrapping keyboard motion", async () => {
        const wrapper = mount(RNumberPicker, {
            props: {
                max: 3,
                min: 1,
                modelValue: 3,
                wrap: true,
            },
        })

        await wrapper.trigger("keydown", { key: "ArrowUp" })
        expect(wrapper.attributes("aria-valuenow")).toBe("3")
    })

    it("updates as a pointer drag crosses each row", async () => {
        const wrapper = mount(RNumberPicker, {
            attachTo: document.body,
            props: { max: 5, min: 1, modelValue: 3 },
        })
        const element = wrapper.element as HTMLElement
        Object.defineProperty(element, "getBoundingClientRect", {
            configurable: true,
            value: () => ({ bottom: 192, height: 192, left: 0, right: 160, top: 0, width: 160 }),
        })

        dispatchPointer(element, "pointerdown", { button: 0, clientY: 96, isPrimary: true, pointerId: 1, timeStamp: 0 })
        dispatchPointer(element, "pointermove", { clientY: 32, isPrimary: true, pointerId: 1, timeStamp: 16 })
        dispatchPointer(element, "pointermove", { clientY: 20, isPrimary: true, pointerId: 1, timeStamp: 32 })
        await nextTick()

        expect(wrapper.emitted<number[][]>("update:modelValue")?.[0]).toEqual([4])
        expect(wrapper.classes()).toContain("rui-number-picker--dragging")

        dispatchPointer(element, "pointerup", { clientY: 32, isPrimary: true, pointerId: 1, timeStamp: 32 })
        await nextTick()
        expect(wrapper.emitted("change")).toHaveLength(1)
        wrapper.unmount()
    })

    it("wraps by default at the range endpoints", async () => {
        const wrapper = mount(RNumberPicker, {
            props: { max: 3, min: 1, modelValue: 3 },
        })

        await wrapper.trigger("keydown", { key: "ArrowUp" })
        expect(wrapper.get(".rui-number-picker__item--selected").text()).toBe("3")
    })

    it("renders two offscreen slots so partial drags have an incoming row", () => {
        const wrapper = mount(RNumberPicker, {
            props: { max: 10, min: 1, modelValue: 5 },
        })

        expect(wrapper.findAll(".rui-number-picker__item")).toHaveLength(5)
        expect(wrapper.text()).toContain("3")
        expect(wrapper.text()).toContain("7")
    })

    it("prevents updates while disabled", async () => {
        const value = ref(2)
        const wrapper = mount(RNumberPicker, {
            props: {
                disabled: true,
                max: 10,
                min: 1,
                modelValue: value.value,
                "onUpdate:modelValue": (next: number) => {
                    value.value = next
                },
            },
        })

        await wrapper.trigger("keydown", { key: "ArrowUp" })
        expect(value.value).toBe(2)
        expect(wrapper.attributes("tabindex")).toBe("-1")
        expect(wrapper.attributes("aria-disabled")).toBe("true")
    })
})
