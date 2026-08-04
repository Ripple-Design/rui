<script setup lang="ts">
import { RSelectField, RSelectOption } from "@ripple-design/rui"
import { computed, ref } from "vue"

const selection = ref<string | null>(null)
const objectSelection = ref<{ id: number } | null>(null)
const objectOptions = [
    { id: 1, label: "First object" },
    { id: 2, label: "Second object" },
]
const selectedObjectLabel = computed(() => objectSelection.value?.id ?? "None")
</script>

<template>
    <div class="select-field-demo">
        <RSelectField v-model="selection" label="Country" helper-text="Choose your country or region.">
            <RSelectOption value="us" label="United States" />
            <RSelectOption value="ca" label="Canada" />
            <RSelectOption value="jp" label="Japan" disabled />
        </RSelectField>

        <RSelectField v-model="objectSelection" label="Object value">
            <RSelectOption v-for="option in objectOptions" :key="option.id" :value="option" :label="option.label" />
        </RSelectField>

        <div>Selected object: {{ selectedObjectLabel }}</div>
    </div>
</template>

<style scoped lang="scss">
.select-field-demo {
    display: grid;
    gap: 16px;
    width: 100%;
}
</style>
