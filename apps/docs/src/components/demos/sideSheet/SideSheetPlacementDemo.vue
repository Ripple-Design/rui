<script setup lang="ts">
import { RSideSheet, RTextField } from "@ripple-design/rui"
</script>

<template>
    <div class="side-sheet-placement-demo">
        <RSideSheet title="Start sheet" side="start" width="22rem">
            <RTextField label="Project" placeholder="Ripple Design" />
        </RSideSheet>

        <RSideSheet title="End sheet" side="end" width="22rem">
            <RTextField label="Owner" placeholder="Design systems" />
        </RSideSheet>
    </div>
</template>

<style scoped>
.side-sheet-placement-demo {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.side-sheet-placement-demo :deep(.rui-side-sheet) {
    block-size: 28rem;
}

@media (max-width: 900px) {
    .side-sheet-placement-demo {
        grid-template-columns: 1fr;
    }
}
</style>
