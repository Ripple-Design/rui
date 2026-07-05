<script setup lang="ts">
import { ref } from "vue"
import { RTextField } from "rui/components"

const model = ref("")
</script>

<template>
    <form>
        <label>
            Text field demo
            <RTextField v-model="model" />
        </label>
        <p>Value: {{ model }}</p>
    </form>
</template>
