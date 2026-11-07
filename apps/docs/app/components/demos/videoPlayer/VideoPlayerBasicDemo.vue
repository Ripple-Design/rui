<script setup lang="ts">
import { RSlider } from "@ripple-design/rui"
import { RVideoPlayer } from "@ripple-design/rux-video-player"
import { ref } from "vue"

const duration = ref(300)
const currentTime = ref(96)
const bufferedTime = ref(182)
const playing = ref(false)
const volume = ref(0.7)
const muted = ref(false)
const playbackRate = ref(1)
const fullscreen = ref(false)
const settingsOpen = ref(false)
const width = ref(640)

function requestPlay() {
    playing.value = true
}

function requestPause() {
    playing.value = false
}

function requestSeek(time: number) {
    currentTime.value = time
}

function requestVolume(nextVolume: number) {
    volume.value = nextVolume
}

function requestMuted(nextMuted: boolean) {
    muted.value = nextMuted
}

function requestPlaybackRate(rate: number) {
    playbackRate.value = rate
    settingsOpen.value = false
}

function requestFullscreen(nextFullscreen: boolean) {
    fullscreen.value = nextFullscreen
}

function requestSettingsOpen(open: boolean) {
    settingsOpen.value = open
}
</script>

<template>
    <div class="video-player-demo">
        <RSlider
            v-model="width"
            class="video-player-demo__width"
            :min="320"
            :max="960"
            :step="16"
            :format-value="(value) => `${value}px`"
            aria-label="Player width"
        />

        <RVideoPlayer
            class="video-player-demo__player"
            :style="{ inlineSize: `${width}px` }"
            label="Demo video player"
            :duration="duration"
            :current-time="currentTime"
            :buffered-time="bufferedTime"
            :playing="playing"
            :volume="volume"
            :muted="muted"
            :playback-rate="playbackRate"
            :fullscreen="fullscreen"
            :settings-open="settingsOpen"
            :playback-rates="[0.5, 1, 1.5, 2]"
            :disabled="false"
            @play-request="requestPlay"
            @pause-request="requestPause"
            @seek-request="requestSeek"
            @volume-request="requestVolume"
            @muted-request="requestMuted"
            @playback-rate-request="requestPlaybackRate"
            @fullscreen-request="requestFullscreen"
            @settings-open-request="requestSettingsOpen"
        >
            <template #media>
                <div class="video-player-demo__media" aria-label="Consumer-provided media area">
                    <span>Consumer-provided media</span>
                </div>
            </template>
        </RVideoPlayer>
    </div>
</template>

<style scoped>
.video-player-demo {
    display: grid;
    gap: 16px;
    inline-size: 100%;
}

.video-player-demo__width {
    inline-size: min(100%, 960px);
}

.video-player-demo__player {
    max-inline-size: 100%;
}

.video-player-demo__media {
    display: grid;
    aspect-ratio: 16 / 9;
    place-items: center;
    background: linear-gradient(135deg, #16213e, #0f3460);
    color: #fff;
}
</style>
