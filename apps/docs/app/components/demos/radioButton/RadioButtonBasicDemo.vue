<script setup lang="ts">
import { RColumn, RRadioButton, RRadioButtonGroup, RRow } from "@ripple-design/rui"
import { ref } from "vue"

const selected = ref("standard")
</script>

<template>
    <RColumn gap="20px" class="radio-button-demo">
        <RRadioButtonGroup v-model="selected" name="plan" aria-label="Plan" orientation="vertical">
            <RRadioButton value="standard">Standard</RRadioButton>
            <RRadioButton value="pro">Pro</RRadioButton>
            <RRadioButton value="enterprise" disabled>Enterprise</RRadioButton>
        </RRadioButtonGroup>

        <RRadioButtonGroup v-model="selected" name="plan-horizontal" aria-label="Plan horizontal" orientation="horizontal">
            <RRadioButton value="standard">Standard</RRadioButton>
            <RRadioButton value="pro">Pro</RRadioButton>
            <RRadioButton value="enterprise" disabled>Enterprise</RRadioButton>
        </RRadioButtonGroup>

        <RRow gap="8px" align="center">
            <span>Selected: {{ selected }}</span>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.radio-button-demo {
    width: 100%;
}
</style>
