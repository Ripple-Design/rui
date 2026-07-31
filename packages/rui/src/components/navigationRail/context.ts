import type { InjectionKey } from "vue"

import type { RSelectionModelContext } from "@/foundations/selectionModel"

import type { RNavigationRailLabelVisibility } from "./types"

export type RNavigationRailContext = RSelectionModelContext & {
    compact: boolean
    labelVisibility: RNavigationRailLabelVisibility
}

export const navigationRailKey: InjectionKey<RNavigationRailContext> = Symbol("navigationRail")
