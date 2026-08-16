import type { ComputedRef, InjectionKey } from "vue"

import type { RSelectionModelContext } from "@/foundations/selection"

import type { RBottomNavigationColor, RBottomNavigationLabelVisibility } from "./types"

export type RBottomNavigationContext = RSelectionModelContext & {
    color: ComputedRef<RBottomNavigationColor>
    horizontalTranslation: ComputedRef<boolean>
    labelVisibility: ComputedRef<Exclude<RBottomNavigationLabelVisibility, "auto">>
    layoutVersion: ComputedRef<number>
    transitionsEnabled: ComputedRef<boolean>
}

export const bottomNavigationKey: InjectionKey<RBottomNavigationContext> = Symbol("bottomNavigation")
