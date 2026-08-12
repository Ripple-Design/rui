import { nextTick, ref } from "vue"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useInfiniteScroll } from "../useInfiniteScroll"

class TestIntersectionObserver {
    static instances: TestIntersectionObserver[] = []
    readonly callback: IntersectionObserverCallback

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        TestIntersectionObserver.instances.push(this)
    }

    observe() {}
    unobserve() {}
    disconnect() {}

    emit(isIntersecting: boolean) {
        this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
}

function setGeometry(element: HTMLElement, values: Partial<Pick<HTMLElement, "clientHeight" | "scrollHeight" | "clientWidth" | "scrollWidth" | "scrollTop" | "scrollLeft">>) {
    for (const [key, value] of Object.entries(values)) {
        Object.defineProperty(element, key, { configurable: true, value, writable: true })
    }
}

async function flush() {
    await nextTick()
    await Promise.resolve()
}

afterEach(() => {
    vi.useRealTimers()
    TestIntersectionObserver.instances = []
    vi.unstubAllGlobals()
})

describe("useInfiniteScroll", () => {
    it("loads visible content that does not overflow", async () => {
        vi.stubGlobal("IntersectionObserver", TestIntersectionObserver)
        const element = document.createElement("div")
        setGeometry(element, { clientHeight: 100, scrollHeight: 100, clientWidth: 100, scrollWidth: 100 })
        const loadMore = vi.fn()

        useInfiniteScroll(ref(element), loadMore, { interval: 0, canLoadMore: () => false })
        await flush()
        TestIntersectionObserver.instances[0]!.emit(true)
        await flush()

        expect(loadMore).not.toHaveBeenCalled()
    })

    it("loads at the configured bottom distance", async () => {
        vi.useFakeTimers()
        vi.stubGlobal("IntersectionObserver", TestIntersectionObserver)
        const element = document.createElement("div")
        setGeometry(element, { clientHeight: 100, scrollHeight: 300, scrollTop: 180, clientWidth: 100, scrollWidth: 100 })
        const allowLoad = ref(true)
        const loadMore = vi.fn(() => { allowLoad.value = false })
        useInfiniteScroll(ref(element), loadMore, { distance: 20, interval: 0, canLoadMore: () => allowLoad.value })
        await flush()
        TestIntersectionObserver.instances[0]!.emit(true)
        await flush()
        await vi.runAllTimersAsync()

        expect(loadMore).toHaveBeenCalledTimes(1)
    })

    it("serializes pending loaders and exposes isLoading", async () => {
        vi.useFakeTimers()
        vi.stubGlobal("IntersectionObserver", TestIntersectionObserver)
        const element = document.createElement("div")
        setGeometry(element, { clientHeight: 100, scrollHeight: 100, clientWidth: 100, scrollWidth: 100 })
        let resolveLoad!: () => void
        const allowLoad = ref(true)
        const loadMore = vi.fn(() => new Promise<void>((resolve) => { resolveLoad = () => { allowLoad.value = false; resolve() } }))
        const { isLoading } = useInfiniteScroll(ref(element), loadMore, { interval: 100, canLoadMore: () => allowLoad.value })
        await flush()
        TestIntersectionObserver.instances[0]!.emit(true)
        await flush()

        expect(isLoading.value).toBe(true)
        element.dispatchEvent(new Event("scroll"))
        await flush()
        expect(loadMore).toHaveBeenCalledTimes(1)

        resolveLoad()
        await vi.advanceTimersByTimeAsync(100)
        expect(isLoading.value).toBe(false)
    })

    it("is safe without IntersectionObserver and null targets", async () => {
        vi.stubGlobal("IntersectionObserver", undefined)
        const loadMore = vi.fn()

        expect(() => useInfiniteScroll(ref<HTMLElement | null>(null), loadMore)).not.toThrow()
        await flush()
        expect(loadMore).not.toHaveBeenCalled()
    })
})
