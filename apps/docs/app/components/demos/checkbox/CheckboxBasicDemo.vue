<script setup lang="ts">
import { RCheckbox, RColumn, RRow } from "@ripple-design/rui"
import { ref } from "vue"

const checked = ref(false)
const indeterminate = ref(true)
</script>

<template>
    <RColumn gap="16px" class="checkbox-demo">
        <RRow gap="20px" align="center" wrap>
            <RCheckbox v-model="checked" name="enabled">Enabled: {{ checked }}</RCheckbox>
            <RCheckbox :model-value="true" disabled>Disabled checked</RCheckbox>
            <RCheckbox :model-value="false" disabled>Disabled unchecked</RCheckbox>
        </RRow>
        <RCheckbox v-model="checked" :indeterminate="indeterminate" name="mixed">
            Indeterminate
        </RCheckbox>
        <button type="button" @click="indeterminate = !indeterminate">Toggle indeterminate</button>
    </RColumn>
</template>

<style scoped lang="scss">
.checkbox-demo { width: 100%; }
</style>
