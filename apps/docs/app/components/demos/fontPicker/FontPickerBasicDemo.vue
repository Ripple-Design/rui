<script setup lang="ts">
import "@ripple-design/rux-font-picker/styles.css"

import { RFontOption, RFontPicker } from "@ripple-design/rux-font-picker"
import { ref } from "vue"

const fontFamily = ref<string | null>("system-ui")
const fonts = [
    { value: "system-ui", label: "System UI", fontFamily: "system-ui, sans-serif" },
    { value: "serif", label: "Serif", fontFamily: "serif" },
    { value: "monospace", label: "Monospace", fontFamily: "monospace" },
    { value: "cursive", label: "Cursive", fontFamily: "cursive" },
]
</script>

<template>
    <RFontPicker v-model="fontFamily" label="Font family" placeholder="Choose a font">
        <RFontOption
            v-for="font in fonts"
            :key="font.value"
            :value="font.value"
            :label="font.label"
            :font-family="font.fontFamily"
        />
    </RFontPicker>
</template>
