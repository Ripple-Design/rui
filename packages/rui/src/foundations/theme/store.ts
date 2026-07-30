import { shallowRef } from "vue"

import type { RTheme } from "./types"

export const globalTheme = shallowRef<RTheme>({})

export function setGlobalTheme(theme: RTheme) {
    globalTheme.value = theme
}
