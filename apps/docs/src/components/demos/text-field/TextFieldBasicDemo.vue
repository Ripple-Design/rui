<script setup lang="ts">
import { RTextField } from "@ripple-design/rui/components"
import { ref } from "vue"

const model = ref("")
</script>

<template>
    <form>
        <label>
            Text field demo
            <RTextField v-model="model" label="asa" placeholder="sasd" />
        </label>
        <p>Value: {{ model }}</p>
    </form>
</template>
