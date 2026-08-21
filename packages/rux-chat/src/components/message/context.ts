import type { InjectionKey, Ref } from "vue"

import type { RMessageSender } from "./types"

export const messageGroupKey: InjectionKey<Readonly<Ref<RMessageSender>>> = Symbol("rux-message-group")
