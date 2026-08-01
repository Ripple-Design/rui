export type RSpringOptions = {
    initialValue: number
    stiffness?: number
    damping?: number
    mass?: number
    restDelta?: number
    restSpeed?: number
    onUpdate: (value: number) => void
}

export type RSpring = {
    getValue: () => number
    isRunning: () => boolean
    jumpTo: (value: number) => void
    setTarget: (value: number) => void
    stop: () => void
    destroy: () => void
}

export const MDC_DETERMINATE_SPRING_STIFFNESS = 50
export const MDC_DETERMINATE_SPRING_DAMPING = 2 * Math.sqrt(MDC_DETERMINATE_SPRING_STIFFNESS)

const MAX_FRAME_DELTA_SECONDS = 1 / 30
const DEFAULT_REST_DELTA = 0.0001
const DEFAULT_REST_SPEED = 0.0001

export function createSpring(options: RSpringOptions): RSpring {
    const mass = options.mass ?? 1
    const stiffness = options.stiffness ?? MDC_DETERMINATE_SPRING_STIFFNESS
    const damping = options.damping ?? MDC_DETERMINATE_SPRING_DAMPING
    const restDelta = options.restDelta ?? DEFAULT_REST_DELTA
    const restSpeed = options.restSpeed ?? DEFAULT_REST_SPEED
    const mediaQuery =
        typeof window !== "undefined" && typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-reduced-motion: reduce)")
            : null

    let value = options.initialValue
    let target = options.initialValue
    let velocity = 0
    let frame = 0
    let previousFrameTime = 0
    let paused = false
    let destroyed = false
    let reducedMotion = mediaQuery?.matches ?? false

    function cancelFrame() {
        if (frame) {
            cancelAnimationFrame(frame)
            frame = 0
        }
    }

    function settle() {
        value = target
        velocity = 0
        previousFrameTime = 0
        cancelFrame()
        options.onUpdate(value)
    }

    function step(frameTime: number) {
        frame = 0

        if (destroyed || paused || reducedMotion) {
            return
        }

        if (!previousFrameTime) {
            previousFrameTime = frameTime
            frame = requestAnimationFrame(step)
            return
        }

        const deltaSeconds = Math.min((frameTime - previousFrameTime) / 1000, MAX_FRAME_DELTA_SECONDS)
        previousFrameTime = frameTime
        const displacement = value - target
        const acceleration = (-stiffness * displacement - damping * velocity) / mass

        velocity += acceleration * deltaSeconds
        value += velocity * deltaSeconds

        if (Math.abs(target - value) <= restDelta && Math.abs(velocity) <= restSpeed) {
            settle()
            return
        }

        options.onUpdate(value)
        frame = requestAnimationFrame(step)
    }

    function start() {
        if (destroyed || paused || reducedMotion || frame || value === target) {
            return
        }

        previousFrameTime = 0
        frame = requestAnimationFrame(step)
    }

    function handleReducedMotionChange(event: MediaQueryListEvent) {
        reducedMotion = event.matches

        if (reducedMotion) {
            settle()
            return
        }

        start()
    }

    function handleVisibilityChange() {
        paused = document.hidden
        cancelFrame()
        previousFrameTime = 0

        if (!paused) {
            start()
        }
    }

    if (mediaQuery) {
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleReducedMotionChange)
        } else {
            mediaQuery.addListener(handleReducedMotionChange)
        }
    }

    if (typeof document !== "undefined") {
        paused = document.hidden
        document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    return {
        getValue() {
            return value
        },
        isRunning() {
            return !!frame
        },
        jumpTo(nextValue) {
            target = nextValue
            value = nextValue
            velocity = 0
            previousFrameTime = 0
            cancelFrame()
            options.onUpdate(value)
        },
        setTarget(nextValue) {
            target = nextValue

            if (reducedMotion) {
                settle()
                return
            }

            start()
        },
        stop() {
            velocity = 0
            previousFrameTime = 0
            cancelFrame()
        },
        destroy() {
            if (destroyed) {
                return
            }

            destroyed = true
            cancelFrame()

            if (mediaQuery) {
                if (typeof mediaQuery.removeEventListener === "function") {
                    mediaQuery.removeEventListener("change", handleReducedMotionChange)
                } else {
                    mediaQuery.removeListener(handleReducedMotionChange)
                }
            }

            if (typeof document !== "undefined") {
                document.removeEventListener("visibilitychange", handleVisibilityChange)
            }
        },
    }
}
