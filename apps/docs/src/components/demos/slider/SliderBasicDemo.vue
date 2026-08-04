<script setup lang="ts">
import { RColumn, RSlider } from "@ripple-design/rui"
import { ref } from "vue"

const continuous = ref(35)
const discrete = ref(40)
const range = ref<[number, number]>([25, 70])
const rtl = ref(65)
</script>

<template>
    <RColumn gap="24px" class="slider-demo">
        <RSlider v-model="continuous" aria-label="Continuous value" />
        <RSlider v-model="discrete" :step="10" show-ticks aria-label="Discrete value" />
        <RSlider v-model="range" :step="5" show-ticks aria-label="Selected range" />
        <RSlider :model-value="40" :step="5" show-ticks disabled aria-label="Disabled value" />
        <div dir="rtl">
            <RSlider v-model="rtl" aria-label="Right-to-left value" />
        </div>
    </RColumn>
</template>

<style scoped lang="scss">
.slider-demo {
    inline-size: 100%;
}
</style>
