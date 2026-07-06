<script setup lang="ts">
import RNotchedOutline from "./RNotchedOutline.vue"
</script>

<template>
    <label class="rui-text-field-shell rui-text-field-shell--outlined">
        <slot />
        <RNotchedOutline />
    </label>
</template>

<style scoped lang="scss">
.rui-text-field-shell {
    --rui-text-field-outlined-top-left-radius: 4px;
    --rui-text-field-outlined-top-right-radius: 4px;
    --rui-text-field-outlined-bottom-left-radius: 4px;
    --rui-text-field-outlined-bottom-right-radius: 4px;

    position: relative;
    display: inline-flex;
    padding: 0 16px;
    overflow: hidden;
    border-radius: var(--rui-text-field-outlined-top-left-radius) var(--rui-text-field-outlined-top-right-radius)
        var(--rui-text-field-outlined-bottom-right-radius) var(--rui-text-field-outlined-bottom-left-radius);
    min-height: 56px;
}
</style>
