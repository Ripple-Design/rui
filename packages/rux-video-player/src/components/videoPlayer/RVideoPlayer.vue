<script setup lang="ts">
import {
    RIFullscreenExitFilled,
    RIFullscreenFilled,
    RIPauseFilled,
    RIPlayArrowFilled,
    RISettingsFilled,
    RIVolumeMuteFilled,
    RIVolumeUpFilled,
} from "@ripple-design/icons"
import { RIconButton, RMenu, RMenuItem, RRow, RSlider, RSurface, RText } from "@ripple-design/rui"
import { computed } from "vue"

import type { RVideoPlayerEmits, RVideoPlayerProps } from "./types"

const props = withDefaults(defineProps<RVideoPlayerProps>(), {
    label: "Video player",
    bufferedTime: 0,
    playbackRates: () => [0.5, 1, 1.5, 2],
    disabled: false,
})
const emit = defineEmits<RVideoPlayerEmits>()

function normalize(value: number, minimum: number, maximum: number) {
    return Math.min(Math.max(Number.isFinite(value) ? value : minimum, minimum), maximum)
}

const resolvedDuration = computed(() => Math.max(0, Number.isFinite(props.duration) ? props.duration : 0))
const resolvedCurrentTime = computed(() => normalize(props.currentTime, 0, resolvedDuration.value))
const resolvedVolume = computed(() => normalize(props.volume, 0, 1))
const canSeek = computed(() => resolvedDuration.value > 0 && !props.disabled)
const volumeStyle = computed(() => ({
    "--rui-comp-video-player-range-progress": `${resolvedVolume.value * 100}%`,
    "--rui-comp-video-player-range-buffered": "0%",
}))
const playLabel = computed(() => (props.playing ? "Pause" : "Play"))
const muteLabel = computed(() => (props.muted ? "Unmute" : "Mute"))
const fullscreenLabel = computed(() => (props.fullscreen ? "Exit fullscreen" : "Enter fullscreen"))
const timeText = computed(() => `${formatTime(resolvedCurrentTime.value)} / ${formatTime(resolvedDuration.value)}`)
const seekValueText = computed(() => `${formatTime(resolvedCurrentTime.value)} of ${formatTime(resolvedDuration.value)}`)
const volumeValueText = computed(() => `${Math.round(resolvedVolume.value * 100)} percent`)

