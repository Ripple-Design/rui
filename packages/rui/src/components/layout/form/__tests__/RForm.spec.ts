import { defineComponent, h, inject } from "vue"
import { flushPromises, mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RForm from "../RForm.vue"
import { formContextKey } from "../context"
import { useForm } from "../useForm"

describe("RForm", () => {
    it("forwards native form attributes and disables native validation", () => {
        const { form } = useForm<{ email: string }>({ email: [] })
        const wrapper = mount(RForm, {
            attrs: {
                action: "/submit",
                id: "account-form",
            },
            props: { form },
        })

        expect(wrapper.element.tagName).toBe("FORM")
        expect(wrapper.attributes("action")).toBe("/submit")
        expect(wrapper.attributes("id")).toBe("account-form")
        expect(wrapper.attributes("novalidate")).toBeDefined()
    })

    it("emits invalid-submit when submitted values fail validation", async () => {
        const { form } = useForm<{ email: string }>({
            email: [{ required: true, message: "Email is required" }],
        })
        const wrapper = mount(RForm, { props: { form } })

        await wrapper.trigger("submit")
        await flushPromises()

        expect(wrapper.emitted("submit")).toBeUndefined()
        expect(wrapper.emitted("invalidSubmit")).toHaveLength(1)
        expect(form.submitted).toBe(true)
        expect(form.fields.email!.touched).toBe(true)
    })

    it("emits submit with current values after successful validation", async () => {
        const { form, value } = useForm<{ email: string }>({
            email: [{ required: true, message: "Email is required" }],
        })
        const wrapper = mount(RForm, { props: { form } })

        value.email = "rui@example.com"
        await wrapper.trigger("submit")
        await flushPromises()

        const event = wrapper.emitted("submit")?.[0]?.[0]
        expect(event?.value).toBe(value)
        expect(event?.form).toBe(form)
    })

    it("exposes programmatic submission", async () => {
        const { form, value } = useForm<{ email: string }>({
            email: [{ required: true, message: "Email is required" }],
        })
        const wrapper = mount(RForm, { props: { form } })

        value.email = "rui@example.com"
        await wrapper.vm.submit()

        expect(wrapper.emitted("submit")).toHaveLength(1)
    })

    it("provides the required-indicator preference to descendants", () => {
        const Probe = defineComponent({
            setup() {
                const context = inject(formContextKey)
                return () => h("span", context?.requiredIndicator.value ?? "omitted")
            },
        })
        const { form } = useForm<{ email: string }>({ email: [] })
        const wrapper = mount(RForm, {
            props: {
                form,
                requiredIndicator: "label-asterisk",
            },
            slots: {
                default: () => h(Probe),
            },
        })

        expect(wrapper.text()).toBe("label-asterisk")
    })
})
