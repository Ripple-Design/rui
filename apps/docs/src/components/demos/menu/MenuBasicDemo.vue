<script setup lang="ts">
import { RIContentCopyFilled, RIEditFilled, RIDeleteFilled } from "@ripple-design/icons"
import { RButton, RMenu, RMenuItem } from "@ripple-design/rui"

function noop() {}
</script>

<template>
    <RMenu>
        <template #trigger>
            <RButton variant="outlined">More</RButton>
        </template>

        <RMenuItem :icon="RIEditFilled" @click="noop">Edit</RMenuItem>
        <RMenuItem :icon="RIContentCopyFilled" @click="noop">Duplicate</RMenuItem>
        <RMenuItem :icon="RIDeleteFilled" @click="noop">Delete</RMenuItem>
    </RMenu>
</template>
