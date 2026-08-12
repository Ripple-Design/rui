import type { RFloatingPortalTarget, RFloatingReactive } from "@/foundations/floating"

export type RTeleportPortal = "modal" | "docked"

export type RTeleportProps = {
    portal?: RTeleportPortal
    target?: RFloatingReactive<RFloatingPortalTarget>
}
