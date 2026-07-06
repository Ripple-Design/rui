<script setup lang="ts"></script>

<template>
    <span class="rui-notched-outline">
        <span class="rui-notched-outline__leading" />
        <span class="rui-notched-outline__notch" />
        <span class="rui-notched-outline__trailing" />
    </span>
</template>

<style scoped lang="scss">
.rui-notched-outline {
    display: flex;
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
    inset: 0;

    &__leading,
    &__notch,
    &__trailing {
        border-width: 1px;
        border-color: rgba(0 0 0 / 12%);
    }

    &__leading {
        width: 12px;
        // Baseline: widely available since September 2021.
        border-start-start-radius: var(--rui-text-field-outlined-top-left-radius);
        border-end-start-radius: var(--rui-text-field-outlined-bottom-left-radius);
        border-inline-start-style: solid;
        border-top-style: solid;
        border-bottom-style: solid;
    }

    &__notch {
        border-top-style: solid;
        border-bottom-style: solid;
    }

    &__trailing {
        flex-grow: 1;
        // Baseline: widely available since September 2021.
        border-start-end-radius: var(--rui-text-field-outlined-top-right-radius);
        border-end-end-radius: var(--rui-text-field-outlined-bottom-right-radius);
        border-inline-end-style: solid;
        border-top-style: solid;
        border-bottom-style: solid;
    }
}
</style>
