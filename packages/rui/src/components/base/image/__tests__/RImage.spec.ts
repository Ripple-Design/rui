import { mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"

import RImage from "../RImage.vue"

describe("RImage", () => {
    it("shows the loading state on the native image and removes it after loading", async () => {
        const wrapper = mount(RImage, {
            props: {
                src: "/images/logo.png",
                alt: "Ripple logo",
            },
        })

        expect(wrapper.element.tagName).toBe("IMG")
        expect(wrapper.element.children).toHaveLength(0)
        expect(wrapper.attributes("src")).toBe("/images/logo.png")
        expect(wrapper.attributes("alt")).toBe("Ripple logo")
        expect(wrapper.classes()).toContain("rui-image--loading")
        expect(wrapper.attributes("style")).toBeUndefined()

        await wrapper.trigger("load")

        expect(wrapper.classes()).toEqual(["rui-image--loaded"])
    })

    it("preserves an empty alt attribute for decorative images", () => {
        const wrapper = mount(RImage, {
            props: {
                src: "/images/decorative.png",
                alt: "",
            },
        })

        expect(wrapper.attributes("alt")).toBe("")
    })

    it("forwards native attributes to the image element", async () => {
        const wrapper = mount(RImage, {
            props: {
                src: "/images/photo.png",
                alt: "Photo",
            },
            attrs: {
                id: "profile-photo",
                class: "rounded",
                style: "display: block",
                "data-testid": "image",
                "aria-label": "Profile photo",
                width: 320,
                loading: "lazy",
                srcset: "/images/photo-2x.png 2x",
            },
        })

        await wrapper.trigger("load")

        expect(wrapper.attributes("id")).toBe("profile-photo")
        expect(wrapper.classes()).toEqual(["rounded", "rui-image--loaded"])
        expect(wrapper.attributes("style")).toBe("display: block;")
        expect(wrapper.attributes("data-testid")).toBe("image")
        expect(wrapper.attributes("aria-label")).toBe("Profile photo")
        expect(wrapper.attributes("width")).toBe("320")
        expect(wrapper.attributes("loading")).toBe("lazy")
        expect(wrapper.attributes("srcset")).toBe("/images/photo-2x.png 2x")
    })

    it("applies the requested aspect ratio while preserving consumer styles", () => {
        const wrapper = mount(RImage, {
            props: {
                src: "/images/photo.png",
                alt: "Photo",
                aspectRatio: "16 / 9",
            },
            attrs: {
                style: "display: block",
            },
        })

        expect(wrapper.element.style.display).toBe("block")
        expect(wrapper.element.style.aspectRatio).toBe("16 / 9")
    })

    it("forwards native image events", async () => {
        const onLoad = vi.fn()
        const onError = vi.fn()
        const wrapper = mount(RImage, {
            props: {
                src: "/images/photo.png",
                alt: "Photo",
            },
            attrs: {
                onLoad,
                onError,
            },
        })

        await wrapper.trigger("load")
        await wrapper.trigger("error")

        expect(onLoad).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenCalledTimes(1)
    })

    it("updates the native src attribute when the prop changes", async () => {
        const wrapper = mount(RImage, {
            props: {
                src: "/images/first.png",
                alt: "Photo",
            },
        })

        await wrapper.setProps({ src: "/images/second.png" })

        expect(wrapper.attributes("src")).toBe("/images/second.png")
    })
})
