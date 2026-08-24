import { defineComponent, h, ref, render } from "vue"

import type {
    RDialogAlertOptions,
    RDialogAlertResult,
    RDialogTextFieldOptions,
    RDialogTextFieldResult,
} from "./types.ts"
import type { RModalCloseDetail } from "@/primitives/modal/types.ts"

import RDialog from "./RDialog.vue"
import RTextFieldDialog from "./RTextFieldDialog.vue"

function assertBrowser() {
    if (typeof document === "undefined") {
        throw new Error("[RDialogs] Dialogs can only be opened in a browser.")
    }
}

function createHost() {
    const host = document.createElement("div")
    document.body.append(host)

    return host
}

function disposeHost(host: HTMLDivElement) {
    render(null, host)
    host.remove()
}

function mountAlert(options: RDialogAlertOptions): Promise<RDialogAlertResult> {
    assertBrowser()

    return new Promise((resolve, reject) => {
        const host = createHost()
        let disposed = false
        let detail: RModalCloseDetail | null = null

        function dispose() {
            if (disposed || !detail) return
            disposed = true
            disposeHost(host)
            resolve(detail)
        }

        const DialogHost = defineComponent({
            setup() {
                const open = ref(true)

                return () =>
                    h(RDialog, {
                        ...options,
                        modelValue: open.value,
                        "onUpdate:modelValue": (value: boolean) => {
                            open.value = value
                        },
                        onClose: (value: RModalCloseDetail) => {
                            if (detail) return
                            detail = value
                        },
                        onAfterClose: dispose,
                    })
            },
        })

        try {
            render(h(DialogHost), host)
        } catch (error) {
            disposeHost(host)
            reject(error)
        }
    })
}

function mountTextField(options: RDialogTextFieldOptions): Promise<RDialogTextFieldResult> {
    assertBrowser()

    return new Promise((resolve, reject) => {
        const host = createHost()
        let disposed = false
        let detail: RModalCloseDetail | null = null
        let result: RDialogTextFieldResult | null = null

        function dispose() {
            if (disposed || !result) return
            disposed = true
            disposeHost(host)
            resolve(result)
        }

        const DialogHost = defineComponent({
            setup() {
                const open = ref(true)
                const value = ref(options.value ?? "")

                return () =>
                    h(RTextFieldDialog, {
                        ...options,
                        modelValue: open.value,
                        value: value.value,
                        "onUpdate:modelValue": (nextOpen: boolean) => {
                            open.value = nextOpen
                        },
                        "onUpdate:value": (nextValue: string | undefined) => {
                            value.value = nextValue ?? ""
                        },
                        onClose: (nextDetail: RModalCloseDetail) => {
                            if (detail) return
                            detail = nextDetail
                            result = { value: value.value, detail }
                        },
                        onAfterClose: dispose,
                    })
            },
        })

        try {
            render(h(DialogHost), host)
        } catch (error) {
            disposeHost(host)
            reject(error)
        }
    })
}

export const RDialogs = {
    alert(options: RDialogAlertOptions) {
        return mountAlert(options)
    },
    textField(options: RDialogTextFieldOptions) {
        return mountTextField(options)
    },
}
