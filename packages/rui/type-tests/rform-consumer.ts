import { h } from "vue"

import { RForm, useForm, type RFormController } from "@ripple-design/rui"

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
        event.form.value.missing
    },
    onSubmit(event) {
        const value: Values = event.value
        value.account.email.toUpperCase()
        event.form.setValue("account.email", "name@example.com")

        // @ts-expect-error The form value does not contain this property.
        event.value.account.missing
    },
})

type RFormInstance = InstanceType<typeof RForm<Values>>

declare const instance: RFormInstance

const result: Promise<boolean> = instance.submit()
void result
instance.submit(new SubmitEvent("submit"))
