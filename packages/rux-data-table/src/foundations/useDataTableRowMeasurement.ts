import { onBeforeUnmount, type ComponentPublicInstance } from "vue"

export function useDataTableRowMeasurement(reportHeight: (index: number, height: number) => void) {
    const elements = new Map<number, Element>()
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(entries => {
        for (const entry of entries) {
            const index = [...elements].find(([, element]) => element === entry.target)?.[0]
            if (index != null) reportHeight(index, entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height)
        }
    })

    function itemRef(index: number) {
        return (element: Element | ComponentPublicInstance | null) => {
            const target = element instanceof Element ? element : null
            const previous = elements.get(index)
            if (previous && previous !== target) observer?.unobserve(previous)
            if (!target) {
                elements.delete(index)
                return
            }
            elements.set(index, target)
            observer?.observe(target)
            reportHeight(index, target.getBoundingClientRect().height)
        }
    }

    onBeforeUnmount(() => observer?.disconnect())
    return { itemRef }
}
