<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

const props = withDefaults(
    defineProps<{
        title: string
        demo: string
        language?: string
    }>(),
    {
        language: "vue",
    },
)

const preview = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

async function toggleFullscreen() {
    if (!preview.value) {
        return
    }

    if (document.fullscreenElement === preview.value) {
        await document.exitFullscreen()
        return
    }

    await preview.value.requestFullscreen()
}

function syncFullscreen() {
    isFullscreen.value = document.fullscreenElement === preview.value
}

onMounted(() => {
    document.addEventListener("fullscreenchange", syncFullscreen)
})

onBeforeUnmount(() => {
    document.removeEventListener("fullscreenchange", syncFullscreen)
})
</script>

<template>
    <section class="demo-block">
        <div ref="preview" class="demo-preview">
            <button
                class="demo-preview__fullscreen-trigger"
                type="button"
                :aria-pressed="String(isFullscreen)"
                @click="toggleFullscreen"
            >
                {{ isFullscreen ? "Exit fullscreen" : "Fullscreen" }}
            </button>
            <slot>
                <DemoPreview :demo="props.demo" />
            </slot>
        </div>
        <details class="demo-source">
            <summary>Show code</summary>
            <div class="demo-source__content">
                <DemoSource :demo="props.demo" :language="props.language" />
            </div>
        </details>
    </section>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/styles/index" as rui;

.demo-block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.demo-preview,
.demo-source {
    border-radius: 4px;
    border: 1px solid #d0d0d0;
}

.demo-preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    gap: 16px;
    background: rui.$color-background;
}

.demo-preview:fullscreen {
    box-sizing: border-box;
    inline-size: 100vw;
    block-size: 100vh;
    padding: 48px;
    overflow: auto;
}

.demo-preview__fullscreen-trigger {
    position: absolute;
    z-index: 1;
    inset-block-start: 8px;
    inset-inline-end: 8px;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    background: #111111;
    color: #ffffff;
    font: inherit;
}

.demo-preview__fullscreen-trigger:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.demo-source {
    background: #f7f7f7;
}

.demo-source summary {
    cursor: pointer;
    font-weight: 600;
    padding: 0.875rem 1rem;
}

.demo-source summary:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.demo-source__content {
    border-top: 1px solid #d0d0d0;
    overflow-x: auto;
}

.demo-source__content :deep(pre) {
    background: transparent !important;
    margin: 0;
    overflow-x: auto;
    padding: 1rem;
}
</style>
