<script setup lang="ts">
import { RAppBar, RButton, RCard, RFab, RResponsiveGrid, RScaffold } from "@ripple-design/rui"

const cards = Array.from({ length: 24 }, (_, index) => index + 1)
</script>

<template>
    <RScaffold class="scaffold-demo" scroll-direction="vertical" fab-placement="app-bar-seam">
        <template #app-bar>
            <RAppBar content-align="body" expanded-height="88px">
                <strong>Scaffold preview</strong>
                <span class="scaffold-demo__app-bar-spacer" />
                <RButton variant="text">Action</RButton>
            </RAppBar>
        </template>

        <RResponsiveGrid gap="16px">
            <RCard v-for="card in cards" :key="card" class="scaffold-demo__card">
                <h2>Section {{ card }}</h2>
                <p>
                    This is scrollable body content. Resize the preview to see the M2 responsive grid use four, eight,
                    and twelve columns.
                </p>
            </RCard>
        </RResponsiveGrid>

        <template #fab>
            <RFab icon="add" label="Add" />
        </template>
    </RScaffold>
</template>

<style scoped>
.scaffold-demo {
    block-size: min(72vh, 720px);
}

.scaffold-demo__app-bar-spacer {
    flex: 1;
}

.scaffold-demo__card {
    min-block-size: 160px;
    padding: 20px;
}

.scaffold-demo__card h2 {
    margin: 0 0 8px;
    font-size: 1rem;
}

.scaffold-demo__card p {
    margin: 0;
    line-height: 1.5;
}
</style>
