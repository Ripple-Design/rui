<script setup lang="ts">
import { RColumn, RRow, vRipple } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="24px" class="ripple-demo">
        <RRow gap="24px" wrap align="center">
            <button v-ripple class="demo-button" type="button">
                <span class="demo-button__label">Low contrast</span>
            </button>

            <button v-ripple="{ contrast: 'high' }" class="demo-button demo-button--filled" type="button">
                <span class="demo-button__label">High contrast</span>
            </button>
        </RRow>
    </RColumn>
</template>

<style scoped>
.ripple-demo {
    width: 100%;
}

.demo-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    min-height: 44px;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--rui-sys-color-primary);
    padding: 0 20px;
    font: inherit;
    cursor: pointer;
}

.demo-button__label {
    position: relative;
    z-index: 1;
}

.demo-button--filled {
    background: var(--rui-sys-color-primary);
    color: var(--rui-sys-color-on-primary);
}
</style>
