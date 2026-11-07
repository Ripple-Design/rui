<script setup lang="ts">
import { RSpinner, RSpinnerOption } from "@ripple-design/rui"
import { ref } from "vue"

const status = ref("active")
const num = ref(10)
</script>

<template>
    <RSpinner v-model="status">
        <RSpinnerOption label="Active" value="active" />
        <RSpinnerOption label="Paused" value="paused" />
        <RSpinnerOption label="Archived" value="archived" />
    </RSpinner>

    <RSpinner v-model="num">
        <RSpinnerOption label="10" :value="10" />
        <RSpinnerOption label="20" :value="20" />
        <RSpinnerOption label="30" :value="30" />
    </RSpinner>

    <RSpinner v-model="status" variant="headline6" emphasis="high">
        <RSpinnerOption label="Active" value="active" />
        <RSpinnerOption label="Paused" value="paused" />
        <RSpinnerOption label="Archived" value="archived" />
    </RSpinner>
</template>
