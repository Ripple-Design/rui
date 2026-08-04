export type RVideoPlayerProps = {
    /** Accessible label for the player shell and controls. */
    label?: string
    /** Total playable duration in seconds. */
    duration: number
    /** Current playback position in seconds. */
    currentTime: number
    /** Buffered endpoint in seconds. */
    bufferedTime?: number
    /** Whether the consumer reports that playback is active. */
    playing: boolean
    /** Current volume from 0 through 1. */
    volume: number
    /** Whether the consumer reports that media is muted. */
    muted: boolean
    /** Current playback rate. */
    playbackRate: number
    /** Whether the consumer reports that its fullscreen target is active. */
    fullscreen: boolean
    /** Whether the playback-rate menu is open. */
    settingsOpen: boolean
    /** Playback-rate choices displayed in the settings menu. */
    playbackRates?: readonly number[]
    /** Disables every player control. */
    disabled?: boolean
}

export type RVideoPlayerEmits = {
    /** Requests that the consumer begin playback. */
    (event: "play-request"): void
    /** Requests that the consumer pause playback. */
    (event: "pause-request"): void
    /** Requests a playback position in seconds. */
    (event: "seek-request", time: number): void
    /** Requests a volume between 0 and 1. */
    (event: "volume-request", volume: number): void
    /** Requests the next muted state. */
    (event: "muted-request", muted: boolean): void
    /** Requests a playback rate. */
    (event: "playback-rate-request", rate: number): void
    /** Requests the next fullscreen state. */
    (event: "fullscreen-request", fullscreen: boolean): void
    /** Requests the next playback-rate menu open state. */
    (event: "settings-open-request", open: boolean): void
}
