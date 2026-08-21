<script setup lang="ts">
import { RGrid } from "@ripple-design/rui"
</script>

<template>
    <div class="grid-responsive-demo">
        <p class="grid-responsive-demo__hint">
            Resize the container to trigger csm / cmd / clg / cxl breakpoints. Widen the viewport to trigger sm / md /
            lg / xl.
        </p>
        <div class="grid-responsive-demo__shell">
            <RGrid responsive="container" :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }" gap="12px">
                <div class="grid-card">csm: 1 col</div>
                <div class="grid-card">cmd: 2 cols</div>
                <div class="grid-card">clg: 3 cols</div>
                <div class="grid-card">cxl: 4 cols</div>
                <div class="grid-card">Container width drives layout</div>
                <div class="grid-card">No ResizeObserver required</div>
                <div class="grid-card">Sparse maps inherit forward</div>
                <div class="grid-card">String templates still work</div>
            </RGrid>
        </div>

        <RGrid :columns="{ xs: 1, sm: 2, md: 4 }" gap="12px">
            <div class="grid-card grid-card--viewport">sm: 1 col</div>
            <div class="grid-card grid-card--viewport">md: 2 cols</div>
            <div class="grid-card grid-card--viewport">lg: 4 cols</div>
            <div class="grid-card grid-card--viewport">Viewport width drives layout</div>
        </RGrid>
    </div>
</template>

<style scoped>
.grid-responsive-demo {
    display: grid;
    gap: 12px;
}

.grid-responsive-demo__hint {
    margin: 0;
    color: #5f6368;
    font-size: 14px;
}

.grid-responsive-demo__shell {
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

.grid-card--viewport {
    background: #fff6e8;
    border-color: #d6a14d;
}
</style>
