<script setup lang="ts">
import {
    RIFavoriteBorderFilled,
    RIFavoriteFilled,
    RIHomeOutlined,
    RIPlayCircleOutlined,
    RISettingsOutlined,
} from "@ripple-design/icons"
import { computed, ref } from "vue"

import {
    RAppBarContainer,
    RButton,
    RButtonGroup,
    RCard,
    RFab,
    RNavigationRail,
    RNavigationRailItem,
    RResponsiveGrid,
    RScaffold,
    RSideSheet,
    RSlider,
    RSwitch,
    RTopAppBar,
} from "@ripple-design/rui"

const cards = Array.from({ length: 24 }, (_, index) => index + 1)
const scrollDirection = ref<"vertical" | "none">("vertical")
const gridMode = ref<"centered" | "full-width">("centered")
const fabPlacement = ref<"viewport" | "body" | "app-bar-seam">("app-bar-seam")
const appBarAlign = ref<"full-width" | "centered" | "body">("body")
const collapsing = ref(false)
const hideOnScroll = ref(false)
const underlap = ref(false)
const sideSheet = ref(false)
const navigationRail = ref(false)
const navigationDrawer = ref(false)
const railActive = ref("home")
const drawerActive = ref("home")
const bottomBar = ref(false)
const bottomBarHideOnScroll = ref(false)
const previewWidth = ref(100)

const previewStyle = computed(() => ({
    inlineSize: `${previewWidth.value}%`,
}))

</script>

