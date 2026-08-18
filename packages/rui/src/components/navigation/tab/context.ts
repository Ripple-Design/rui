import type { InjectionKey, Ref } from "vue"

import type { RTabBarColor, RTabIconLayout } from "./types.ts"

export type RTabBarContext = {
    color: Readonly<Ref<RTabBarColor>>
    iconLayout: Readonly<Ref<RTabIconLayout>>
}

export const tabBarKey: InjectionKey<RTabBarContext> = Symbol("tabBar")
