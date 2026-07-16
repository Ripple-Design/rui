<script setup lang="ts">
import { RGrid } from "@ripple-design/rui"

type PrincipleItem = {
    title: string
    image: string
    body: string
}

defineProps<{
    items: PrincipleItem[]
}>()
</script>

<template>
    <RGrid :cols="3" gap="24px">
        <section v-for="item in items" :key="item.title" class="principle-card">
            <img :src="item.image" :alt="item.body" class="principle-card__image" />
            <h4>{{ item.title }}</h4>
            <p>{{ item.body }}</p>
        </section>
    </RGrid>
</template>

<style scoped>
.principle-card {
    display: grid;
    gap: 12px;
}

.principle-card__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.principle-card h4,
.principle-card p {
    margin: 0;
}
</style>
