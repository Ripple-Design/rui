import type { InjectionKey, Ref } from "vue"

import type { RTabIconLayout } from "./types"

export type RTabBarContext = {
    iconLayout: Readonly<Ref<RTabIconLayout>>
}

export const tabBarKey: InjectionKey<RTabBarContext> = Symbol("tabBar")
