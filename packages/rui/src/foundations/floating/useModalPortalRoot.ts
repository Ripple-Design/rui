import { RUI_MODAL_PORTAL_ID } from "./teleportConstants"

export function ensureModalPortalRoot() {
    if (typeof document === "undefined") {
        return null
    }

    const existing = document.getElementById(RUI_MODAL_PORTAL_ID)
    const root = existing instanceof HTMLElement ? existing : document.createElement("div")

    root.id = RUI_MODAL_PORTAL_ID
    root.style.removeProperty("display")
    root.style.removeProperty("position")
    root.style.removeProperty("inset")
    root.style.removeProperty("pointer-events")
    root.style.removeProperty("z-index")

    if (!existing) {
        document.body.append(root)
    }

    return root
}
