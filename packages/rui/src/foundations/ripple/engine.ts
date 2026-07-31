import type { NormalizedRippleOptions } from "./types.ts"

export type RippleController = {
    update: (nextOptions: NormalizedRippleOptions) => void
    refreshGeometry: () => void
    destroy: () => void
}

type RippleWaveHandle = {
    centered: boolean
    clientX: number | null
    clientY: number | null
    release: () => void
    remove: () => void
    refreshGeometry: () => void
}

type PendingPointerStart = {
    timeoutId: number
    clientX: number
    clientY: number
}

type Cleanup = () => void

type HostDataset = DOMStringMap & {
    ruiRipplePositionManaged?: string
}

const SURFACE_CLASS = "rui-ripple-surface"
const SURFACE_DISABLED_CLASS = "is-disabled"
const SURFACE_HOVERED_CLASS = "is-hovered"
const SURFACE_UNBOUNDED_CLASS = "rui-ripple-surface--unbounded"
const SURFACE_HIGH_CONTRAST_CLASS = "rui-ripple-surface--contrast-high"
const UNBOUNDED_RIPPLE_CLASS = "rui-ripple-unbounded"
const WAVE_CLASS = "rui-ripple-wave"
const WAVE_OUT_CLASS = "is-out"
const RADIUS_IN_ANIMATION = "rui-ripple-radius-in"
const OPACITY_OUT_ANIMATION = "rui-ripple-opacity-out"

export function createRippleController(host: HTMLElement, initialOptions: NormalizedRippleOptions): RippleController {
    let options = initialOptions
    let destroyed = false
    let activeKeyboardKey: string | null = null
    let activeKeyboardWave: RippleWaveHandle | null = null
    let activeMousePointerId: number | null = null

    const activePointerWaves = new Map<number, RippleWaveHandle>()
    const liveWaves = new Set<RippleWaveHandle>()
    const pendingPointerStarts = new Map<number, PendingPointerStart>()
    const cleanup: Cleanup[] = []
    const dataset = host.dataset as HostDataset
    const surface = createSurface(host)

    if (getComputedStyle(host).position === "static") {
        host.style.position = "relative"
        dataset.ruiRipplePositionManaged = "true"
    }

    applyOptions(surface, options)

    const reset = () => {
        clearPointerStarts(pendingPointerStarts)
        clearWaves(surface, liveWaves)
        activePointerWaves.clear()
        liveWaves.clear()
        activeKeyboardWave = null
        activeKeyboardKey = null
        activeMousePointerId = null
    }

    const onMouseEnter = () => {
        if (destroyed || isDisabled(host, options)) {
            return
        }

        surface.classList.add(SURFACE_HOVERED_CLASS)
        ensureUnboundedRipple(surface, options)
    }

    const onMouseLeave = () => {
        surface.classList.remove(SURFACE_HOVERED_CLASS)

        if (activeMousePointerId == null) {
            return
        }

        const wave = activePointerWaves.get(activeMousePointerId)
        if (!wave) {
            activeMousePointerId = null
            return
        }

        wave.release()
        activePointerWaves.delete(activeMousePointerId)
        activeMousePointerId = null
    }

    const onPointerDown = (event: PointerEvent) => {
        if (destroyed || isDisabled(host, options) || event.button !== 0 || !event.isPrimary) {
            return
        }

        if (["touch", "pen"].includes(event.pointerType)) {
            const timeoutId = window.setTimeout(() => {
                pendingPointerStarts.delete(event.pointerId)
                if (destroyed || !host.isConnected || isDisabled(host, options)) {
                    return
                }
                const wave = createWave(surface, options, liveWaves, { clientX: event.clientX, clientY: event.clientY })
                activePointerWaves.set(event.pointerId, wave)
            }, 70)

            pendingPointerStarts.set(event.pointerId, {
                timeoutId,
                clientX: event.clientX,
                clientY: event.clientY,
            })
            return
        }

        activeMousePointerId = event.pointerId
        const wave = createWave(surface, options, liveWaves, { clientX: event.clientX, clientY: event.clientY })
        activePointerWaves.set(event.pointerId, wave)
    }

    const onPointerDone = (event: PointerEvent) => {
        const pending = pendingPointerStarts.get(event.pointerId)
        if (pending) {
            clearTimeout(pending.timeoutId)
            pendingPointerStarts.delete(event.pointerId)

            if (destroyed || !host.isConnected || isDisabled(host, options)) {
                if (activeMousePointerId === event.pointerId) {
                    activeMousePointerId = null
                }
                return
            }

            const wave = createWave(surface, options, liveWaves, { clientX: pending.clientX, clientY: pending.clientY })
            wave.release()

            if (activeMousePointerId === event.pointerId) {
                activeMousePointerId = null
            }
            return
        }

        const wave = activePointerWaves.get(event.pointerId)
        if (!wave) return
        wave.release()
        activePointerWaves.delete(event.pointerId)

        if (activeMousePointerId === event.pointerId) {
            activeMousePointerId = null
        }
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (destroyed || isDisabled(host, options) || event.repeat || activeKeyboardWave) return
        if (!isActivationKey(event.key)) return

        activeKeyboardKey = event.key
        activeKeyboardWave = createWave(surface, options, liveWaves, { centered: true })
    }

    const onKeyUp = (event: KeyboardEvent) => {
        if (!activeKeyboardWave || event.key !== activeKeyboardKey) return

        activeKeyboardWave.release()
        activeKeyboardWave = null
        activeKeyboardKey = null
    }

    const onBlur = () => {
        surface.classList.remove(SURFACE_HOVERED_CLASS)

        if (activeKeyboardWave) {
            activeKeyboardWave.release()
            activeKeyboardWave = null
            activeKeyboardKey = null
        }
    }

    const onVisibilityChange = () => {
        if (document.hidden) {
            reset()
        }
    }

    bind(host, "mouseenter", onMouseEnter, cleanup)
    bind(host, "mouseleave", onMouseLeave, cleanup)
    bind(host, "pointerdown", onPointerDown, cleanup)
    bind(host, "keydown", onKeyDown, cleanup)
    bind(host, "keyup", onKeyUp, cleanup)
    bind(host, "blur", onBlur, cleanup)
    bind(window, "pointerup", onPointerDone, cleanup)
    bind(window, "pointercancel", onPointerDone, cleanup)
    bind(document, "visibilitychange", onVisibilityChange, cleanup)

    return {
        update(nextOptions) {
            options = nextOptions
            applyOptions(surface, options)

            if (isDisabled(host, options)) {
                reset()
                return
            }

            ensureUnboundedRipple(surface, options)
            this.refreshGeometry()
        },
        refreshGeometry() {
            if (destroyed) {
                return
            }

            refreshUnboundedRippleGeometry(surface, options)
            liveWaves.forEach((wave) => wave.refreshGeometry())
            activeKeyboardWave?.refreshGeometry()
        },
        destroy() {
            if (destroyed) {
                return
            }

            destroyed = true
            cleanup.forEach((fn) => fn())
            reset()
            surface.remove()

            if (dataset.ruiRipplePositionManaged === "true") {
                host.style.removeProperty("position")
                delete dataset.ruiRipplePositionManaged
            }
        },
    }
}

