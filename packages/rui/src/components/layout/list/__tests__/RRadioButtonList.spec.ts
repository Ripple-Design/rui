import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RRadioButtonListGroup from "../RRadioButtonListGroup.vue"
import RRadioButtonListItem from "../RRadioButtonListItem.vue"

describe("RRadioButtonListItem", () => {
    it("renders a list row with a native radio and list slots", () => {
        const wrapper = mount(RRadioButtonListItem, {
            props: { value: "pro", lines: 2 },
            slots: {
                default: () => "Pro",
                supporting: () => "For growing teams",
                trailing: () => "$28",
            },
        })

        expect(wrapper.element.tagName).toBe("LI")
        expect(wrapper.findAll("input[type='radio']")).toHaveLength(1)
        expect(wrapper.get(".rui-radio-button-list-item__title").text()).toBe("Pro")
        expect(wrapper.get(".rui-radio-button-list-item__supporting").text()).toBe("For growing teams")
        expect(wrapper.get(".rui-radio-button-list-item__trailing").text()).toBe("$28")
        expect(wrapper.classes()).toContain("rui-radio-button-list-item--2-line")
    })

    it("updates standalone boolean v-model through the native radio", async () => {
        const wrapper = mount(RadioButtonHost)
        const input = wrapper.get("input")

        await input.setValue(true)

        expect(wrapper.vm.checked).toBe(true)
    })
})

describe("RRadioButtonListGroup", () => {
    it("provides a grouped list with required default selection", async () => {
        const selected = { value: null as string | null }
        const wrapper = mount(RadioButtonListGroupHost, {
            props: { selected },
        })

        await nextTick()

        expect(wrapper.get("[role='radiogroup']").exists()).toBe(true)
        expect(wrapper.get("ul").exists()).toBe(true)
        expect(wrapper.findAll("li")).toHaveLength(2)
        expect(selected.value).toBe("starter")
        expect(wrapper.findAll("input[tabindex='0']")).toHaveLength(1)
    })

    it("changes the selected value when a row radio is activated", async () => {
        const wrapper = mount(RadioButtonListGroupHost, {
            props: { selected: { value: null as string | null } },
        })
        const inputs = wrapper.findAll("input[type='radio']")

        await inputs[1]!.setValue(true)

        expect(wrapper.vm.selected.value).toBe("pro")
    })
})

const RadioButtonHost = {
    components: { RRadioButtonListItem },
    data: () => ({ checked: false }),
    template: `<RRadioButtonListItem v-model="checked">Standalone</RRadioButtonListItem>`,
}

const RadioButtonListGroupHost = {
    components: { RRadioButtonListGroup, RRadioButtonListItem },
    props: { selected: { type: Object, required: true } },
    template: `
        <RRadioButtonListGroup v-model="selected.value" name="plan" aria-label="Plans">
            <RRadioButtonListItem value="starter">Starter</RRadioButtonListItem>
            <RRadioButtonListItem value="pro">Pro</RRadioButtonListItem>
        </RRadioButtonListGroup>
    `,
}
