<script setup lang="ts">
import { RButton, RForm, RSelectField, RSelectOption, RTextField, useForm } from "@ripple-design/rui"
import { ref } from "vue"

const { form, value } = useForm<{
    account: {
        email: string
        password: string
        confirmPassword: string
        country: string
    }
}>({
    account: {
        email: [
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
        ],
        password: [
            { required: true, message: "Password is required" },
            { min: 8, message: "Use at least 8 characters", trigger: ["input", "blur"] },
        ],
        confirmPassword: [
            { required: true, message: "Confirm your password" },
            { sameAs: "account.password", message: "Passwords do not match" },
        ],
        country: [{ required: true, message: "Choose a country", trigger: "change" }],
    },
})

const submittedEmail = ref<string>()

function handleSubmit() {
    submittedEmail.value = value.account.email
}
</script>

<template>
    <RForm :form class="form-demo" @submit="handleSubmit">
        <div class="form-demo__fields">
            <RTextField
                name="account.email"
                label="Email"
                autocomplete="email"
                helper-text="Use an address you can access."
            />
            <RTextField
                name="account.password"
                label="Password"
                type="password"
                autocomplete="new-password"
            />
            <RTextField
                name="account.confirmPassword"
                label="Confirm password"
                type="password"
                autocomplete="new-password"
            />
            <RSelectField name="account.country" label="Country">
                <RSelectOption value="ca" label="Canada" />
                <RSelectOption value="jp" label="Japan" />
                <RSelectOption value="us" label="United States" />
            </RSelectField>
        </div>

        <div class="form-demo__actions">
            <RButton type="submit">Create account</RButton>
            <output v-if="submittedEmail" class="form-demo__result">
                Account created for {{ submittedEmail }}.
            </output>
        </div>
    </RForm>
</template>

<style scoped lang="scss">
.form-demo {
    display: grid;
    gap: 24px;
    width: 100%;
}

.form-demo__fields {
    display: grid;
    gap: 16px;
    width: 100%;
}

.form-demo__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}

.form-demo__result {
    color: var(--rui-sys-color-on-surface-variant);
}
</style>
