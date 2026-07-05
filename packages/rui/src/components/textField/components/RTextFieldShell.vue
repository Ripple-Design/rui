<script setup lang="ts">
import RNotchedOutline from "./RNotchedOutline.vue"
</script>

<template>
    <label class="rui-text-field-shell rui-text-field-shell--outlined">
        <RNotchedOutline />
        <slot />
    </label>
</template>

<style scoped lang="scss">
.rui-text-field-shell {
    border-radius: 4px 4px 0 0;
}
</style>
