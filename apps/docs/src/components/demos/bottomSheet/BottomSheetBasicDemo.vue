<script setup lang="ts">
import { RBottomSheet } from "@ripple-design/rui"
</script>

<template>
    <div class="bottom-sheet-demo">
        <RBottomSheet title="Filters">
            <p>Bottom sheets keep contextual controls close to the current task.</p>
            <p>Use the title and body regions to organize supplementary content.</p>
        </RBottomSheet>
    </div>
</template>

<style scoped>
.bottom-sheet-demo {
    display: grid;
    align-items: end;
    block-size: 32rem;
}

.bottom-sheet-demo p {
    margin: 0;
}
</style>
