import { describe, expect, it } from "vitest"

import { mergeTheme, themeToCSSVars } from "../core"
import { defaultDarkTheme, defaultLightTheme } from "../defaults"

describe("theme shapes", () => {
    it("serializes icon shape values", () => {
        const vars = themeToCSSVars({
            shape: {
                icon: {
                    family: "rounded",
                    corners: [8, "1rem"],
                },
            },
        })

        expect(vars).toMatchObject({
            "--rui-sys-shape-icon-family": "round",
            "--rui-sys-shape-icon-start-start": "8px",
            "--rui-sys-shape-icon-start-end": "1rem",
            "--rui-sys-shape-icon-end-end": "8px",
            "--rui-sys-shape-icon-end-start": "1rem",
        })
    })

    it("merges icon shape patches", () => {
        const theme = mergeTheme(defaultLightTheme, {
            shape: {
                icon: {
                    family: "cut",
                },
            },
        })

        expect(theme.shape?.icon).toEqual({
            family: "cut",
            corners: "9999px",
        })
    })

    it("defines rounded icon defaults for both modes", () => {
        expect(defaultLightTheme.shape?.icon).toEqual({
            family: "rounded",
            corners: "9999px",
        })
        expect(defaultDarkTheme.shape?.icon).toEqual({
            family: "rounded",
            corners: "9999px",
        })
    })
})
