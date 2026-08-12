<script setup lang="ts">
import { useInfiniteScroll } from "@ripple-design/rui"
import { computed, ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`))
const listElement = ref<HTMLElement | null>(null)
const page = ref(1)
const canLoadMore = computed(() => page.value < 4)

function loadMore() {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const start = items.value.length
            items.value.push(...Array.from({ length: 8 }, (_, index) => `Item ${start + index + 1}`))
            page.value += 1
            resolve()
        }, 350)
    })
}

const { isLoading } = useInfiniteScroll(listElement, loadMore, {
    canLoadMore: () => canLoadMore.value,
})
</script>

<template>
    <div class="infinite-scroll-demo">
        <div class="infinite-scroll-demo__list" ref="listElement">
            <div v-for="item in items" :key="item" class="infinite-scroll-demo__item">{{ item }}</div>
            <div class="infinite-scroll-demo__status">{{ isLoading ? "Loading…" : canLoadMore ? "Scroll for more" : "All items loaded" }}</div>
        </div>
    </div>
</template>

<style scoped>
.infinite-scroll-demo__list {
    display: grid;
    gap: 8px;
    max-block-size: 280px;
    overflow: auto;
    padding: 12px;
    border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    border-radius: 12px;
}

.infinite-scroll-demo__item,
.infinite-scroll-demo__status {
    padding: 12px;
    border-radius: 8px;
    background: color-mix(in srgb, currentColor 8%, transparent);
}

.infinite-scroll-demo__status {
    color: var(--rui-sys-color-on-surface-variant);
    text-align: center;
}
</style>
