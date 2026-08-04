<script setup lang="ts">
import { RICloseFilled, RISearchFilled } from "@ripple-design/icons"
import { RIconButton, RTextField } from "@ripple-design/rui"
import { ref } from "vue"

const query = ref("")
</script>

<template>
    <div class="text-field-demo">
        <RTextField label="Label" />
        <RTextField placeholder="No label" />
        <RTextField label="Label" text-area />
        <RTextField placeholder="No label textarea" text-area />
        <RTextField label="Search" :start-icon="RISearchFilled" :end-icon="RICloseFilled" />
        <RTextField v-model="query" label="Search" :start-icon="RISearchFilled">
            <template #end-icon>
                <RIconButton :icon="RICloseFilled" label="Clear search" @click="query = ''" />
            </template>
        </RTextField>
    </div>
</template>

<style scoped lang="scss">
.text-field-demo {
    display: grid;
    gap: 16px;
    width: 100%;
}
</style>
