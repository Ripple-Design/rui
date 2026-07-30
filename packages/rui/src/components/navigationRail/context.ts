import type { InjectionKey } from "vue"

import type { RSelectionModelContext } from "@/foundations/selectionModel"

import type { RNavigationRailLabelVisibility } from "./types"

export type RNavigationRailContext = RSelectionModelContext & {
    labelVisibility: RNavigationRailLabelVisibility
}

export const navigationRailKey: InjectionKey<RNavigationRailContext> = Symbol("navigationRail")