<template>
    <div class="scaffold-demo-showcase">
        <div class="scaffold-demo-controls" aria-label="Scaffold preview controls">
            <label for="scaffold-preview-width">Preview width</label>
            <RSlider
                id="scaffold-preview-width"
                v-model="previewWidth"
                class="scaffold-demo-controls__slider"
                :min="30"
                :max="100"
                :step="1"
                :format-value="(value) => `${value}%`"
                aria-label="Preview width percentage"
            />
            <output>{{ previewWidth }}%</output>

            <div class="scaffold-demo-controls__group">
                <span>Grid</span>
                <RButtonGroup v-model="gridMode" selection="single">
                    <RButton value="centered">Centered</RButton>
                    <RButton value="full-width">Full width</RButton>
                </RButtonGroup>
            </div>

            <div class="scaffold-demo-controls__group">
                <span>Scroll</span>
                <RButtonGroup v-model="scrollDirection" selection="single">
                    <RButton value="vertical">Vertical</RButton>
                    <RButton value="none">None</RButton>
                </RButtonGroup>
            </div>

            <div class="scaffold-demo-controls__group">
                <span>App bar</span>
                <RButtonGroup v-model="appBarAlign" selection="single">
                    <RButton value="full-width">Full width</RButton>
                    <RButton value="centered">Centered</RButton>
                    <RButton value="body">Body</RButton>
                </RButtonGroup>
            </div>

            <div class="scaffold-demo-controls__group">
                <span>FAB</span>
                <RButtonGroup v-model="fabPlacement" selection="single">
                    <RButton value="viewport">Viewport</RButton>
                    <RButton value="body">Body</RButton>
                    <RButton value="app-bar-seam">App bar seam</RButton>
                </RButtonGroup>
            </div>

            <label class="scaffold-demo-controls__switch">
                <span>Collapsing</span>
                <RSwitch v-model="collapsing" aria-label="Toggle collapsing" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Hide on scroll</span>
                <RSwitch v-model="hideOnScroll" aria-label="Toggle hide on scroll" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Underlap</span>
                <RSwitch v-model="underlap" aria-label="Toggle underlap" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Navigation rail</span>
                <RSwitch v-model="navigationRail" aria-label="Toggle navigation rail" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Navigation drawer</span>
                <RSwitch v-model="navigationDrawer" aria-label="Toggle navigation drawer" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Side sheet</span>
                <RSwitch v-model="sideSheet" aria-label="Toggle side sheet" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Bottom bar</span>
                <RSwitch v-model="bottomBar" aria-label="Toggle bottom bar" />
            </label>
            <label class="scaffold-demo-controls__switch">
                <span>Bottom bar hide on scroll</span>
                <RSwitch v-model="bottomBarHideOnScroll" aria-label="Toggle bottom bar hide on scroll" />
            </label>
        </div>

        <RScaffold
            class="scaffold-demo"
            :style="previewStyle"
            :scroll-direction="scrollDirection"
            :fab-placement="fabPlacement"
            :bottom-bar-hide-on-scroll="bottomBarHideOnScroll"
        >
            <template v-if="navigationRail || navigationDrawer" #navigation>
                <div class="scaffold-demo__navigation">
                    <RNavigationRail v-if="navigationRail" v-model="railActive" aria-label="Primary navigation rail">
                        <template #top>App</template>
                        <RNavigationRailItem value="home" :icon="RIHomeOutlined">Home</RNavigationRailItem>
                        <RNavigationRailItem value="listen" :icon="RIPlayCircleOutlined">Listen</RNavigationRailItem>
                        <RNavigationRailItem
                            value="favorites"
                            :icon="RIFavoriteBorderFilled"
                            :selected-icon="RIFavoriteFilled"
                        >
                            Favorites
                        </RNavigationRailItem>
                        <RNavigationRailItem value="settings" :icon="RISettingsOutlined">Settings</RNavigationRailItem>
                    </RNavigationRail>

                    <RSideSheet v-if="navigationDrawer" side="start" title="Navigation" width="280px">
                        <div class="scaffold-demo__drawer-items">
                            <RButton
                                :variant="drawerActive === 'home' ? 'contained' : 'text'"
                                full-width
                                @click="drawerActive = 'home'"
                            >
                                Home
                            </RButton>
                            <RButton
                                :variant="drawerActive === 'library' ? 'contained' : 'text'"
                                full-width
                                @click="drawerActive = 'library'"
                            >
                                Library
                            </RButton>
                            <RButton
                                :variant="drawerActive === 'settings' ? 'contained' : 'text'"
                                full-width
                                @click="drawerActive = 'settings'"
                            >
                                Settings
                            </RButton>
                        </div>
                    </RSideSheet>
                </div>
            </template>

            <template #app-bar>
                <RAppBarContainer
                    :content-align="appBarAlign"
                    :collapsing="collapsing"
                    :hide-on-scroll="hideOnScroll"
                    :underlap="underlap"
                    expanded-height="96px"
                >
                    <RTopAppBar>
                    <template #title>Scaffold preview</template>
                    <template #actions>
                        <RButton variant="text">Action</RButton>
                    </template>
                    </RTopAppBar>
                </RAppBarContainer>
            </template>

            <RResponsiveGrid :mode="gridMode" gap="16px">
                <RCard v-for="card in cards" :key="card" class="scaffold-demo__card">
                    <h2>Section {{ card }}</h2>
                    <p>
                        Scroll, resize the preview, and change the controls to inspect the current Scaffold behaviors.
                    </p>
                </RCard>
            </RResponsiveGrid>

            <template v-if="sideSheet" #side-sheet>
                <RSideSheet title="Context panel" width="280px">
                    This Standard Side Sheet consumes the available Body width and causes the responsive grid to reflow.
                </RSideSheet>
            </template>

            <template v-if="bottomBar" #bottom-bar>
                <footer class="scaffold-demo__bottom-bar">Bottom navigation preview</footer>
            </template>

            <template #fab>
                <RFab icon="add" label="Add" />
            </template>
        </RScaffold>
    </div>
</template>

<style scoped>
.scaffold-demo-showcase {
    inline-size: 100%;
}

.scaffold-demo-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-block-end: 16px;
}

.scaffold-demo-controls label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
}

.scaffold-demo-controls__group {
    display: grid;
    gap: 4px;
    font-size: 0.875rem;
}

.scaffold-demo-controls__slider {
    inline-size: 180px;
}

.scaffold-demo-controls__switch {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.scaffold-demo {
    block-size: min(72vh, 720px);
    min-inline-size: 320px;
    border: 1px solid var(--rui-sys-color-on-surface-outline, #747775);
    border-radius: 16px;
    transition: inline-size 160ms ease;
}

.scaffold-demo__navigation {
    display: inline-flex;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
}

.scaffold-demo__navigation :deep(.rui-navigation-rail),
.scaffold-demo__navigation :deep(.rui-side-sheet) {
    block-size: 100%;
}

.scaffold-demo__drawer-items {
    display: grid;
    gap: 8px;
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

.scaffold-demo__bottom-bar {
    padding: 16px 24px;
    background: var(--rui-sys-color-surface, #fff);
    border-block-start: 1px solid var(--rui-sys-color-on-surface-outline, #747775);
}
</style>
