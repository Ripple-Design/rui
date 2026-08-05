<script setup lang="ts">
import { RButton, RDialog, RGrid, RSelectField, RSelectOption, vSpan } from "@ripple-design/rui"
import { computed, ref } from "vue"

const selection = ref<string | null>(null)
const selectionError = computed(() => (selection.value == null ? "Select a country." : ""))
const objectSelection = ref<{ id: number } | null>(null)
const objectOptions = [
    { id: 1, label: "First object" },
    { id: 2, label: "Second object" },
]
const filterSelection = ref<string | null>(null)
const dialogOpen = ref(false)
const dialogSelection = ref<string | null>(null)
const longSelection = ref<string | null>(null)
const longOptions = Array.from({ length: 32 }, (_, index) => ({
    label: `Long option ${index + 1}`,
    value: `long-${index + 1}`,
}))
const selectedObjectLabel = computed(() => objectSelection.value?.id ?? "None")
</script>

<template>
    <div class="select-field-demo">
        <RSelectField
            v-model="selection"
            label="Country"
            helper-text="Click the outlined control to see a ripple that excludes this helper text."
            :error-text="selectionError"
        >
            <RSelectOption value="us" label="United States" />
            <RSelectOption value="ca" label="Canada" />
            <RSelectOption value="jp" label="Japan" disabled />
        </RSelectField>

        <RGrid :cols="2" gap="16px">
            <RSelectField v-span="2" v-model="filterSelection" label="Filterable country" filterable>
                <RSelectOption value="us" label="United States" />
                <RSelectOption value="ca" label="Canada" />
                <RSelectOption value="jp" label="Japan" />
            </RSelectField>
            <div class="select-field-demo__grid-item">The field above spans both columns.</div>
        </RGrid>

        <RSelectField v-model="longSelection" label="Long option list">
            <RSelectOption v-for="option in longOptions" :key="option.value" :value="option.value" :label="option.label" />
        </RSelectField>

        <RSelectField v-model="objectSelection" label="Object value">
            <RSelectOption v-for="option in objectOptions" :key="option.id" :value="option" :label="option.label" />
        </RSelectField>

        <div>Selected object: {{ selectedObjectLabel }}</div>

        <RButton type="button" variant="outlined" @click="dialogOpen = true">Open dialog select</RButton>
        <RDialog v-model="dialogOpen" title="Dialog select">
            <RSelectField v-model="dialogSelection" label="Country inside dialog">
                <RSelectOption value="us" label="United States" />
                <RSelectOption value="ca" label="Canada" />
                <RSelectOption value="jp" label="Japan" />
            </RSelectField>
        </RDialog>
    </div>
</template>

<style scoped lang="scss">
.select-field-demo {
    display: grid;
    gap: 16px;
    width: 100%;
}

.select-field-demo__grid-item {
    padding: 16px;
    border: 1px solid var(--rui-sys-color-outline);
}
</style>
