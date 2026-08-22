<script setup lang="ts">
import { RText, RWell } from "@ripple-design/rui"
</script>

<template>
    <RWell class="well-demo">
        <div class="well-demo__content">
            <RText>Well</RText>
            <RText emphasis="medium">Inset background container</RText>
        </div>
    </RWell>
</template>

<style scoped lang="scss">
.well-demo__content {
    padding: 16px;
}
</style>
