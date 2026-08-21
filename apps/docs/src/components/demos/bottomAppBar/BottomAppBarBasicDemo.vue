<script setup lang="ts">
import { ref } from "vue"

import { RIAddFilled, RIHomeOutlined, RIMenuOutlined, RISettingsOutlined } from "@ripple-design/icons"
import {
    RBottomAppBar,
    RButton,
    RButtonGroup,
    RFab,
    RIconButton,
    RScaffold,
    vColumnSpan,
} from "@ripple-design/rui"

const alignment = ref<"center" | "end">("center")
const animation = ref<"scale" | "slide">("scale")
const attached = ref(true)
const visible = ref(true)
const hideOnScroll = ref(false)
const cards = Array.from({ length: 12 }, (_, index) => index + 1)
</script>

<template>
    <div class="bottom-app-bar-demo">
        <div class="bottom-app-bar-demo__controls">
            <RButtonGroup v-model="alignment" selection="single">
                <RButton value="center">Center</RButton>
                <RButton value="end">End</RButton>
            </RButtonGroup>
            <RButtonGroup v-model="animation" selection="single">
                <RButton value="scale">Scale</RButton>
                <RButton value="slide">Slide</RButton>
            </RButtonGroup>
            <RButton variant="outlined" @click="attached = !attached">{{ attached ? "Detach" : "Attach" }}</RButton>
            <RButton variant="outlined" @click="visible = !visible">{{ visible ? "Hide FAB" : "Show FAB" }}</RButton>
            <RButton variant="outlined" @click="hideOnScroll = !hideOnScroll">Hide on scroll: {{ hideOnScroll ? "on" : "off" }}</RButton>
        </div>

        <RScaffold class="bottom-app-bar-demo__scaffold" :bottom-bar-hide-on-scroll="false">
            <div v-column-span="{ csm: 4, cmd: 8, clg: 12 }" class="bottom-app-bar-demo__content">
                <article v-for="card in cards" :key="card">
                    <h2>Section {{ card }}</h2>
                    <p>Scroll this preview to compare the M2 bottom app bar placement and motion.</p>
                </article>
            </div>

            <template #bottom-bar>
                <RBottomAppBar
                    :fab-alignment-mode="alignment"
                    :fab-animation-mode="animation"
                    :fab-attached="attached"
                    :hide-on-scroll="hideOnScroll"
                    aria-label="Bottom app bar"
                >
                    <template #navigation>
                        <RIconButton :icon="RIHomeOutlined" label="Home" />
                    </template>
                    <template #actions>
                        <RIconButton :icon="RISettingsOutlined" label="Settings" />
                        <RIconButton :icon="RIMenuOutlined" label="More" />
                    </template>
                </RBottomAppBar>
            </template>

            <template #fab>
                <RFab :icon="RIAddFilled" label="Add" :visible="visible" />
            </template>
        </RScaffold>
    </div>
</template>

<style scoped>
.bottom-app-bar-demo__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-block-end: 16px;
}

.bottom-app-bar-demo__scaffold {
    block-size: min(70vh, 640px);
    min-block-size: 360px;
    border: 1px solid var(--rui-sys-color-on-surface-outline);
}

.bottom-app-bar-demo__content {
    display: grid;
    gap: 16px;
    padding: 16px;
}

.bottom-app-bar-demo__content article {
    min-block-size: 140px;
    padding: 16px;
    background: var(--rui-sys-color-surface);
    border-radius: 12px;
}

.bottom-app-bar-demo__content h2,
.bottom-app-bar-demo__content p {
    margin: 0;
}

.bottom-app-bar-demo__content p {
    margin-block-start: 8px;
}
</style>
