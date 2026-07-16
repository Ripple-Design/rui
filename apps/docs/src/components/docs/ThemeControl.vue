<script setup lang="ts">
import { RRow, RTextField, applyTheme } from "@ripple-design/rui"
import { onMounted, ref } from "vue"

const defaultPrimary = "#6200ee"
const inputValue = ref(defaultPrimary)

onMounted(() => {
    inputValue.value = localStorage.getItem("rui-docs-primary") ?? defaultPrimary
})

function applyPrimaryColor() {
    const value = inputValue.value.trim()

    if (!value) {
        localStorage.removeItem("rui-docs-primary")
        document.documentElement.style.removeProperty("--rui-sys-color-primary")
        return
    }

    applyTheme({ color: { primary: value } })
    localStorage.setItem("rui-docs-primary", value)
}

function resetPrimaryColor() {
    inputValue.value = defaultPrimary
    localStorage.removeItem("rui-docs-primary")
    document.documentElement.style.removeProperty("--rui-sys-color-primary")
}
</script>

<template>
    <div class="theme-control">
        <RTextField v-model="inputValue" label="Primary" placeholder="#6200ee" />
        <div class="theme-control__preview">
            <div class="theme-control__swatch" :style="{ background: inputValue || defaultPrimary }" />
        </div>
        <RRow gap="8px" class="theme-control__actions">
            <button type="button" @click="resetPrimaryColor">Reset</button>
            <button type="button" @click="applyPrimaryColor">Apply</button>
        </RRow>
    </div>
</template>

<style scoped>
.theme-control {
    display: grid;
    gap: 0.75rem;
}

.theme-control__preview {
    display: grid;
    gap: 0.375rem;
}

.theme-control__swatch {
    width: 100%;
    height: 2rem;
    border: 1px solid #d0d0d0;
}

.theme-control__actions {
    justify-content: flex-end;
}

.theme-control__actions button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d0d0d0;
    background: #fff;
    cursor: pointer;
}
</style>