function formatTime(value: number) {
    const totalSeconds = Math.floor(Math.max(0, Number.isFinite(value) ? value : 0))
    const seconds = totalSeconds % 60
    const minutes = Math.floor(totalSeconds / 60) % 60
    const hours = Math.floor(totalSeconds / 3600)
    const paddedSeconds = seconds.toString().padStart(2, "0")

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${paddedSeconds}`
    }

    return `${minutes}:${paddedSeconds}`
}

function requestPlayback() {
    if (props.disabled) {
        return
    }

    if (props.playing) {
        emit("pause-request")
        return
    }

    emit("play-request")
}

function requestSeek(value: number) {
    emit("seek-request", value)
}

function requestVolume(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    emit("volume-request", Number(input.value))
}

function requestMute() {
    if (!props.disabled) {
        emit("muted-request", !props.muted)
    }
}

function requestPlaybackRate(rate: number) {
    if (!props.disabled) {
        emit("playback-rate-request", rate)
    }
}

function requestFullscreen() {
    if (!props.disabled) {
        emit("fullscreen-request", !props.fullscreen)
    }
}

function requestSettingsOpen(open: boolean) {
    if (!props.disabled) {
        emit("settings-open-request", open)
    }
}
</script>

<template>
    <RSurface
        as="section"
        class="rui-video-player"
        :elevation="2"
        :aria-label="label"
        :class="{
            'rui-video-player--disabled': disabled,
            'rui-video-player--fullscreen': fullscreen,
        }"
    >
        <div class="rui-video-player__media">
            <slot name="media" />

            <div class="rui-video-player__overlay" role="group" :aria-label="`${label} controls`">
                <RSlider
                    class="rui-video-player__seek"
                    :model-value="resolvedCurrentTime"
                    :max="resolvedDuration"
                    :step="0.1"
                    :disabled="!canSeek"
                    :format-value="() => seekValueText"
                    aria-label="Seek"
                    @update:model-value="requestSeek"
                />

                <RRow class="rui-video-player__control-row" align="center" justify="space-between" gap="8px">
                    <RRow align="center" gap="4px">
                        <RIconButton
                            :model-value="playing"
                            :icon="RIPlayArrowFilled"
                            :active-icon="RIPauseFilled"
                            :label="playLabel"
                            :disabled="disabled"
                            @update:model-value="requestPlayback"
                        />
                        <RIconButton
                            :model-value="muted"
                            :icon="RIVolumeUpFilled"
                            :active-icon="RIVolumeMuteFilled"
                            :label="muteLabel"
                            :disabled="disabled"
                            @update:model-value="requestMute"
                        />
                        <input
                            class="rui-video-player__range rui-video-player__range--volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            :value="resolvedVolume"
                            :disabled="disabled"
                            aria-label="Volume"
                            :aria-valuetext="volumeValueText"
                            :style="volumeStyle"
                            @input="requestVolume"
                        />
                        <RText class="rui-video-player__time" as="span" variant="caption" emphasis="high">
                            {{ timeText }}
                        </RText>
                    </RRow>

                    <RRow align="center" gap="4px">
                        <RMenu :open="settingsOpen" align="end" :disabled="disabled" @update:open="requestSettingsOpen">
                            <template #trigger>
                                <RIconButton :icon="RISettingsFilled" label="Playback speed" :disabled="disabled" />
                            </template>

                            <RMenuItem
                                v-for="rate in playbackRates"
                                :key="rate"
                                :disabled="disabled"
                                @click="requestPlaybackRate(rate)"
                            >
                                {{ rate }}×
                            </RMenuItem>
                        </RMenu>
                        <RIconButton
                            :model-value="fullscreen"
                            :icon="RIFullscreenFilled"
                            :active-icon="RIFullscreenExitFilled"
                            :label="fullscreenLabel"
                            :disabled="disabled"
                            @update:model-value="requestFullscreen"
                        />
                    </RRow>
                </RRow>
            </div>
        </div>
    </RSurface>
</template>

<style scoped>
.rui-video-player {
    --rui-comp-video-player-background: var(--rui-sys-color-surface);
    --rui-comp-video-player-controls-background: color-mix(in srgb, var(--rui-sys-color-surface) 92%, transparent);
    --rui-comp-video-player-track: var(--rui-sys-color-on-surface-outline);
    --rui-comp-video-player-buffer: color-mix(in srgb, var(--rui-sys-color-on-surface-medium) 45%, transparent);
    --rui-comp-video-player-progress: var(--rui-sys-color-primary);
    --rui-comp-video-player-focus: var(--rui-sys-color-primary);

    display: grid;
    overflow: hidden;
    background: var(--rui-comp-video-player-background);
}

.rui-video-player__media {
    position: relative;
    min-inline-size: 0;
    background: #000;
}

.rui-video-player__overlay :deep(.rui-icon-button) {
    --rui-icon-button-color: var(--rui-sys-color-on-primary);
    --rui-icon-button-disabled-color: var(--rui-sys-color-on-primary);
}

.rui-video-player__overlay {
    --rui-icon-button-color: var(--rui-sys-color-on-primary);
    --rui-comp-text-color: var(--rui-sys-color-on-primary);

    position: absolute;
    z-index: 1;
    inset-inline: 0;
    inset-block-end: 0;
    display: grid;
    gap: 8px;
    padding: 12px 16px;
    color: var(--rui-sys-color-on-primary);
    background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 72%));
    transition: opacity var(--rui-sys-motion-duration-small-out) var(--rui-sys-motion-easing-standard),
        transform var(--rui-sys-motion-duration-small-out) var(--rui-sys-motion-easing-standard),
        display var(--rui-sys-motion-duration-small-out) var(--rui-sys-motion-easing-standard) allow-discrete;
}

.rui-video-player__control-row {
    min-inline-size: 0;
}

.rui-video-player__time {
    white-space: nowrap;
}

.rui-video-player__range {
    --rui-comp-video-player-range-progress: 0%;
    --rui-comp-video-player-range-buffered: 0%;

    appearance: none;
    inline-size: 100%;
    block-size: 20px;
    margin: 0;
    background: transparent;
    cursor: pointer;
}

.rui-video-player__range:disabled {
    cursor: default;
    opacity: 0.38;
}

.rui-video-player__range--volume {
    inline-size: 96px;
}

.rui-video-player__range--volume::-webkit-slider-runnable-track {
    block-size: 4px;
    border-radius: 999px;
    background: linear-gradient(
        to right,
        var(--rui-comp-video-player-progress) 0 var(--rui-comp-video-player-range-progress),
        var(--rui-comp-video-player-buffer) var(--rui-comp-video-player-range-progress)
            var(--rui-comp-video-player-range-buffered),
        var(--rui-comp-video-player-track) var(--rui-comp-video-player-range-buffered) 100%
    );
}

.rui-video-player__range--volume::-webkit-slider-thumb {
    appearance: none;
    inline-size: 16px;
    block-size: 16px;
    margin-block-start: -6px;
    border: 0;
    border-radius: 50%;
    background: var(--rui-comp-video-player-thumb);
}

.rui-video-player__range--volume::-moz-range-track {
    block-size: 4px;
    border-radius: 999px;
    background: var(--rui-comp-video-player-track);
}

.rui-video-player__range--volume::-moz-range-progress {
    block-size: 4px;
    border-radius: 999px;
    background: var(--rui-comp-video-player-progress);
}

.rui-video-player__range--volume::-moz-range-thumb {
    inline-size: 16px;
    block-size: 16px;
    border: 0;
    border-radius: 50%;
    background: var(--rui-comp-video-player-thumb);
}

.rui-video-player__range:focus-visible {
    outline: 2px solid var(--rui-comp-video-player-focus);
    outline-offset: 2px;
}

.rui-video-player--disabled .rui-video-player__overlay {
    opacity: 0.7;
}

@media (max-width: 839px) {
    .rui-video-player__overlay {
        padding: 8px 12px;
    }

    .rui-video-player__control-row {
        flex-wrap: wrap;
    }

    .rui-video-player__range--volume {
        inline-size: 72px;
    }
}

@media (max-width: 599px) {
    .rui-video-player__time {
        display: none;
    }

    .rui-video-player__range--volume {
        display: none;
    }
}
</style>
