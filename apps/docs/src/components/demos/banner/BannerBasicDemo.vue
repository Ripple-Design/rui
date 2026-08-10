<script setup lang="ts">
import { RIInfoOutlined } from "@ripple-design/icons"
import { ref } from "vue"

import { RBanner, RButton, RColumn, RRow } from "@ripple-design/rui"

const visible = ref(true)
const status = ref("Banner is shown")
const bannerRef = ref<InstanceType<typeof RBanner> | null>(null)

function show() {
    visible.value = true
}

function showWithDelay() {
    bannerRef.value?.show(300)
}

function dismiss() {
    visible.value = false
}
</script>

<template>
    <RColumn gap="24px" class="banner-demo">
        <RRow gap="8px" wrap>
            <RButton @click="show">Show banner</RButton>
            <RButton @click="showWithDelay">Show after 300ms</RButton>
            <RButton @click="dismiss">Dismiss banner</RButton>
        </RRow>

        <RBanner
            ref="bannerRef"
            v-model="visible"
            :icon="RIInfoOutlined"
            :lines="2"
            message="You are currently offline. Changes will be saved when a network connection is available."
            left-action="Dismiss"
            right-action="Settings"
            @left-action="dismiss"
            @right-action="status = 'Settings action selected'"
            @shown="status = 'Banner shown'"
            @dismissed="status = 'Banner dismissed'"
        />

        <RBanner :model-value="true" :lines="1" message="A one-line banner without an icon or actions." />

        <RBanner
            :model-value="true"
            :icon="RIInfoOutlined"
            :lines="1"
            message="An icon banner keeps a 72px height when its message has one line."
            right-action="Review"
            @right-action="status = 'Review action selected'"
        />

        <RBanner
            :model-value="true"
            :lines="2"
            message="A two-line banner reserves space for a second message line and truncates any additional content with an ellipsis."
            left-action="Not now"
            right-action="Learn more"
            @left-action="status = 'Not now action selected'"
            @right-action="status = 'Learn more action selected'"
        />

        <RBanner
            :model-value="true"
            :icon="RIInfoOutlined"
            :lines="3"
            message="A three-line banner demonstrates the maximum supported message size. Resize the viewport to inspect the responsive placement and stacking of its two actions."
            left-action="Dismiss"
            right-action="Settings"
            @left-action="status = 'Dismiss action selected'"
            @right-action="status = 'Settings action selected'"
        />

        <output>{{ status }}</output>
    </RColumn>
</template>

<style scoped lang="scss">
.banner-demo {
    inline-size: 100%;
}
</style>
