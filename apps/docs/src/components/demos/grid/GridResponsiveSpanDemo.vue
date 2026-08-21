<script setup lang="ts">
import { RGrid, vColumnSpan } from "@ripple-design/rui"
</script>

<template>
    <div class="grid-responsive-span-demo">
        <p class="grid-responsive-span-demo__hint">
            Resize the container for csm / cmd / clg / cxl spans. Viewport breakpoints change as the page width grows.
        </p>
        <div class="grid-responsive-span-demo__shell">
            <RGrid responsive="container" :columns="{ xs: 1, sm: 2, md: 4 }" gap="12px">
                <div v-column-span="{ xs: 'full', md: 2 }" class="grid-card grid-card--featured">
                    Full width on csm, span 2 from clg
                </div>
                <div v-column-span="{ xs: 1, md: 2 }" class="grid-card grid-card--viewport">Span 1 → 2 by viewport</div>
                <div class="grid-card">Auto placement</div>
                <div class="grid-card">Auto placement</div>
                <div class="grid-card">Auto placement</div>
                <div class="grid-card">Auto placement</div>
            </RGrid>
        </div>
    </div>
</template>

<style scoped>
.grid-responsive-span-demo {
    display: grid;
    gap: 12px;
}

.grid-responsive-span-demo__hint {
    margin: 0;
    color: #5f6368;
    font-size: 14px;
}

.grid-responsive-span-demo__shell {
    width: min(100%, 880px);
    min-width: 18rem;
    max-width: 100%;
    resize: horizontal;
    overflow: auto;
    padding: 12px;
    border: 1px dashed #c2c7cf;
    border-radius: 12px;
}

.grid-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 72px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    padding: 16px;
    background: #f7f7f7;
    text-align: center;
}

.grid-card--featured {
    background: #eef4ff;
    border-color: #8aaae5;
}

.grid-card--viewport {
    background: #fff6e8;
    border-color: #d6a14d;
}
</style>
