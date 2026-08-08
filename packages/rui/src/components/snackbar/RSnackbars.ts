import { readonly, ref, shallowReactive, type Ref } from "vue"

import type {
    RSnackbarDismissReason,
    RSnackbarHandle,
    RSnackbarOptions,
} from "./types"

export type SnackbarRecord = {
    id: string
    options: RSnackbarOptions
    open: boolean
    reason: RSnackbarDismissReason | null
    dismissed: boolean
    shown: boolean
    shownRef: Ref<boolean>
}

export type SnackbarSnapshot = {
    current: SnackbarRecord | null
    next: SnackbarRecord | null
}

type Listener = (snapshot: SnackbarSnapshot) => void

const state = shallowReactive<{ current: SnackbarRecord | null; next: SnackbarRecord | null }>({
    current: null,
    next: null,
})

const listeners = new Set<Listener>()
let sequence = 0
let hostCount = 0

function publish() {
    const snapshot = { current: state.current, next: state.next }
    listeners.forEach((listener) => listener(snapshot))
}

function createId() {
    sequence += 1
    return `snackbar-${sequence}`
}

function normalizeOptions(options: string | RSnackbarOptions): RSnackbarOptions {
    return typeof options === "string" ? { message: options } : { ...options }
}

function invokeShown(record: SnackbarRecord) {
    if (record.shown) return
    record.shown = true
    record.shownRef.value = true
    record.options.onShown?.()
}

function notifyShown(id: string) {
    const record = state.current?.id === id ? state.current : state.next?.id === id ? state.next : null
    if (record) invokeShown(record)
}

function invokeDismissed(record: SnackbarRecord, reason: RSnackbarDismissReason) {
    if (record.dismissed) return
    record.dismissed = true
    record.shownRef.value = false
    record.options.onDismissed?.(reason)
}

function createRecord(options: RSnackbarOptions): SnackbarRecord {
    const record = {} as SnackbarRecord
    record.id = createId()
    record.options = options
    record.open = true
    record.reason = null
    record.dismissed = false
    record.shown = false
    record.shownRef = ref(false)
    return record
}

function requestDismiss(id: string, reason: RSnackbarDismissReason) {
    const current = state.current
    if (current?.id === id) {
        if (!current.open) return
        state.current = {
            ...current,
            open: false,
            reason,
        }
        publish()
        return
    }

    if (state.next?.id === id) {
        const removed = state.next
        state.next = null
        invokeDismissed(removed, reason)
        publish()
    }
}

function notifyDismissed(id: string, reason?: RSnackbarDismissReason) {
    const current = state.current
    if (!current || current.id !== id) return

    const dismissedReason = reason ?? current.reason ?? "manual"
    state.current = null
    invokeDismissed(current, dismissedReason)

    if (state.next) {
        const next = state.next
        state.next = null
        next.open = true
        state.current = next
    }

    publish()
}

function subscribe(listener: Listener) {
    listeners.add(listener)
    listener({ current: state.current, next: state.next })
    hostCount += 1

    return () => {
        listeners.delete(listener)
        hostCount = Math.max(0, hostCount - 1)
    }
}

function show(options: string | RSnackbarOptions): RSnackbarHandle {
    const record = createRecord(normalizeOptions(options))

    if (!state.current) {
        state.current = record
    } else {
        const removed = state.next
        state.next = record
        if (removed) invokeDismissed(removed, "consecutive")
        requestDismiss(state.current.id, "consecutive")
    }

    publish()

    return {
        id: record.id,
        isShown: readonly(record.shownRef),
        dismiss: (reason = "manual") => requestDismiss(record.id, reason),
        update: (updates) => {
            const target = state.current?.id === record.id ? state.current : state.next?.id === record.id ? state.next : null
            if (target) {
                const updated = { ...target, options: { ...target.options, ...updates } }
                if (state.current?.id === record.id) state.current = updated
                else state.next = updated
                publish()
            }
        },
    }
}

export const RSnackbars = {
    show,
    dismiss(reason: RSnackbarDismissReason = "manual") {
        if (state.current) requestDismiss(state.current.id, reason)
    },
}

export function useRSnackbarStore() {
    return {
        subscribe,
        notifyShown,
        notifyDismissed,
        requestDismiss,
        getState: () => ({ current: state.current, next: state.next }),
        getHostCount: () => hostCount,
    }
}
