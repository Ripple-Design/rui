import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, ref, type Ref } from "vue"
import { mount } from "@vue/test-utils"

import type { RScaffoldScrollDirection, RScaffoldScrollFacts } from "../../../layout/scaffold/context.ts"
import { useAppBarScroll } from "../useAppBarScroll.ts"

type TestOptions = {
    collapsing: Ref<boolean>
    direction: Ref<RScaffoldScrollDirection>
    facts: Ref<RScaffoldScrollFacts>
}

function mountScrollState(options: TestOptions) {
    const root = ref<HTMLElement | null>(null)
    const Host = defineComponent({
        setup(_, { expose }) {
            const { state, refresh } = useAppBarScroll({
                root,
                source: {
                    direction: options.direction,
                    facts: options.facts,
                },
                expandedHeight: "160px",
                collapsedHeight: "56px",
                scrollBehavior: "exit-until-collapsed",
                hideOnScroll: false,
                liftOnScroll: false,
                collapsing: options.collapsing,
            })

            expose({ state, refresh })
            return {}
        },
        render() {
            return h("div", { ref: root })
        },
    })

    return mount(Host)
}

function scrollFacts(overrides: Partial<RScaffoldScrollFacts> = {}): RScaffoldScrollFacts {
    return {
        top: 0,
        maxTop: 1000,
        delta: 0,
        direction: "idle",
        atStart: true,
        atEnd: false,
        timestamp: 1,
        ...overrides,
    }
}

describe("useAppBarScroll layout modes", () => {
    it("reports the natural height and ignores collapse metrics for static layouts", async () => {
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
            return new DOMRect(0, 0, 320, 123)
        })

        const direction = ref<RScaffoldScrollDirection>("vertical")
        const facts = ref(scrollFacts({ top: 80, direction: "down" }))
        const collapsing = ref(false)
        const wrapper = mountScrollState({ direction, facts, collapsing })
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const exposed = wrapper.vm.$.exposed as {
            state: { value: { visibleHeight: number } }
            refresh: () => void
        }
        exposed.refresh()
        const state = exposed.state.value
        expect(state.visibleHeight).toBe(123)

        wrapper.unmount()
        vi.restoreAllMocks()
    })

    it("keeps collapse calculations for collapsing layouts", async () => {
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
            const height = Number.parseFloat(this.style.blockSize) || 123
            return new DOMRect(0, 0, 320, height)
        })

        const direction = ref<RScaffoldScrollDirection>("vertical")
        const facts = ref(scrollFacts({ top: 80 }))
        const collapsing = ref(true)
        const wrapper = mountScrollState({ direction, facts, collapsing })
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const exposed = wrapper.vm.$.exposed as {
            state: { value: { collapseDistance: number; collapseOffset: number; phase: string } }
            refresh: () => void
        }
        exposed.refresh()
        const state = exposed.state.value
        expect(state.collapseDistance).toBe(104)
        expect(state.collapseOffset).toBe(80)
        expect(state.phase).toBe("collapsing")

        wrapper.unmount()
        vi.restoreAllMocks()
    })
})
