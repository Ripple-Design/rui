<script setup lang="ts">
import { RIArrowBackOutlined, RIMoreVertFilled, RISearchOutlined } from "@ripple-design/icons"
import {
    RAppBarCollapseItem,
    RButton,
    RButtonGroup,
    RCard,
    RCollapsingAppBar,
    RIconButton,
    RScaffold,
    RSwitch,
    vColumnSpan,
} from "@ripple-design/rui"
import { ref } from "vue"

const showBackground = ref(false)
const collapseMode = ref<"off" | "pin" | "parallax">("off")
const cards = Array.from({ length: 16 }, (_, index) => index + 1)
</script>

<template>
    <div class="collapsing-app-bar-demo">
        <div class="collapsing-app-bar-demo__controls">
            <div class="collapsing-app-bar-demo__mode">
                <span>Child mode</span>
                <RButtonGroup v-model="collapseMode" selection="single">
                    <RButton value="off">Off</RButton>
                    <RButton value="pin">Pin</RButton>
                    <RButton value="parallax">Parallax</RButton>
                </RButtonGroup>
            </div>
            <label>
                <RSwitch v-model="showBackground" aria-label="Toggle collapsing app bar background" />
                <span>Show background</span>
            </label>
        </div>

        <RScaffold class="collapsing-app-bar-demo__preview" scroll-direction="vertical" :app-bar="{
            expandedHeight: '160px',
            collapsedHeight: '56px',
            scrollBehavior: 'exit-until-collapsed',
            liftOnScroll: true,
        }">
            <template #app-bar>
                    <RCollapsingAppBar title="Your library">
                        <template v-if="showBackground" #background>
                            <RAppBarCollapseItem :mode="collapseMode" class="collapsing-app-bar-demo__background" />
                        </template>
                        <template #navigation>
                            <RIconButton :icon="RIArrowBackOutlined" label="Go back" />
                        </template>
                        <template #actions>
                            <RIconButton :icon="RISearchOutlined" label="Search library" />
                            <RIconButton :icon="RIMoreVertFilled" label="More options" />
                        </template>
                    </RCollapsingAppBar>
            </template>

            <div v-column-span="{ csm: 4, cmd: 8, clg: 12 }" class="collapsing-app-bar-demo__content">
                <RCard v-for="card in cards" :key="card" class="collapsing-app-bar-demo__card">
                    <h3>Collection {{ card }}</h3>
                    <p>Scroll this focused preview to inspect the collapsing toolbar title, pinned actions, and optional snap.</p>
                </RCard>
            </div>
        </RScaffold>
    </div>
</template>

<style scoped>
.collapsing-app-bar-demo {
    display: grid;
    gap: 16px;
}

.collapsing-app-bar-demo__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.collapsing-app-bar-demo__controls label,
.collapsing-app-bar-demo__mode {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.collapsing-app-bar-demo__preview {
    block-size: min(68vh, 640px);
    min-block-size: 360px;
    overflow: hidden;
    border: 1px solid var(--rui-sys-color-on-surface-outline);
    border-radius: 12px;
}

.collapsing-app-bar-demo__background {
    background: linear-gradient(145deg, var(--rui-sys-color-primary), var(--rui-sys-color-secondary));
}

.collapsing-app-bar-demo__content {
    display: grid;
    gap: 12px;
    padding: 16px;
}

.collapsing-app-bar-demo__card {
    padding: 16px;
}

.collapsing-app-bar-demo__card h3,
.collapsing-app-bar-demo__card p {
    margin: 0;
}

.collapsing-app-bar-demo__card p {
    margin-block-start: 8px;
}
</style>
