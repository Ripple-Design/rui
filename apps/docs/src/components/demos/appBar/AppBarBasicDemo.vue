<script setup lang="ts">
import { RICloseFilled, RIHomeOutlined, RIMoreVertFilled } from "@ripple-design/icons"
import { RButton, RIconButton, RTopAppBar } from "@ripple-design/rui"
import { computed, ref } from "vue"

const viewportWidth = ref(719)
const heightMode = ref<"default" | "custom">("default")
const color = ref<"surface" | "primary">("surface")
const centered = ref(false)
const showSubtitle = ref(false)

const previewStyle = computed(() => ({
    inlineSize: `${viewportWidth.value}px`,
}))
</script>

<template>
    <div class="top-app-bar-demo">
        <div class="top-app-bar-demo__controls">
            <label>
                <span>Container width</span>
                <input v-model.number="viewportWidth" type="range" min="320" max="960" />
                <output>{{ viewportWidth }}px</output>
            </label>

            <div class="top-app-bar-demo__mode">
                <RButton :variant="heightMode === 'default' ? 'contained' : 'text'" @click="heightMode = 'default'">
                    Default
                </RButton>
                <RButton :variant="heightMode === 'custom' ? 'contained' : 'text'" @click="heightMode = 'custom'">
                    Custom 72px
                </RButton>
            </div>

            <div class="top-app-bar-demo__mode">
                <RButton :variant="color === 'surface' ? 'contained' : 'text'" @click="color = 'surface'">
                    Surface
                </RButton>
                <RButton :variant="color === 'primary' ? 'contained' : 'text'" @click="color = 'primary'">
                    Primary
                </RButton>
            </div>

            <label>
                <input v-model="showSubtitle" type="checkbox" />
                <span>Show subtitle</span>
            </label>
            <label>
                <input v-model="centered" type="checkbox" />
                <span>Centered</span>
            </label>
        </div>

        <div class="top-app-bar-demo__viewport" :style="previewStyle">
            <RTopAppBar
                :color="color"
                :centered="centered"
                :collapsed-height="heightMode === 'custom' ? '72px' : undefined"
            >
                <template #navigation>
                    <RIconButton :icon="RIHomeOutlined" label="Open navigation" />
                </template>
                <template #title>Messages</template>
                <template v-if="showSubtitle" #subtitle>Unread conversations</template>
                <template #actions>
                    <RIconButton :icon="RICloseFilled" label="Dismiss" />
                    <RIconButton :icon="RIMoreVertFilled" label="More options" />
                </template>
            </RTopAppBar>
            <div class="top-app-bar-demo__body">
                Resize across 720px and toggle title alignment to inspect the App Bar layout.
            </div>
        </div>
    </div>
</template>

<style scoped>
.top-app-bar-demo {
    display: grid;
    gap: 16px;
    inline-size: 100%;
}

.top-app-bar-demo__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.top-app-bar-demo__controls label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.top-app-bar-demo__mode {
    display: inline-flex;
    gap: 4px;
}

.top-app-bar-demo__viewport {
    container-type: inline-size;
    max-inline-size: 100%;
    overflow: hidden;
    border: 1px solid var(--rui-sys-color-on-surface-outline, #747775);
    transition: inline-size 160ms ease;
}

.top-app-bar-demo__body {
    box-sizing: border-box;
    min-block-size: 120px;
    padding: 24px;
}
</style>
