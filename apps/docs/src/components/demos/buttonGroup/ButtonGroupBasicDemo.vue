<script setup lang="ts">
import {
    RICalendarViewMonthOutlined,
    RIImageOutlined,
    RIInsertDriveFileOutlined,
    RIViewDayOutlined,
    RIViewWeekOutlined,
    RIVideocamOutlined,
} from "@ripple-design/icons"
import { RButton, RButtonGroup, RColumn, RRow, RText } from "@ripple-design/rui"
import { ref } from "vue"

const range = ref("week")
const filters = ref(["files", "images"])
const widthRange = ref("medium")
const category = ref("images")
</script>

<template>
    <RColumn gap="20px" class="button-group-demo">
        <RRow gap="16px" wrap align="center">
            <RButtonGroup v-model="range" selection="single" aria-label="Time range">
                <RButton value="day">Day</RButton>
                <RButton value="week">Week</RButton>
                <RButton value="month">Month</RButton>
            </RButtonGroup>
            <RText>Single: {{ range }}</RText>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButtonGroup v-model="filters" selection="multiple" aria-label="Content filters">
                <RButton value="files">Files</RButton>
                <RButton value="images">Images</RButton>
                <RButton value="videos">Videos</RButton>
            </RButtonGroup>
            <RText>Multiple: {{ filters.join(", ") }}</RText>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RButtonGroup v-model="category" selection="single" aria-label="Content category">
                <RButton value="files" :icon="RIInsertDriveFileOutlined">Files</RButton>
                <RButton value="images" :icon="RIImageOutlined">Images</RButton>
                <RButton value="videos" :icon="RIVideocamOutlined">Videos</RButton>
            </RButtonGroup>
            <RText>Leading icon: {{ category }}</RText>
        </RRow>

        <RColumn gap="12px" class="button-group-demo__full-width">
            <RButtonGroup v-model="widthRange" selection="single" full-width aria-label="Full-width time range">
                <RButton value="short">Short</RButton>
                <RButton value="medium">Medium</RButton>
                <RButton value="long">Long</RButton>
            </RButtonGroup>
            <RText>Full width: {{ widthRange }}</RText>
        </RColumn>

        <RRow gap="16px" wrap align="center">
            <RButtonGroup v-model="range" selection="single" variant="icon" aria-label="Time range icons">
                <RButton value="day" :icon="RIViewDayOutlined" aria-label="Day" />
                <RButton value="week" :icon="RIViewWeekOutlined" aria-label="Week" />
                <RButton value="month" :icon="RICalendarViewMonthOutlined" aria-label="Month" />
            </RButtonGroup>
            <RText>Icon: {{ range }}</RText>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.button-group-demo {
    width: 100%;
}

.button-group-demo__full-width {
    width: 100%;
}
</style>
