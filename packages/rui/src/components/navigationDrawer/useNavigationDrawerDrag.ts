import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue"

import type { RNavigationDrawerSide } from "./types"

type UseNavigationDrawerDragOptions = {
    open: Readonly<Ref<boolean>>
    side: Readonly<Ref<RNavigationDrawerSide>>
    panel: Readonly<Ref<HTMLElement | null>>
    root: Readonly<Ref<HTMLElement | null>>
    edgeSize: Readonly<Ref<number>>
    requestOpen: () => void
    requestClose: () => void
}

const VELOCITY_THRESHOLD = 400
const SETTLE_BASE_DURATION = 256
const SETTLE_MAX_DURATION = 600

function getDirection(side: RNavigationDrawerSide, element: HTMLElement | null) {
    const rtl = element && getComputedStyle(element).direction === "rtl"
    return (side === "start") !== rtl ? 1 : -1
}

function settleDuration(distance: number, width: number, velocity: number) {
    if (Math.abs(velocity) > 0) return Math.min(SETTLE_MAX_DURATION, 4 * Math.round((1000 * distance) / Math.abs(velocity)))
    return Math.min(SETTLE_MAX_DURATION, ((distance / Math.max(width, 1)) + 1) * SETTLE_BASE_DURATION)
}

export function useNavigationDrawerDrag(options: UseNavigationDrawerDragOptions) {
    const progress = ref(options.open.value ? 1 : 0)
    const dragging = ref(false)
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let startProgress = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let settleAnimation: Animation | null = null

    const style = computed(() => ({ "--rui-comp-navigation-drawer-progress": progress.value }))

    function finish(target: 0 | 1) {
        settleAnimation?.cancel()
        settleAnimation = null
        const panel = options.panel.value
        const root = options.root.value
        const current = progress.value
        const width = panel?.getBoundingClientRect().width ?? 280
        const distance = Math.abs(target - current) * width
        const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : settleDuration(distance, width, velocity)

        if (!panel || duration === 0) {
            progress.value = target
            if (target) options.requestOpen()
            else options.requestClose()
            return
        }

        const from = current
        const animationTarget = root ?? panel
        const animation = animationTarget.animate(
            [{ "--rui-comp-navigation-drawer-progress": from }, { "--rui-comp-navigation-drawer-progress": target }],
            { duration, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
        )
        settleAnimation = animation
        animation.finished.catch(() => undefined).then(async () => {
            if (settleAnimation !== animation) return
            progress.value = target
            if (target) options.requestOpen()
            else options.requestClose()
            await nextTick()
            animation.cancel()
            if (settleAnimation === animation) settleAnimation = null
        })
    }

    function begin(event: PointerEvent, initialProgress: number) {
        pointerId = event.pointerId
        startX = lastX = event.clientX
        startY = event.clientY
        startProgress = initialProgress
        lastTime = event.timeStamp
        velocity = 0
        dragging.value = false
        settleAnimation?.cancel()
        settleAnimation = null
    }

    function handlePointerDown(event: PointerEvent) {
        if (event.pointerType === "mouse" && event.button !== 0) return
        const panel = options.panel.value
        const target = event.target as Element | null
        const isPanel = !!target?.closest(".rui-modal-navigation-drawer__panel")
        const viewportWidth = window.innerWidth
        const physicalStart = getDirection(options.side.value, panel) === 1 ? 0 : viewportWidth
        const inEdge = Math.abs(event.clientX - physicalStart) <= options.edgeSize.value

        if (!options.open.value && !inEdge) return
        if (options.open.value && !isPanel && !inEdge) return

        if (!options.open.value) options.requestOpen()
        begin(event, options.open.value ? 1 : 0)
    }

    function handlePointerMove(event: PointerEvent) {
        if (pointerId !== event.pointerId) return
        const dx = event.clientX - startX
        const dy = event.clientY - startY
        if (!dragging.value) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
            if (Math.abs(dy) >= Math.abs(dx)) {
                pointerId = null
                return
            }
            dragging.value = true
        }

        event.preventDefault()
        const panel = options.panel.value
        const width = panel?.getBoundingClientRect().width ?? 280
        const direction = getDirection(options.side.value, panel)
        progress.value = Math.min(1, Math.max(0, startProgress + (dx * direction) / width))
        const elapsed = Math.max(1, event.timeStamp - lastTime)
        velocity = ((event.clientX - lastX) / elapsed) * 1000 * direction
        lastX = event.clientX
        lastTime = event.timeStamp
    }

    function handlePointerEnd(event: PointerEvent) {
        if (pointerId !== event.pointerId) return
        pointerId = null
        if (!dragging.value) return
        dragging.value = false
        const target = velocity > VELOCITY_THRESHOLD ? 1 : velocity < -VELOCITY_THRESHOLD ? 0 : progress.value >= 0.5 ? 1 : 0
        finish(target)
    }

    watch(options.open, (open) => {
        if (!dragging.value && !settleAnimation) progress.value = open ? 1 : 0
    })

    onMounted(() => {
        window.addEventListener("pointerdown", handlePointerDown, { passive: true })
        window.addEventListener("pointermove", handlePointerMove, { passive: false })
        window.addEventListener("pointerup", handlePointerEnd)
        window.addEventListener("pointercancel", handlePointerEnd)
    })
    onBeforeUnmount(() => {
        settleAnimation?.cancel()
        window.removeEventListener("pointerdown", handlePointerDown)
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerEnd)
        window.removeEventListener("pointercancel", handlePointerEnd)
    })

    return { dragging, progress, style }
}
