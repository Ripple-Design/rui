<script setup lang="ts">
import { RSideSheet } from "@ripple-design/rui"
</script>

<template>
    <div class="side-sheet-demo">
        <RSideSheet title="Filters">
            <p>Side sheets can structure secondary tasks such as filtering, editing, or reviewing contextual details.</p>
            <p>Use the title and body regions to keep the panel predictable.</p>
        </RSideSheet>
    </div>
</template>

<style scoped>
.side-sheet-demo {
    block-size: 32rem;
}

.side-sheet-demo p {
    margin: 0;
}
</style>
