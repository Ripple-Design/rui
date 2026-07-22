<script setup lang="ts">
import { RColumn, RRow, vRipple } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="12px" class="ripple-unbounded-demo">
        <RRow gap="24px" wrap align="center">
            <div class="demo-icon-example">
                <button
                    v-ripple
                    class="demo-button demo-button--icon"
                    type="button"
                    aria-label="Bounded icon action"
                >
                    <span class="demo-button__label">★</span>
                </button>
                <span class="demo-caption">Bounded icon</span>
            </div>

            <div class="demo-icon-example">
                <button
                    v-ripple.unbounded
                    class="demo-button demo-button--icon"
                    type="button"
                    aria-label="Unbounded icon action"
                >
                    <span class="demo-button__label">★</span>
                </button>
                <span class="demo-caption">Unbounded icon</span>
            </div>
        </RRow>
    </RColumn>
</template>

<style scoped>
.ripple-unbounded-demo {
    width: 100%;
}

.demo-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--rui-sys-color-primary);
    padding: 0;
    font: inherit;
    cursor: pointer;
}

.demo-button__label {
    position: relative;
    z-index: 1;
}

.demo-button--icon {
    width: 44px;
    font-size: 1.125rem;
}

.demo-icon-example {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.demo-caption {
    font-size: 0.875rem;
    color: var(--rui-sys-color-on-surface-medium);
}
</style>
