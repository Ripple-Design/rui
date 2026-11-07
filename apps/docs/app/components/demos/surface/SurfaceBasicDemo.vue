<script setup lang="ts">
import { RColumn, RSurface } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="16px" class="surface-demo">
        <RSurface>
            <div class="surface-demo__content">
                <strong>Surface</strong>
                <p>Uses the on-surface content color by default.</p>
            </div>
        </RSurface>

        <RSurface color="primary">
            <div class="surface-demo__content">
                <strong>Primary surface</strong>
                <p>Uses the matching on-primary content color.</p>
            </div>
        </RSurface>

        <RSurface color="secondary" variant="outlined">
            <div class="surface-demo__content">
                <strong>Outlined secondary surface</strong>
                <p>Uses the matching on-secondary content color.</p>
            </div>
        </RSurface>

        <RSurface color="primary" content-color="var(--rui-sys-color-on-surface)">
            <div class="surface-demo__content">
                <strong>Custom content color</strong>
                <p>Overrides the semantic foreground when needed.</p>
            </div>
        </RSurface>
    </RColumn>
</template>

<style scoped lang="scss">
.surface-demo {
    width: 100%;
}

.surface-demo__content {
    padding: 16px;
}

.surface-demo__content p {
    margin: 8px 0 0;
}
</style>