function createSurface(host: HTMLElement) {
    const surface = document.createElement("span")
    surface.className = SURFACE_CLASS
    surface.setAttribute("aria-hidden", "true")
    host.append(surface)
    return surface
}

function applyOptions(surface: HTMLElement, options: NormalizedRippleOptions) {
    surface.classList.toggle(SURFACE_UNBOUNDED_CLASS, options.unbounded)
    surface.classList.toggle(SURFACE_DISABLED_CLASS, options.disabled)
    surface.classList.toggle(SURFACE_HIGH_CONTRAST_CLASS, options.contrast === "high")

    if (options.color) {
        surface.style.setProperty("--rui-ripple-color", options.color)
    } else {
        surface.style.removeProperty("--rui-ripple-color")
    }

    if (!options.unbounded) {
        surface.querySelector(`.${UNBOUNDED_RIPPLE_CLASS}`)?.remove()
    }
}

function applyResolvedRippleColor(surface: HTMLElement, element: HTMLElement, options: NormalizedRippleOptions) {
    // Press waves are created after the host may already have switched to its
    // selected/active color. Snapshot the host color instead of the surface
    // color, because the surface may still be intentionally lagging behind via
    // its delayed inherited-color transition.
    const colorSource = surface.parentElement instanceof HTMLElement ? surface.parentElement : surface
    const resolvedColor = options.color ?? getComputedStyle(colorSource).color
    element.style.setProperty("--rui-ripple-color", resolvedColor)
}

function updateUnboundedRippleGeometry(surface: HTMLElement, wave: HTMLElement) {
    const rect = surface.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2
    const diameter = Math.max(Math.hypot(width, height), 48)

    wave.style.width = `${diameter}px`
    wave.style.height = `${diameter}px`
    wave.style.marginTop = `${-diameter / 2}px`
    wave.style.marginLeft = `${-diameter / 2}px`
    wave.style.left = `${centerX}px`
    wave.style.top = `${centerY}px`
}

function refreshUnboundedRippleGeometry(surface: HTMLElement, options: NormalizedRippleOptions) {
    if (!options.unbounded) {
        return
    }

    const wave = surface.querySelector<HTMLElement>(`.${UNBOUNDED_RIPPLE_CLASS}`)
    if (!wave) {
        return
    }

    updateUnboundedRippleGeometry(surface, wave)
}

