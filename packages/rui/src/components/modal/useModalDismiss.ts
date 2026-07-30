import { RUI_MODAL_ACTION_ATTRIBUTE } from "./constants.ts"

export function getActionTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) return null
    return target.closest<HTMLElement>(`[${RUI_MODAL_ACTION_ATTRIBUTE}]`)
}

export function getActionValue(target: HTMLElement) {
    return target.getAttribute(RUI_MODAL_ACTION_ATTRIBUTE) ?? ""
}

export function isBackdropClick(event: MouseEvent, dialog: HTMLDialogElement) {
    return event.target === dialog && event.currentTarget === dialog
}
