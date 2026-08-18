import { nextTick } from "vue"
import { describe, expect, it, vi } from "vitest"

import { useForm } from "../useForm"

describe("useForm", () => {
    it("returns a stable reactive value tree for rules-only forms", () => {
        const { form, value } = useForm<{
            account: {
                email: string
            }
        }>({
            account: {
                email: [{ required: true, message: "Email is required" }],
            },
        })

        expect(form.value).toBe(value)
        expect(value.account.email).toBeUndefined()

        value.account.email = "rui@example.com"
        expect(form.dirty).toBe(true)

        form.reset()
        expect(value.account.email).toBeUndefined()
        expect(form.dirty).toBe(false)
    })

    it("uses blur as the default field validation trigger", async () => {
        const { form, value } = useForm<{ email: string }>({
            email: [{ required: true, message: "Email is required" }],
        })

        value.email = ""
        await nextTick()

        expect(form.fields.email!.valid).toBe(true)
        await expect(form.validateField("email")).resolves.toBe(false)
        expect(form.fields.email!.errors[0]?.message).toBe("Email is required")
        expect(form.fields.email!.invalid).toBe(true)
    })

    it("runs every rule during submit validation", async () => {
        const { form, value } = useForm<{ email: string }>({
            email: [
                { required: true, message: "Email is required" },
                { type: "email", message: "Email is invalid", trigger: "change" },
            ],
        })

        value.email = "invalid"

        await expect(form.validate()).resolves.toBe(false)
        expect(form.fields.email!.errors[0]?.message).toBe("Email is invalid")
    })

    it("uses the first failed rule as the field error", async () => {
        const { form, value } = useForm<{ password: string }>({
            password: [
                { required: true, message: "Password is required" },
                { min: 8, message: "Password is too short" },
            ],
        })

        value.password = ""
        await form.validate()

        expect(form.fields.password!.errors[0]?.message).toBe("Password is required")
    })

    it("rejects false values for required boolean fields", async () => {
        const { form } = useForm(
            { agreement: false },
            {
                agreement: [{ required: true, message: "You must accept the terms" }],
            },
        )

        await expect(form.validate()).resolves.toBe(false)
        expect(form.fields.agreement!.errors[0]?.message).toBe("You must accept the terms")
    })

    it("revalidates sameAs fields after their dependency changes", async () => {
        const { form, value } = useForm(
            {
                password: "password",
                confirmPassword: "password",
            },
            {
                password: [],
                confirmPassword: [{ sameAs: "password", message: "Passwords do not match" }],
            },
        )

        await expect(form.validateField("confirmPassword")).resolves.toBe(true)

        value.password = "different"
        await nextTick()
        await Promise.resolve()

        expect(form.fields.confirmPassword!.errors[0]?.message).toBe("Passwords do not match")
    })

    it("passes the field value and complete values to custom validators", async () => {
        const { form, value } = useForm(
            {
                startDate: 4,
                endDate: 8,
            },
            {
                endDate: [
                    {
                        dependsOn: ["startDate"],
                        validator(endDate, values) {
                            return endDate >= values.startDate
                        },
                        message: "End date must follow start date",
                    },
                ],
            },
        )

        await expect(form.validateField("endDate")).resolves.toBe(true)

        value.startDate = 9
        await nextTick()
        await Promise.resolve()

        expect(form.fields.endDate!.errors[0]?.message).toBe("End date must follow start date")
    })

    it("ignores stale asynchronous validator results", async () => {
        const resolvers: Array<(valid: boolean) => void> = []
        const { form, value } = useForm<{ username: string }>({
            username: [
                {
                    validator() {
                        return new Promise<boolean>((resolve) => resolvers.push(resolve))
                    },
                    message: "Username is unavailable",
                },
            ],
        })

        value.username = "first"
        const firstValidation = form.validateField("username")
        value.username = "second"
        const secondValidation = form.validateField("username")

        resolvers[1]!(true)
        await secondValidation
        resolvers[0]!(false)
        await firstValidation

        expect(form.valid).toBe(true)
        expect(form.fields.username!.errors).toHaveLength(0)
    })

    it("cancels pending validation when field state is cleared", async () => {
        let resolveValidation!: (valid: boolean) => void
        const { form, value } = useForm<{ username: string }>({
            username: [
                {
                    validator() {
                        return new Promise<boolean>((resolve) => {
                            resolveValidation = resolve
                        })
                    },
                    message: "Username is unavailable",
                },
            ],
        })

        value.username = "rui"
        const validation = form.validateField("username")
        form.clearValidateField("username")
        resolveValidation(false)
        await validation

        expect(form.fields.username!.errors).toHaveLength(0)
        expect(form.fields.username!.pending).toBe(false)
        expect(form.fields.username!.valid).toBe(true)
        expect(form.fields.username!.invalid).toBe(false)
    })

    it("cancels pending validation when a field is reset", async () => {
        let resolveValidation!: (valid: boolean) => void
        const { form, value } = useForm(
            { username: "initial" },
            {
                username: [
                    {
                        validator() {
                            return new Promise<boolean>((resolve) => {
                                resolveValidation = resolve
                            })
                        },
                        message: "Username is unavailable",
                    },
                ],
            },
        )

        value.username = "rui"
        const validation = form.validateField("username")
        form.resetField("username")
        resolveValidation(false)
        await validation

        expect(value.username).toBe("initial")
        expect(form.fields.username!.errors).toHaveLength(0)
        expect(form.fields.username!.pending).toBe(false)
        expect(form.fields.username!.valid).toBe(true)
        expect(form.fields.username!.invalid).toBe(false)
    })

    it("skips complete required rules for controls that own required semantics", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        const { form } = useForm<{ plan: string }>({
            plan: [
                {
                    required: true,
                    validator() {
                        return false
                    },
                    message: "Required plan validation",
                },
                {
                    validator() {
                        return false
                    },
                    message: "Plan is unavailable",
                },
            ],
        })

        form.registerField("plan", "starter", { ignoreRequired: true })
        form.registerField("plan", "starter", { ignoreRequired: true })

        await expect(form.validate()).resolves.toBe(false)
        expect(form.fields.plan!.errors[0]?.message).toBe("Plan is unavailable")
        expect(form.isFieldRequired("plan")).toBe(false)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn).toHaveBeenCalledWith('RForm ignores required rules for field "plan".')

        warn.mockRestore()
    })
})
