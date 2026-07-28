import { R_ICON_STYLES } from "@/foundations/icon"

import type { RDayNightTheme, RTheme } from "./types"

export const defaultLightTheme: RTheme = {
    color: {
        primary: "#6200ee",
        primaryLight: "#bb86fc",
        primaryDark: "#3700b3",
        onPrimary: "#ffffff",
        secondary: "#03dac6",
        secondaryLight: "#70efde",
        secondaryDark: "#00b3a6",
        onSecondary: "#000000",
        background: "#eeeeee",
        onBackground: "#000000",
        surface: "#fafafa",
        surfaceDark: "#f5f5f5",
        onSurface: "#000000",
        error: "#b00020",
        onError: "#ffffff",
    },
    density: 0,
    iconStyle: R_ICON_STYLES[0],
    shape: {
        small: { family: "rounded" },
        medium: { family: "rounded" },
        large: { family: "rounded" },
        full: { family: "rounded" },
    },
}

export const defaultDarkTheme: RTheme = {
    color: {
        primary: "#bb86fc",
        primaryLight: "#e2b8ff",
        primaryDark: "#8856c7",
        onPrimary: "#000000",
        secondary: "#03dac6",
        secondaryLight: "#66fff8",
        secondaryDark: "#00a896",
        onSecondary: "#000000",
        background: "#121212",
        onBackground: "#ffffff",
        surface: "#1e1e1e",
        surfaceDark: "#171717",
        onSurface: "#ffffff",
        error: "#cf6679",
        onError: "#000000",
    },
    density: 0,
    iconStyle: R_ICON_STYLES[0],
    shape: {
        small: { family: "rounded" },
        medium: { family: "rounded" },
        large: { family: "rounded" },
        full: { family: "rounded" },
    },
}

export const defaultDayNightTheme: RDayNightTheme = {
    day: defaultLightTheme,
    night: defaultDarkTheme,
}
