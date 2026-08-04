<script setup lang="ts">
import { RICloseFilled, RISearchFilled } from "@ripple-design/icons"
import { RTextField } from "@ripple-design/rui"
import { ref } from "vue"

const query = ref("Search text")
const email = ref("")
const emailError = ref("")

function validateEmail() {
    emailError.value = email.value && !email.value.includes("@") ? "Enter a valid email address." : ""
}
</script>

<template>
    <div class="text-field-demo">
        <RTextField label="Label" />
        <RTextField label="Email" helper-text="We’ll never share your email." />
        <RTextField
            v-model="email"
            label="Validated email"
            helper-text="Use your work email address."
            :error-text="emailError"
            @blur="validateEmail"
        />
        <RTextField placeholder="No label" />
        <RTextField label="Label" text-area />
        <RTextField label="Message" text-area helper-text="Include enough detail for us to help." />
        <RTextField placeholder="No label textarea" text-area />
        <RTextField label="Search" :start-icon="RISearchFilled" :end-icon="RICloseFilled" />
        <RTextField v-model="query" label="Search" :start-icon="RISearchFilled" clearable />
    </div>
</template>

<style scoped lang="scss">
.text-field-demo {
    display: grid;
    gap: 16px;
    width: 100%;
}
</style>
