class TestResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    value: TestResizeObserver,
    writable: true,
})