function ensureUnboundedRipple(surface: HTMLElement, options: NormalizedRippleOptions) {
    if (!options.unbounded || surface.querySelector(`.${UNBOUNDED_RIPPLE_CLASS}`)) {
        return
    }

    const wave = document.createElement("span")
    wave.className = UNBOUNDED_RIPPLE_CLASS
    // Do not snapshot the color for the persistent unbounded layer. It should
    // keep inheriting the host color so CSS can transition it after the press
    // wave finishes.
    updateUnboundedRippleGeometry(surface, wave)
    surface.append(wave)
}

function updateWaveGeometry(
    surface: HTMLElement,
    wave: HTMLElement,
    origin: {
        centered: boolean
        clientX: number | null
        clientY: number | null
    },
) {
    const rect = surface.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const originX = origin.centered || origin.clientX == null ? width / 2 : origin.clientX - rect.left
    const originY = origin.centered || origin.clientY == null ? height / 2 : origin.clientY - rect.top
    const diameter = Math.max(Math.hypot(width, height), 48)
    const translateX = `${-originX + width / 2}px`
    const translateY = `${-originY + height / 2}px`

    wave.style.width = `${diameter}px`
    wave.style.height = `${diameter}px`
    wave.style.marginTop = `${-diameter / 2}px`
    wave.style.marginLeft = `${-diameter / 2}px`
    wave.style.left = `${originX}px`
    wave.style.top = `${originY}px`
    wave.style.setProperty("--rui-ripple-transition-x", translateX)
    wave.style.setProperty("--rui-ripple-transition-y", translateY)
}

function createWave(
    surface: HTMLElement,
    options: NormalizedRippleOptions,
    liveWaves: Set<RippleWaveHandle>,
    origin: {
        centered?: boolean
        clientX?: number
        clientY?: number
    } = {},
): RippleWaveHandle {
    const wave = document.createElement("span")
    wave.className = WAVE_CLASS
    // Only the transient press wave gets a color snapshot. This keeps the
    // visible click wave stable even if the host color changes before or during
    // creation, while the persistent layers can still animate later.
    applyResolvedRippleColor(surface, wave, options)

    const centered = !!origin.centered
    const clientX = origin.clientX ?? null
    const clientY = origin.clientY ?? null

    updateWaveGeometry(surface, wave, { centered, clientX, clientY })

    let filled = false
    let released = false
    let removing = false
    let removed = false

    const remove = () => {
        if (removed) {
            return
        }

        removed = true
        liveWaves.delete(handle)
        wave.remove()
    }

    const startExit = () => {
        if (removing || removed) {
            return
        }

        removing = true
        wave.classList.add(WAVE_OUT_CLASS)
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
        if (event.animationName === RADIUS_IN_ANIMATION) {
            filled = true
            if (released) {
                startExit()
            }
            return
        }

        if (event.animationName === OPACITY_OUT_ANIMATION) {
            remove()
        }
    }

    const handleAnimationCancel = () => {
        remove()
    }

    wave.addEventListener("animationend", handleAnimationEnd)
    wave.addEventListener("animationcancel", handleAnimationCancel)
    surface.prepend(wave)

    let handle: RippleWaveHandle

    const release = () => {
        if (released || removed) {
            return
        }

        released = true
        if (filled) {
            startExit()
        }
    }

    const refreshGeometry = () => {
        if (removed) {
            return
        }

        updateWaveGeometry(surface, wave, { centered, clientX, clientY })
    }

    handle = {
        centered,
        clientX,
        clientY,
        release,
        remove,
        refreshGeometry,
    }

    liveWaves.add(handle)

    return handle
}

function clearPointerStarts(pendingPointerStarts: Map<number, PendingPointerStart>) {
    pendingPointerStarts.forEach((pending) => {
        clearTimeout(pending.timeoutId)
    })
    pendingPointerStarts.clear()
}

function clearWaves(surface: HTMLElement, liveWaves: Set<RippleWaveHandle>) {
    surface.classList.remove(SURFACE_HOVERED_CLASS)
    liveWaves.forEach((wave) => wave.remove())
}

function isActivationKey(key: string) {
    return key === "Enter" || key === " " || key === "Spacebar"
}

function isDisabled(host: HTMLElement, options: NormalizedRippleOptions) {
    return options.disabled || host.matches(":disabled, [aria-disabled='true']")
}

function bind<K extends keyof WindowEventMap>(
    target: Window,
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    cleanup: Cleanup[],
): void
function bind<K extends keyof DocumentEventMap>(
    target: Document,
    type: K,
    listener: (event: DocumentEventMap[K]) => void,
    cleanup: Cleanup[],
): void
function bind<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    listener: (event: HTMLElementEventMap[K]) => void,
    cleanup: Cleanup[],
): void
function bind(target: Window | Document | HTMLElement, type: string, listener: EventListener, cleanup: Cleanup[]) {
    target.addEventListener(type, listener)
    cleanup.push(() => target.removeEventListener(type, listener))
}
