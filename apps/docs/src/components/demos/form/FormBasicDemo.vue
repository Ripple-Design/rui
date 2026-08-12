<script setup lang="ts">
import { RButton, RForm, RSelectField, RSelectOption, RTextField, useForm } from "@ripple-design/rui"
import { createInternationalizationController, provideInternationalization } from "@/foundations/internationalization"
import { onMounted, ref } from "vue"

const internationalization = createInternationalizationController({}, {}, "en")
provideInternationalization(internationalization)

onMounted(() => {
    internationalization.setLocale(document.documentElement.lang)
})

const { form, value } = useForm<{
    account: {
        email: string
        nickname: string
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
        nickname: [],
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
const requiredIndicator = ref<"helper-required" | "label-asterisk" | "label-optional">("helper-required")

function handleSubmit() {
    submittedEmail.value = value.account.email
}
</script>

<template>
    <RForm :form :required-indicator="requiredIndicator" class="form-demo" @submit="handleSubmit">
        <div class="form-demo__required-indicator">
            <label>
                Required indicator
                <select v-model="requiredIndicator">
                    <option value="helper-required">Helper text</option>
                    <option value="label-asterisk">Label asterisk</option>
                    <option value="label-optional">Optional label</option>
                </select>
            </label>
        </div>

        <div class="form-demo__fields">
            <RTextField
                name="account.email"
                label="Email"
                autocomplete="email"
                helper-text="Use an address you can access."
            />
            <RTextField
                name="account.nickname"
                label="Nickname"
                autocomplete="nickname"
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

.form-demo__required-indicator label {
    display: grid;
    gap: 8px;
}

.form-demo__required-indicator select {
    max-width: 240px;
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
