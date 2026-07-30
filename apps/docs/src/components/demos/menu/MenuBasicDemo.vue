<script setup lang="ts">
import { RIContentCopyFilled, RIEditFilled, RIDeleteFilled } from "@ripple-design/icons"
import { RButton, RColumn, RMenu, RMenuItem } from "@ripple-design/rui"

function noop() {}
</script>

<template>
    <RColumn gap="16px" align="start">
        <RMenu align="start">
            <template #trigger>
                <RButton variant="outlined">Icons / start</RButton>
            </template>

            <RMenuItem :icon="RIEditFilled" @click="noop">Edit</RMenuItem>
            <RMenuItem :icon="RIContentCopyFilled" @click="noop">Duplicate</RMenuItem>
            <RMenuItem :icon="RIDeleteFilled" @click="noop">Delete</RMenuItem>
        </RMenu>

        <RMenu align="end">
            <template #trigger>
                <RButton variant="outlined">Icons / end</RButton>
            </template>

            <RMenuItem :icon="RIEditFilled" @click="noop">Edit</RMenuItem>
            <RMenuItem :icon="RIContentCopyFilled" @click="noop">Duplicate</RMenuItem>
            <RMenuItem :icon="RIDeleteFilled" @click="noop">Delete</RMenuItem>
        </RMenu>

        <RMenu align="start">
            <template #trigger>
                <RButton variant="outlined">No icons / start</RButton>
            </template>

            <RMenuItem @click="noop">Edit</RMenuItem>
            <RMenuItem @click="noop">Duplicate</RMenuItem>
            <RMenuItem @click="noop">Delete</RMenuItem>
        </RMenu>

        <RMenu align="end">
            <template #trigger>
                <RButton variant="outlined">No icons / end</RButton>
            </template>

            <RMenuItem @click="noop">Edit</RMenuItem>
            <RMenuItem @click="noop">Duplicate</RMenuItem>
            <RMenuItem @click="noop">Delete</RMenuItem>
        </RMenu>
    </RColumn>
</template>
