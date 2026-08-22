import {
    RDialogs,
    type RDialogAlertResult,
    type RDialogTextFieldResult,
    type RModalCloseDetail,
} from "@ripple-design/rui"

async function consumeDialogs() {
    const alertResult: RDialogAlertResult = await RDialogs.alert({
        message: "Item archived",
        positive: true,
    })
    const alertDetail: RModalCloseDetail = alertResult

    const textFieldResult: RDialogTextFieldResult = await RDialogs.textField({
        label: "Name",
        value: "Initial name",
        negative: true,
        positive: { label: "Save", variant: "contained" },
    })
    const value: string = textFieldResult.value
    const detail: RModalCloseDetail = textFieldResult.detail

    // @ts-expect-error Imperative dialogs own their open state.
    RDialogs.alert({ message: "Item archived", modelValue: true })
    // @ts-expect-error Imperative dialogs own their text value updates.
    RDialogs.textField({ label: "Name", "onUpdate:value": () => {} })

    void alertDetail
    void value
    void detail
}

void consumeDialogs
