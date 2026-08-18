import type { InjectionKey, Ref } from "vue"

import type { RListDivider } from "./types.ts"

export type RListContext = {
    divider: Ref<RListDivider>
}

export const listKey: InjectionKey<RListContext> = Symbol("rui-list")
