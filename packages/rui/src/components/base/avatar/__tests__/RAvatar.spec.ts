import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import RAvatar from "../RAvatar.vue"

describe("RAvatar", () => {
    it("renders an image at the default size", () => {
        const wrapper = mount(RAvatar, {
            props: {
                src: "/images/ada.png",
                alt: "Ada Lovelace",
            },
        })

        expect(wrapper.element.tagName).toBe("SPAN")
        expect(wrapper.classes()).toContain("rui-avatar")
        expect(wrapper.element.style.getPropertyValue("--rui-comp-avatar-size")).toBe("40px")
        expect(wrapper.find("img").attributes("src")).toBe("/images/ada.png")
        expect(wrapper.find("img").attributes("alt")).toBe("Ada Lovelace")
    })

    it("accepts string and numeric sizes", async () => {
        const wrapper = mount(RAvatar, {
            props: {
                alt: "Ada Lovelace",
                size: "3rem",
            },
        })

        expect(wrapper.element.style.getPropertyValue("--rui-comp-avatar-size")).toBe("3rem")

        await wrapper.setProps({ size: 56 })

        expect(wrapper.element.style.getPropertyValue("--rui-comp-avatar-size")).toBe("56px")
    })

    it("forwards root and native image attributes to their intended elements", () => {
        const wrapper = mount(RAvatar, {
            props: {
                src: "/images/ada.png",
                alt: "Ada Lovelace",
            },
            attrs: {
                id: "profile-photo",
                class: "avatar-demo",
                style: "margin-inline-end: 8px",
                "data-testid": "avatar",
                loading: "lazy",
                decoding: "async",
                srcset: "/images/ada-2x.png 2x",
                width: 160,
            },
        })

        const image = wrapper.find("img")

        expect(wrapper.attributes("id")).toBe("profile-photo")
        expect(wrapper.classes()).toContain("avatar-demo")
        expect(wrapper.attributes("data-testid")).toBe("avatar")
        expect(wrapper.element.style.marginInlineEnd).toBe("8px")
        expect(image.attributes("loading")).toBe("lazy")
        expect(image.attributes("decoding")).toBe("async")
        expect(image.attributes("srcset")).toBe("/images/ada-2x.png 2x")
        expect(image.attributes("width")).toBe("160")
    })

    it("emits image events and replaces a failed image with fallback content", async () => {
        const wrapper = mount(RAvatar, {
            props: {
                src: "/images/ada.png",
                alt: "Ada Lovelace",
            },
            slots: {
                default: "AL",
            },
        })

        await wrapper.find("img").trigger("load")
        expect(wrapper.emitted("load")).toHaveLength(1)

        await wrapper.find("img").trigger("error")

        expect(wrapper.emitted("error")).toHaveLength(1)
        expect(wrapper.find("img").exists()).toBe(false)
        expect(wrapper.text()).toBe("AL")
        expect(wrapper.attributes("role")).toBe("img")
        expect(wrapper.attributes("aria-label")).toBe("Ada Lovelace")
    })

    it("uses fallback content when an image source is absent", () => {
        const wrapper = mount(RAvatar, {
            props: {
                alt: "Ada Lovelace",
            },
            slots: {
                default: "AL",
            },
        })

        expect(wrapper.find("img").exists()).toBe(false)
        expect(wrapper.classes()).toContain("rui-avatar--fallback")
        expect(wrapper.text()).toBe("AL")
    })

    it("keeps decorative fallback hidden from assistive technology", () => {
        const wrapper = mount(RAvatar, {
            props: {
                alt: "",
            },
            slots: {
                default: "AL",
            },
        })

        expect(wrapper.attributes("role")).toBeUndefined()
        expect(wrapper.attributes("aria-hidden")).toBe("true")
    })

    it("retries an image after its source changes", async () => {
        const wrapper = mount(RAvatar, {
            props: {
                src: "/images/first.png",
                alt: "Ada Lovelace",
            },
            slots: {
                default: "AL",
            },
        })

        await wrapper.find("img").trigger("error")
        expect(wrapper.find("img").exists()).toBe(false)

        await wrapper.setProps({ src: "/images/second.png" })

        expect(wrapper.find("img").attributes("src")).toBe("/images/second.png")
    })
})
