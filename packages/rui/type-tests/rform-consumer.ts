import { RForm, useForm, type RFormController } from "@ripple-design/rui"
import { h } from "vue"

type Values = {
    account: {
        email: string
    }
    remember: boolean
}

const { form } = useForm<Values>({
    account: {
        email: [{ required: true, type: "email" }],
    },
    remember: [{ required: true }],
})

h(RForm<Values>, {
    form,
    onInvalidSubmit(event) {
        const controller: RFormController<Values> = event.form
        controller.setValue("remember", true)

        // @ts-expect-error The form value does not contain this property.
        void event.form.value.missing
    },
    onSubmit(event) {
        const value: Values = event.value
        value.account.email.toUpperCase()
        event.form.setValue("account.email", "name@example.com")

        // @ts-expect-error The form value does not contain this property.
        void event.value.account.missing
    },
})

type RFormInstance = InstanceType<typeof RForm<Values>>

declare const instance: RFormInstance

const result: Promise<boolean> = instance.submit()
void result
void instance.submit(new SubmitEvent("submit"))

type ConditionalValues = {
    enabled: boolean
    name: string
}

useForm<ConditionalValues>({
    enabled: false,
    name: "",
}, {
    name: [
        {
            required: true,
            dependsOn: ["enabled"],
            validateWhen(name, values) {
                name.trim()
                return values.enabled
            },
        },
    ],
})

useForm<ConditionalValues>({
    enabled: false,
    name: "",
}, {
    name: [
        {
            // @ts-expect-error validateWhen must be synchronous.
            validateWhen: async () => true,
        },
    ],
})
