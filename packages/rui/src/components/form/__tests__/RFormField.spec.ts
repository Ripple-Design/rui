import { h, nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RForm from "../RForm.vue"
import { useForm } from "../useForm"
import RChip from "@/components/chip/RChip.vue"
import RChipGroup from "@/components/chip/RChipGroup.vue"
import RRadioButton from "@/components/radioButton/RRadioButton.vue"
import RRadioButtonGroup from "@/components/radioButton/RRadioButtonGroup.vue"
import { RSelectOption } from "@/components"
import RSelectField from "@/components/selectField/RSelectField.vue"
import RSlider from "@/components/slider/RSlider.vue"
import RTextField from "@/components/textField/RTextField.vue"

function dispatchFocusout(root: Element, relatedTarget: EventTarget | null) {
    root.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget }))
}

async function clickMenuItem(label: string) {
    const item = [...document.body.querySelectorAll<HTMLElement>(".rui-menu-item")]
        .reverse()
        .find((candidate) => candidate.textContent?.trim() === label)
    if (!item) {
        throw new Error(`Missing menu item "${label}".`)
    }

    item.click()
    await nextTick()
}

describe("RForm field bindings", () => {
    it("binds a named text field to its nested form value", async () => {
        const { form, value } = useForm<{
            account: {
                email: string
            }
        }>({
            account: {
                email: [{ required: true, message: "Email is required" }],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () => h(RTextField, { label: "Email", name: "account.email" }),
            },
        })

        await nextTick()
        await wrapper.get("input").setValue("rui@example.com")

        expect(value.account.email).toBe("rui@example.com")
        expect(form.fields["account.email"]!.dirty).toBe(true)
    })

    it("shows blur validation errors through the existing field shell", async () => {
        const { form } = useForm<{ email: string }>({
            email: [{ required: true, message: "Email is required" }],
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () => h(RTextField, { label: "Email", name: "email" }),
            },
        })

        await wrapper.get("input").trigger("focusin")
        await wrapper.get("input").trigger("focusout")
        await nextTick()
        await Promise.resolve()

        expect(wrapper.text()).toContain("Email is required")
        expect(wrapper.get("input").attributes("aria-invalid")).toBe("true")
    })

    it("binds a radio group once, validates on change, and restores its selected default", async () => {
        const { form, value } = useForm<{
            account: {
                plan: string
            }
        }>({
            account: {
                plan: [{ min: 4, message: "Choose a longer plan", trigger: "change" }],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () =>
                    h(RRadioButtonGroup, { name: "account.plan" }, {
                        default: () => [
                            h(RRadioButton, { value: "starter" }, () => "Starter"),
                            h(RRadioButton, { value: "pro" }, () => "Pro"),
                        ],
                    }),
            },
        })

        await nextTick()

        const root = wrapper.get(".rui-radio-button-group")
        const inputs = wrapper.findAll("input[type='radio']")
        expect(value.account.plan).toBe("starter")
        expect(form.dirty).toBe(false)

        dispatchFocusout(root.element, inputs[1]!.element)
        expect(form.fields["account.plan"]!.touched).toBe(false)

        await inputs[1]!.setValue()
        await nextTick()
        await Promise.resolve()
        expect(value.account.plan).toBe("pro")
        expect(form.fields["account.plan"]!.invalid).toBe(true)

        dispatchFocusout(root.element, document.body)
        await nextTick()
        await Promise.resolve()
        expect(form.fields["account.plan"]!.touched).toBe(true)
        expect(root.attributes("aria-invalid")).toBe("true")

        form.reset()
        await nextTick()
        expect(value.account.plan).toBe("starter")
        expect(form.dirty).toBe(false)
    })

    it("binds a multiple chip group at its root and validates selection changes", async () => {
        const { form, value } = useForm<{
            account: {
                interests: string[]
            }
        }>({
            account: {
                interests: [{ min: 2, message: "Choose at least two interests", trigger: "change" }],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () =>
                    h(RChipGroup, { name: "account.interests", selection: "multiple", type: "filter" }, {
                        default: () => [
                            h(RChip, { value: "design" }, () => "Design"),
                            h(RChip, { value: "engineering" }, () => "Engineering"),
                        ],
                    }),
            },
        })

        await nextTick()

        const root = wrapper.get(".rui-chip-group")
        const chips = wrapper.findAll(".rui-chip__primary")
        expect(value.account.interests).toEqual([])
        expect(form.dirty).toBe(false)

        await chips[0]!.trigger("click")
        await nextTick()
        await Promise.resolve()
        expect(value.account.interests).toEqual(["design"])
        expect(form.fields["account.interests"]!.invalid).toBe(true)

        dispatchFocusout(root.element, document.body)
        await nextTick()
        await Promise.resolve()
        expect(form.fields["account.interests"]!.touched).toBe(true)
        expect(root.attributes("aria-invalid")).toBe("true")

        await chips[1]!.trigger("click")
        await nextTick()
        await Promise.resolve()
        expect(value.account.interests).toEqual(["design", "engineering"])
        expect(form.fields["account.interests"]!.valid).toBe(true)
    })

    it("binds a named select option value and validates it as a change", async () => {
        const { form, value } = useForm<{
            account: {
                country: string
            }
        }>({
            account: {
                country: [{ type: "string", message: "Choose a country", trigger: "change" }],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () =>
                    h(RSelectField, { label: "Country", name: "account.country" }, {
                        default: () => [
                            h(RSelectOption, { label: "China", value: "cn" }),
                            h(RSelectOption, { label: "United States", value: "us" }),
                        ],
                    }),
            },
        })

        await wrapper.get(".rui-select-field__trigger").trigger("click")
        await nextTick()
        await clickMenuItem("United States")
        await nextTick()
        await Promise.resolve()

        expect(value.account.country).toBe("us")
        expect(form.fields["account.country"]!.dirty).toBe(true)
        expect(form.fields["account.country"]!.valid).toBe(true)
        expect(wrapper.get(".rui-select-field__trigger").attributes("name")).toBeUndefined()
    })

    it("keeps filter text out of the named select form value until option commit", async () => {
        const { form, value } = useForm<{
            account: {
                country: string
            }
        }>({
            account: {
                country: [{ required: true, message: "Choose a country" }],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () =>
                    h(RSelectField, { filterable: true, label: "Country", name: "account.country" }, {
                        default: () => [
                            h(RSelectOption, { label: "China", value: "cn" }),
                            h(RSelectOption, { label: "United States", value: "us" }),
                        ],
                    }),
            },
        })

        const trigger = wrapper.get("input.rui-select-field__trigger")
        await trigger.setValue("United")
        await nextTick()

        expect(value.account.country).toBeNull()
        expect(form.fields["account.country"]!.dirty).toBe(false)

        await clickMenuItem("United States")
        await nextTick()
        await Promise.resolve()

        expect(value.account.country).toBe("us")
        expect((trigger.element as HTMLInputElement).value).toBe("United States")
    })

    it("binds a named slider across input, change, keyboard, and blur phases", async () => {
        const changes: number[] = []
        const { form, value } = useForm<{
            settings: {
                volume: number
            }
        }>({
            settings: {
                volume: [
                    { required: true, message: "Volume is required" },
                    { min: 30, message: "Volume is too low", trigger: "input" },
                    { max: 35, message: "Volume is too high", trigger: "change" },
                ],
            },
        })
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () =>
                    h(RSlider, {
                        ariaLabel: "Volume",
                        name: "settings.volume",
                        step: 10,
                        onChange(value: number) {
                            changes.push(value)
                        },
                    }),
            },
        })

        await nextTick()

        const root = wrapper.get(".rui-slider")
        const input = wrapper.get("input[type='range']")
        ;(input.element as HTMLInputElement).value = "40"
        await input.trigger("input")
        await nextTick()
        await Promise.resolve()

        expect(value.settings.volume).toBe(40)
        expect(form.fields["settings.volume"]!.valid).toBe(true)
        expect(input.attributes("name")).toBeUndefined()
        expect(root.attributes("name")).toBeUndefined()
        expect(input.attributes("aria-required")).toBe("true")

        await input.trigger("change")
        await nextTick()
        await Promise.resolve()
        expect(form.fields["settings.volume"]!.invalid).toBe(true)
        expect(changes).toEqual([40])

        dispatchFocusout(root.element, document.body)
        await nextTick()
        await Promise.resolve()
        expect(input.attributes("aria-invalid")).toBe("true")

        await input.trigger("keydown", { key: "ArrowLeft" })
        await nextTick()
        await Promise.resolve()
        expect(value.settings.volume).toBe(30)
        expect(changes).toEqual([40, 30])
        expect(form.fields["settings.volume"]!.valid).toBe(true)
    })

    it("binds range sliders as one form field and keeps thumb focus contained", async () => {
        const { form, value } = useForm(
            {
                settings: {
                    price: [20, 80] as [number, number],
                },
            },
            {
                settings: {
                    price: [{ type: "array", message: "Price range is required" }],
                },
            },
        )
        const wrapper = mount(RForm, {
            props: { form },
            slots: {
                default: () => h(RSlider, { ariaLabel: "Price range", name: "settings.price", step: 10 }),
            },
        })

        const root = wrapper.get(".rui-slider")
        const inputs = wrapper.findAll("input[type='range']")
        ;(inputs[0]!.element as HTMLInputElement).value = "30"
        await inputs[0]!.trigger("input")
        await nextTick()

        expect(value.settings.price).toEqual([30, 80])
        expect(inputs).toHaveLength(2)
        expect(inputs[0]!.attributes("name")).toBeUndefined()
        expect(inputs[1]!.attributes("name")).toBeUndefined()

        dispatchFocusout(root.element, inputs[1]!.element)
        expect(form.fields["settings.price"]!.touched).toBe(false)

        dispatchFocusout(root.element, document.body)
        await nextTick()
        await Promise.resolve()
        expect(form.fields["settings.price"]!.touched).toBe(true)
    })
})
