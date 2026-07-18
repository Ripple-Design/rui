<script setup lang="ts">
import { RIAccountBalanceFilled } from "@ripple-design/icons"
import { RIcon, RRow } from "@ripple-design/rui"
</script>

<template>
    <RRow gap="16px" wrap align="center">
        <RIcon :svg="RIAccountBalanceFilled" />

        <RIcon :svg="RIAccountBalanceFilled" :size="16" />

        <RIcon :svg="RIAccountBalanceFilled" size="2rem" />

        <span>
            <RIcon :svg="RIAccountBalanceFilled" />
            Decorative inline icon
        </span>

        <RIcon :svg="RIAccountBalanceFilled" label="Favorite" />
    </RRow>
</template>
